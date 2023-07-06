const express = require("express")
const router = express.Router()
const axios = require('axios')
const moment = require('moment')
const containers = require("../../controllers/containers")
const history = require("../../controllers/history")

const ExcelJS = require('exceljs');
const helpers = require("../../controllers/helpers")

const db = require("../../firebase/firestore")

const ship = "https://shipsgo.com/api/v1.1/ContainerService/GetContainerInfo/"
const auth = "4456b633eafbae2220fa4311d6d04dd0"
router.post("/", async (req, res) => {
    try {
        const uids = req.body.containers
        let queue = []

        const documents = await containers.getMultiple(uids, "array")

        for (const uid of uids) {
            const query = axios.get(`${ship}?authCode=${auth}&requestId=${uid}`)
            queue.push(query)
        }
        const result = await Promise.allSettled(queue)
        const fulfilled = result.filter(q => q.status === "fulfilled")
        const response = fulfilled.map(q => q.value.data[0])
        const data = uids.map(uid => {
            const api = response.find(d => d.ContainerNumber === uid) || {}
            const match = documents.find(d => d.uid === uid) || {}
            return {
                ...api,
                ...match
            }
        })
        queue = []
        for (const track of response) {
            const uid = track.ContainerNumber
            track.last_api_request = moment().format("YYYY-MM-DD HH:mm")
            const query = containers.update(uid, track)
            queue.push(query)
        }

        await Promise.allSettled(queue)
        res.status(200).send({ containers: data })
    } catch (err) {
        console.log(err)
        res.status(400).send({ message: "server error" })
    }

})
router.post("/table", async (req, res) => {
    try {
        let queue = []

        const page = req.body.page || 1
        const itemsPerPage = req.body.itemsPerPage || 15

        const options = {
            page,
            itemsPerPage,
            includeDeprecated: true,
            orderBy: "close_date"
        }
        const filters = req.body.filters

        const table = await containers.getTable(options, filters)

        for (const container of table.documents) {
            const today = moment()
            const last_api = container.last_api_request ? moment(container.last_api_request) : moment()
            const difference = today.diff(last_api, "hours")
            if (difference >= 1 || !container.last_api_request) {
                const query = axios.get(`${ship}?authCode=${auth}&requestId=${container.container}`)
                queue.push(query)
            }
        }
        const result = await Promise.allSettled(queue)
        const fulfilled = result.filter(q => q.status === "fulfilled")
        const response = fulfilled.map(q => q.value.data[0])

        const documents = table.documents.map(container => {
            const api = response.find(d => d.ContainerNumber === container.uid) || {}
            return {
                ...container,
                ...api,
            }
        })
        queue = []
        for (const track of response) {
            const uid = track.ContainerNumber
            track.last_api_request = moment().format("YYYY-MM-DD HH:mm")
            const query = containers.update(uid, track)
            queue.push(query)
        }

        await Promise.allSettled(queue)

        res.send({
            pages: table.pages,
            documents: documents,
            total: table.count,
        });
    } catch (err) {
        console.log(err);

        res.status(400).send({ message: "server error" })
        return;
    }
})
router.post("/all", async (req, res) => {
    try {

        const options = { withoutPagination: true, includeDeprecated: true, manualSort: true }

        const table = await containers.getTable(options)
        res.send({
            pages: table.pages,
            documents: table.documents,
            total: table.count,
        });

    } catch (err) {
        console.log(err);

        res.status(400).send({ message: "server error" })
        return;
    }
})
router.get("/:uid", async (req, res) => {


    const uid = req.params.uid.trim()
    const document = await containers.get(uid)
    if (!document) {
        res.status(404).send({ message: "Container not found" })
        return
    }
    let container = { ...document }
    console.log({container})

    const today = moment()
    const last_api = container.last_api_request ? moment(container.last_api_request) : moment()
    const difference = today.diff(last_api, "hours")

    if (difference >= 1 || !container.last_api_request) {
        const query = axios.get(`${ship}?authCode=${auth}&requestId=${document.container}`)
        const [result] = await Promise.allSettled([query])
        console.log(result)
        if (result.status === "fulfilled") {
            container = { ...container, ...(result.value.data[0]), last_api_request: moment().format("YYYY-MM-DD HH:mm") }
        }
    }

    res.status(200).send(container)
    await containers.update(uid, container)
})
router.post("/create", async (req, res) => {
    try {

        const payload = req.body
        let controller = containers
        if (payload.close_date) {
            payload.close_data_query = moment(payload.close_date).toDate()
        } else {
            payload.close_data_query = moment("1900-01-01").toDate()
        }
        if (payload.status) {
            if (["PAGADO", "ANULADO"].includes(payload.status)) {
                controller = history
            }
        }
        let container = { ...payload, uid: null }
        const query = axios.get(`${ship}?authCode=${auth}&requestId=${container.container}`)
        const [result] = await Promise.allSettled([query])
        if (result.status === "fulfilled") {
            container = { ...container, ...(result.value.data[0]), last_api_request: moment().format("YYYY-MM-DD HH:mm") }
        }

        const uid = await controller.create(container)
        res.status(201).send(uid)

    } catch (err) {
        console.log(err);
        res.status(400).send({ message: "server error" })
        return;
    }
})
router.put("/:uid", async (req, res) => {
    try {

        const uid = req.params.uid

        const payload = req.body
        if (payload.close_date) {
            payload.close_data_query = moment(payload.close_date).toDate()
        } else {
            payload.close_data_query = moment("1900-01-01").toDate()
        }
        if (payload.status) {
            if (["PAGADO", "ANULADO"].includes(payload.status)) {
                const container = await containers.get(uid)
                await history.create({
                    uid,
                    ...container,
                    ...payload
                })
                await containers.delete(uid)
                res.status(201).send({ message: "updated successfully" })
                return;
            }
        }
        await containers.update(uid, payload)

        res.status(201).send({ message: "updated successfully" })

    } catch (err) {
        console.log(err);

        res.status(400).send({ message: "server error" })
        return;
    }
})
router.delete("/:uid", async (req, res) => {
    try {

        const uid = req.params.uid


        await containers.delete(uid)

        res.status(201).send({ message: "deprecated successfully" })

    } catch (err) {
        console.log(err);

        res.status(400).send({ message: "server error" })
        return;
    }
})
router.post("/export", async (req, res) => {

    try {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx');

        console.log(req.body)
        const uids = req.body.containers
        let queue = []

        const documents = await containers.getMultiple(uids, "array")

        for (const uid of uids) {
            const query = axios.get(`${ship}?authCode=${auth}&requestId=${uid}`)
            queue.push(query)
        }
        const result = await Promise.allSettled(queue)
        const fulfilled = result.filter(q => q.status === "fulfilled")
        const response = fulfilled.map(q => q.value.data[0])

        const data = uids.map(uid => {
            const api = response.find(d => d.ContainerNumber === uid) || {}
            const match = documents.find(d => d.uid === uid) || {}
            return {
                ...api,
                ...match
            }
        })

        const ExportFields = {
            s_no: "No.",
            container: "Contenedor",
            reference: "REF",
            reference_alt: "REF2",
            source: "SOURCE",
            company: "COMPANY",
            customer: "Cliente",
            status: "Status BPO",
            entry_number: "Entry Number",
            close_date: "Fecha de cierre",
            checkout_date: "Salida de bodega",
            departure_data: "Zarpe",
            arrival_date: "Arribo",
            fda: "FDA",
            cbp: "CBP",
            usda: "USDA",
            lfd: "LFD",
            lfd_fee: "LFD Fee",
            estimated_date: "Estimada de Entrega",
            delivery_date: "Fecha de Entrega",
            obs: "OBS",
            Message: "Message",
            Status: "Status",
            StatusId: "StatusId",
            ReferenceNo: "ReferenceNo",
            BLReferenceNo: "BLReferenceNo",
            ShippingLine: "ShippingLine",
            ContainerNumber: "ContainerNumber",
            FromCountry: "FromCountry",
            Pol: "Pol",
            ToCountry: "ToCountry",
            Pod: "Pod",
            Vessel: "Vessel",
            VesselIMO: "VesselIMO",
            GateOutDate: "GateOutDate",
            FormatedTransitTime: "FormatedTransitTime",
            FirstETA: "FirstETA",
            LiveMapUrl: "LiveMapUrl"
        }



        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("reporte");

        const exportFields = Object.entries(ExportFields)
        const columns = exportFields.map(([field, title]) => ({ header: title, key: field, width: 30 }))
        worksheet.columns = columns


        let counter = 1;
        data.forEach((row) => {
            let _row = { ...row }
            _row.s_no = counter;
            worksheet.addRow(_row);
            counter++;
        });

        worksheet.getRow(1).eachCell((cell) => { cell.font = { bold: true } });
        await workbook.xlsx.write(res)
        res.end();
    } catch (err) {
        console.log(err)
        res.status(400).send({ message: "server error" })
    }
})
router.post("/test", async (req, res) => {
    try {

        const query = await db.collection("own_containers").orderBy("close_data_query").get()
        const containers = query.docs.map(helpers.toJSON).map(d => d.close_date)
        res.send({ containers })
    } catch (err) {
        console.log(err);

        res.status(400).send({ message: "server error" })
        return;
    }
})
module.exports = router