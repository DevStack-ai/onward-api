const { toJSON, flattenArray } = require("./helpers");
const db = require('../firebase/firestore');
const excelJS = require("exceljs");
const moment = require("moment");
const _ = require("lodash")

const defaultOptions = {
    ref: "uid",
    orderBy: "write",
    orderDirection: "desc",
    deprecatedField: "deprecated",
    writeField: "write",
    page: 1,
    initValue: 0,
    itemsPerPage: 30
}
/**
 * @typedef {Object} DataTable
 * @property {Array} documents - documents from query
 * @property {number} count - total number of documents
 * @property {number} pages - pages available
 * @property {Object} totalize - fields totaled
 */
/**
 * @typedef {Object} ToteObject
 * @property {string} field - name of field to calculate data
 * @property {function} calculate - function to calculate the value
 */

/**
 * @typedef {Object} Populate
 * @property {string} collection - collection from where get documents
 * @property {string} ref - field to match with from
 * @property {string} from - field to replace
 * @property {string} field - field to get value from
 * @property {string|function} to - new fielt to populated value

 *//**
* @typedef {Object} FilterPopulate
* @property {string} collection - collection from where get documents
* @property {string[]} filters - field to match with from
* @property {string} match - field to match with from
*/
function Controller(table, options = defaultOptions) {

    this.table = table
    this.options = options
    this.collection = db.collection(table)
    /**
     * create a document 
     * @param {Object} body  - body of document
     * @returns {Promise<string>} uid of document created
     */
    this.create = async function (body) {

        const uid = body.uid
        const document = {
            ...body,
            id: 1,
            deprecated: false,
            write: moment().toDate()
        }
        if (uid) {
            const ref = this.collection.doc(uid)
            await ref.set(document)
            return uid
        } else {
            const newDocument = await this.collection.add(document)
            return newDocument.id
        }
    };
    /**
     * return document by uid
     * @param {string} uid - uid of document
     * @returns {Promise<FirebaseFirestore.DocumentData>} document object
     */
    this.get = async function (uid, options = {}) {
        if (!uid) {
            return { uid }
            // throw Error("uid undefined");
        }
        // if (typeof uid !== "string") {
        //     throw Error("uid diferent type than 'string'");
        // }
        let document = null
        let query = null
        if (typeof options.field === "string") {
            query = await this.collection.where(options.field, "==", uid).get();
            // if (!query.docs[0] && !options.ignoreTryCatch) {
            //     throw Error("Document dont exist");
            // }
            query = query.docs[0]
        } else {
            query = await this.collection.doc(uid).get();

        }
        if (!query?.exists) {
            return null

            // throw Error("Document dont exist");
        }
        document = query ? toJSON(query) : { uid }

        let hash = document
        let _queue = []
        if (options.populates) {
            for (const populate of options.populates) {
                const ref = populate.ref || this.options.ref
                const uid = document[populate.from]
                if (!uid) {
                    continue
                }
                const callback = doc => {
                    const replace = toJSON(doc);
                    const populateIsFunction = typeof populate.field === "function"
                    const field = populate.to || populate.from
                    hash[field] = populateIsFunction ? populate.field(replace) : replace[populate.field]
                    hash[`${field}_${ref}`] = document[populate.from]
                }
                const query = db.collection(populate.collection).doc(uid).get().then(callback)
                _queue.push(query);

            }
            await Promise.all(_queue);

        }

        return { ...document, ...hash }
    };
    /**
     * delete document by uid
     * @param {string} uid - uid of document
     * @returns {Promise<Boolean>} true if the delete of document was successfully
     */
    this.delete = async function (uid) {
        if (!uid) {
            throw Error("uid undefined");
        }
        if (typeof uid !== "string") {
            throw Error("uid diferent type than 'string'");
        }

        await this.collection.doc(uid).delete()
        return true
    };
    /**
     * move to deprecated document by uid
     * @param {string} uid - uid of document
     * @returns {Promise<Boolean>} true if the delete of document was successfully
     */
    this.deprecated = async function (uid) {
        if (!uid) {
            throw Error("uid undefined");
        }
        if (typeof uid !== "string") {
            throw Error("uid diferent type than 'string'");
        }

        await this.collection.doc(uid).update({
            deprecated: true,
            deprecated_date: moment().toDate()
        })
        return true
    };
    /**
     * update document by uid
     * @param {string} uid - uid of document
     * @returns {Promise<Boolean>} true if the delete of document was successfully
     */
    this.update = async function (uid, body) {
        if (!uid) {
            throw Error("uid undefined");
        }
        if (typeof uid !== "string") {
            throw Error("uid diferent type than 'string'");
        }
        delete body.year
        delete body.month
        await this.collection.doc(uid).set({
            ...body,
            last_update: moment().toDate()
        }, { merge: true })
        return true
    };
    /**
     * get multiple documents by uids
     * @param {String[]} uids - uids of document
     * @param {"hash|array"} mode - of documents structure 
     * @returns {Promise<Object|Object[]>} true if the delete of document was successfully
     */
    this.getMultiple = async function (uids, mode = "hash", options = {}) {
        if (!uids) {
            throw Error("Uids are undefined")
        }
        if (!Array.isArray(uids)) {
            throw Error("parameter is no an array")
        }

        const _queue = []
        const unique = [...new Set(uids)].filter(Boolean)

        for (const uid of unique) {
            if (options.field) {
                _queue.push(this.collection.where(options.field, "==", uid).get());
            } else {
                _queue.push(this.collection.doc(uid).get());

            }
        }

        const query = await Promise.all(_queue);
        const _flatten = flattenArray(!options.field ? query : query.map(d => d.docs))
        const _snapshots = _flatten.filter(document => document.exists)
        const _documents = _snapshots.map(toJSON);
        if (mode === "array") {
            if (options.sortField) {
                return _documents.sort((left, right) => {
                    if (options.sortDirection === "desc") return right[options.sortField] - left[options.sortField]
                    return left[options.sortField] - right[options.sortField]
                })
            }
            return _documents
        }
        if (mode === "hash") {
            const _hash = _documents.reduce((hash, row) => ({ ...hash, [row.uid]: row }), {});
            return _hash
        }

    };

    /**
     * get data table
     * @param {Object} filters - filters to apply in query
     * @param {Object} options - options to change the behavior of the query
     * @param {string} options.orderBy - field to use as order documents
     * @param {string} options.startDate - start date to filter documents
     * @param {string} options.endDate - end date to filter documents
     * @param {number} options.itemsPerPage - items to return per query
     * @param {number} options.page - used to calculate offset in query
     * @param {number} options.writeField - field to filter between dates
     * @param {boolean} options.includeDeprecated -  include deprecated documents in query
     * @param {boolean} options.withoutPagination -  return all documents that fit with filters
     * @param {boolean} options.ignoreWriteFilter -  ignore start date and end date 
     * @param {boolean} options.manualSort - skip orderBy in query
     * @param {FilterPopulate} options.filtersPopulate - skip orderBy in query
     * @param {Populate[]} options.populates - options to make an inner join
     * @param {string[]|ToteObject[]} options.totalize - fields to tote
     * @param {string[]} options.excludeFields - fields to delete in return
     * @returns {Promise<DataTable>} result of query
    */
    this.getTable = async function (options = this.options, filters = {}) {


        ////////////////////////////////////
        let invalid_filters = {}
        let valid_filters = filters
        let hasPopulateFilter = false
        if (!_.isEmpty(filters) && options.filtersPopulate) {
            const keys = Object.keys(filters)
            for (const key of keys) {
                if (!hasPopulateFilter) {
                    hasPopulateFilter = options.filtersPopulate.filters.includes(key)
                }
            }
            if (hasPopulateFilter) {
                for (const key of keys) {
                    if (!options.filtersPopulate.filters.includes(key)) {
                        invalid_filters[key] = valid_filters[key]
                        delete valid_filters[key]
                    }
                }
            }
        }

        //////////////////////////////////// 

        let query = !hasPopulateFilter ? this.collection : db.collection(options.filtersPopulate.collection)
        let wheres = Object.entries(valid_filters)
        let page = Math.abs(options.page || this.options.page)
        let orderBy = options.orderBy || this.options.orderBy
        let itemsPerPage = options.itemsPerPage || this.options.itemsPerPage
        let orderDirection = options.orderDirection || this.options.orderDirection
        let writeField = options.writeField || this.options.writeField
        let offset = itemsPerPage * (page - 1)//documents to skip

        if (!options.ignoreWriteFilter) {
            if (options.startDate && options.endDate) {
                query = query.where(writeField, ">=", moment(`${options.startDate} 00:00:00`, "DD/MM/YYYY HH:mm:ss").toDate())
                query = query.where(writeField, "<=", moment(`${options.endDate} 23:59:59`, "DD/MM/YYYY HH:mm:ss").toDate())
            }
        }

        //////////////////////////////////// filter by fields values and/or write dates 
        if (!_.isEmpty(filters)) {
            for (const [field, filter] of wheres) {

                if (typeof filter === "object" && filter && filter.operation && filter.value) {
                    query = query.where(field, filter.operation, filter.value)
                } else {
                    if (field === "id") {
                        query = query.where(field, "==", Number(filter))
                    } else {
                        query = query.where(field, "==", filter)
                    }
                }

            }
        }


        //////////////////////////////////// includes deprecated documents

        if (!options.includeDeprecated) {
            query = query.where(this.options.deprecatedField, "==", false)
        }

        if (!options.manualSort) {
            if (options.filterSortBy) {
                query = query.orderBy(options.filterSortBy, orderDirection)
            }
            query = query.orderBy(orderBy, orderDirection)
        }

        //////////////////////////////////// count documents

        const count_query = query.count()

        //////////////////////////////////// cut documents or not

        if (!options.withoutPagination) {
            query = query.limit(itemsPerPage).offset(offset)
        }

        //////////////////////////////////// get data

        const [snapshots, metadata] = await Promise.all([
            query.get(),
            count_query.get()
        ])

        let documents = snapshots.docs.map(toJSON)
        let count = metadata.data().count
        ////////////////////////////////////

        if (hasPopulateFilter) {
            const ref = options.filtersPopulate.ref || this.options.ref
            const ref_field = documents.map(doc => doc[ref])
            documents = await this.getMultiple(ref_field, "array", {
                field: options.filtersPopulate.match,
                sortField: options.filtersPopulate.sortField,
                sortDirection: options.filtersPopulate.sortDirection
            })
            if (!_.isEmpty(invalid_filters)) {
                let wheres = Object.entries(invalid_filters)
                for (const [field, filter] of wheres) {
                    if (typeof filter === "object" && filter && filter.operation && filter.value) {
                        switch (filter.operation) {
                            case "in": documents = documents.filter(doc => filter.value.includes(doc[field])); break;
                            case "not-in": documents = documents.filter(doc => !filter.value.includes(doc[field])); break;
                            case "<": documents = documents.filter(doc => doc[field] < filter.value); break;
                            case "<=": documents = documents.filter(doc => doc[field] <= filter.value); break;
                            case ">": documents = documents.filter(doc => doc[field] > filter.value); break;
                            case ">=": documents = documents.filter(doc => doc[field] >= filter.value); break;
                        }
                    } else {
                        if (field === "id") {
                            documents = documents.filter(doc => doc[field] === Number(filter))
                        } else {
                            documents = documents.filter(doc => doc[field] === filter)
                        }
                    }

                }
            }

            count = documents.length
        }

        //////////////////////////////////// inner join between tables

        if (options.populates) {
            let hash = {}
            let _queue = []
            let _querys = []

            for (const populate of options.populates) {
                const ref = populate.ref || this.options.ref

                if (ref === "self") {
                    documents = documents.map(document => {
                        const populateIsFunction = typeof populate.field === "function"

                        return {
                            ...document,
                            [populate.to]: populateIsFunction ? populate.field(document) : document[populate.field],
                        }
                    })
                    continue
                }
                hash[populate.collection] = []
                const values = documents.map(document => document[populate.from])
                const unique = [...new Set(values)].filter(Boolean)

                const callback = doc => hash[populate.collection].push(toJSON(doc))

                for (const uid of unique) {
                    if (!_querys.includes(uid)) {
                        const query = db.collection(populate.collection).doc(uid).get().then(callback)
                        _querys.push(uid)
                        _queue.push(query);
                    }
                }
            }
            await Promise.all(_queue);
            for (const populate of options.populates) {
                const ref = populate.ref || this.options.ref
                if (!populate.collection) {
                    continue
                }
                const data = hash[populate.collection]
                documents = documents.map(document => {
                    const replace = data.find(d => d[ref] === document[populate.from])
                    const populateIsFunction = typeof populate.field === "function"
                    const field = populate.to || populate.from

                    if (!replace) {
                        return document
                    }
                    return {
                        ...document,
                        [field]: populateIsFunction ? populate.field(replace) : replace[populate.field],
                        [`${populate.from}_${ref}`]: document[populate.from]
                    }
                })
            }
        }

        //////////////////////////////////// totaled

        let totaled = {}

        if (options.totalize) {
            for (const tote of options.totalize) {
                if (typeof tote === "string") {
                    const total = [...documents].reduce((acc, document) => acc + document[tote], tote.initValue || this.options.initValue)
                    totaled[tote] = total
                }
                if (typeof tote === "object" && tote.field && tote.calculate) {
                    const total = [...documents].reduce((acc, document) => acc + tote.calculate(document), tote.initValue || this.options.initValue)
                    totaled[tote.field] = total
                }
            }
        }

        //////////////////////////////////// exclude fields

        if (options.excludeFields) {
            for (const field of options.excludeFields) {
                documents = documents.map(doc => {
                    delete doc[field]
                    return doc
                })
            }
        }

        ////////////////////////////////////
        if (options.onlyDocuments) {
            return documents
        }
        return {
            documents: documents,
            count: count,
            pages: Math.ceil(count / itemsPerPage),
            totalize: totaled
        }
    }
    /**
     * get data table
     * @param {Object} options - options to change the behavior of the query
     * @param {string} options.orderBy - field to use as order documents
     * @param {string} options.startDate - start date to filter documents
     * @param {string} options.endDate - end date to filter documents
     * @param {string} options.fileName - name of file
     * @param {number} options.itemsPerPage - items to return per query
     * @param {number} options.page - used to calculate offset in query
     * @param {boolean} options.includeDeprecated -  include deprecated documents in query
     * @param {boolean} options.withoutPagination -  return all documents that fit with filters
     * @param {boolean} options.ignoreWriteFilter -  ignore start date and end date 
     * @param {Populate[]} options.populates - options to make an inner join
     * @returns {Promise<excelJS.Workbook>} 
    */
    this.generateXLS = async function (data, options = this.options) {

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("reporte");

        const exportFields = Object.entries(options.ExportFields)
        const columns = exportFields.map(([field, title]) => ({ header: title, key: field, width: 30 }))
        worksheet.columns = columns

        let counter = 1;
        data.forEach((row) => {
            row.s_no = counter;
            worksheet.addRow(row);
            counter++;
        });
        // Making first line in excel bold
        worksheet.getRow(1).eachCell((cell) => { cell.font = { bold: true } });
        return workbook

    }
}

module.exports = Controller




