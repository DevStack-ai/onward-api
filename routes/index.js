const express = require('express');
const { default: axios } = require('axios');
const router = express.Router();

const { Containers } = require("../db/sequelize")

router.get('/', (req, res) => {
  res.send("ok");
});
router.all('/webhook', async (req, res) => {
  try {

    const payload = req.body
    await LogsController.create(payload)
    const url = "https://services.ordertime.com/api/salesorder"

    const apiKey = "679a4193-297e-4821-b7de-9082129c13bf"
    const email = "ddelvalle@onwardbpo.com"
    const password = "Dulce12345"

    const headers = {
      apiKey,
      email,
      password
    }

    console.log(payload)
    const query = await axios.get(`${url}?docNo=${payload.UniqueId}`, { headers })

    const order = query.data
    const newContainer = Containers({ ...container })
    await newContainer.save()
    const container = {
      "source": "EUFORIA",
      "company": "CGI",
      "status_bpo": "CERRADO - APROBADO POR EL CLIENTE",
      "reference": order.CustomerPO,
      "reference_alt": String(payload.UniqueId).padStart(4, "0"),
      "total_amount": order.TotalAmount,
      "customer_id": order.CustomerRef.Id,
      "customer": order.CustomerRef.Name,
      "docto_no": payload.UniqueId,
      "trans_type": order.LineItems.length ? order.LineItems[0].TranType : "",
      "order_time": payload.ActionDate,
      "close_date": order.Date
    }
    const mock = {
      "SO_NUMERO_DOC": payload.UniqueId,
      "SO_COMPANY_CODE": "10",
      "SO_COMPANY_DESC": "CGI",
      "SO_CUSTOMER_COD": order.CustomerRef.Id,
      "SO_CUSTOMER_NAME": order.CustomerRef.Name,
      "SO_STATUS_COD": "200",
      "SO_STATUS": "CERRADO - APROBADO POR EL CLIENTE",
      "SO_MONTO": order.TotalAmount.toFixed(2),
      "Entry_Number": "",
      "Referencia": order.CustomerPO,
      "Referencia2": String(payload.UniqueId).padStart(4, "0"),
      "Numero_Contenedor": "",
      "Fecha_Cierre": order.Date,
      "Fecha_S_Bodega": null,
      "F_Zarpe": null,
      "F_Arribo": null,
      "FDA": "",
      "CBP": "",
      "USDA": "",
      "LFD": null,
      "LFD_Fee": "0.01",
      "F_Estimada_Entrega": null,
      "F_Confirmada_Entrega": null,
      "OBS": ""
    }
    await axios.post("http://79.143.91.197/servicios/insertarContenedor.php", order)
    await axios.post("http://79.143.91.197/servicios/reporteBase.php?metodo=insertar", mock)
    res.send(order)
  } catch (err) {
    console.log(err)
  }
});

router.post("/contenedor", async (req, res) => {
  try {
    const container = req.body
    const newContainer = Containers({ ...container })
    await newContainer.save()
    res.status(201)
    res.send({ message: "created", data: newContainer.uid })
  } catch (err) {
    console.log(err)
    res.status(400).send({ message: "server error" })
  }
})

router.use("/users", require("./users"))
router.use("/containers", require("./containers"))
router.use("/history", require("./history"))

module.exports = router;
