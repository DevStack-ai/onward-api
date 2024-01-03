const express = require("express")
const router = express.Router()
const axios = require('axios')
const moment = require('moment')
const containers = require("../../controllers/containers")

const { Containers, History } = require("../../db/sequelize")
const { v4: uuidv4 } = require("uuid")
const { toWhere } = require('../helpers')
const ExcelJS = require('exceljs');
const ship = "https://shipsgo.com/api/v1.1/ContainerService/GetContainerInfo/"
const auth = "4456b633eafbae2220fa4311d6d04dd0"


router.post("/", async (req, res) => {
    try {
        const uids = req.body.containers
        let queue = []

        const where = uids.map(uid => ({ uid }))
        const documents = await History.find({ where })


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
            const query = History.update(track, { where: { uid } })
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



        const itemsPerPage = req.body.itemsPerPage
        const filters = req.body.filters || {}

        const hasFilters = Object.keys(filters).length
        const where = hasFilters ? toWhere(filters) : {}

        const page = req.body.page ? parseInt(req.body.page) : 1;
        const skip = itemsPerPage * page - itemsPerPage
        const order = [["close_date", "DESC"]]

        const query = hasFilters ?
            History.findAll({ where, order, offset: skip, limit: itemsPerPage }) :
            History.findAll({ order, offset: skip, limit: itemsPerPage });

        const queryCount = hasFilters ?
            History.count({ where }) :
            History.count();

        const count = await queryCount
        const items = await query

        for (const container of items) {
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

        const documents = items.map(_container => {
            const container = _container.dataValues
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
            const query = History.update(track, { where: { uid } })
            queue.push(query)
        }

        await Promise.allSettled(queue)

        res.send({
            pages: Math.ceil(count / itemsPerPage),
            documents: documents,
            total: count,
        });
    } catch (err) {
        console.log(err);

        res.status(400).send({ message: "server error" })
        return;
    }
})
router.post("/all", async (req, res) => {
    try {

        const order = [["close_date", "DESC"]]

        const query = History.findAll({ order })

        const queryCount = History.count();

        const count = await queryCount
        const items = await query

        res.send({
            pages: Math.ceil(items.length / count),
            documents: items,
            total: count,
        });

    } catch (err) {
        console.log(err);

        res.status(400).send({ message: "server error" })
        return;
    }
})
router.get("/:uid", async (req, res) => {


    const uid = req.params.uid.trim()
    const document = await History.findOne({ where: { uid } })
    if (!document) {
        res.status(404).send({ message: "Container not found" })
        return
    }
    let container = { ...document.dataValues }

    const today = moment()
    const last_api = container.last_api_request ? moment(container.last_api_request) : moment()
    const difference = today.diff(last_api, "hours")

    if (difference >= 1 || !container.last_api_request) {
        const query = axios.get(`${ship}?authCode=${auth}&requestId=${document.container || document.ContainerNumber}`)
        const [result] = await Promise.allSettled([query])
        if (result.status === "fulfilled") {
            container = { ...container, ...(result.value.data[0]), last_api_request: moment().format("YYYY-MM-DD HH:mm") }
        }
    }

    res.status(200).send(container)
    await History.update(container, { where: { uid } })

})

router.put("/:uid", async (req, res) => {
    const uid = req.params.uid
    const document = await History.findOne({ where: { uid } })
    if (!document) {
        res.status(404).send({ message: "Container not found" })
        return
    }
    let container = { ...document.dataValues, ...req.body }

    const today = moment()
    const last_api = container.last_api_request ? moment(container.last_api_request) : moment()
    const difference = today.diff(last_api, "hours")
    if (difference >= 1 || !container.last_api_request) {
        const query = axios.get(`${ship}?authCode=${auth}&requestId=${document.uid}`)
        const [result] = await Promise.allSettled([query])
        if (result.status === "fulfilled") {
            container = { ...container, ...(result.value.data[0]), last_api_request: moment().format("YYYY-MM-DD HH:mm") }
        }
    }

    res.status(200).send(container)
    await History.update(container, { where: { uid } })
})
router.delete("/:uid", async (req, res) => {
    try {

        const uid = req.params.uid

        const container = await History.findOne({ uid });
        await container.destroy()

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

        const uids = req.body.containers
        const order = [["close_date", "DESC"]]        
        const containers = await History.findAll({ order })

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
        containers.forEach((row) => {
            let _row = { ...row.dataValues }
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

module.exports = router