const express = require('express');
const { default: axios } = require('axios');
const router = express.Router();
const moment = require("moment")
const LogsController = require('../controllers/logs');
const ContainerController = require('../controllers/containers')
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
    console.log(order)

    const container = {
      "source": "EUFORIA",
      "company": "CGI",
      "status": "CERRADO - APROBADO POR EL CLIENTE",
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
    await ContainerController.create(container)
    await axios.post("https://wge4iacxr4.execute-api.us-east-2.amazonaws.com/v1/insertar", order)
    res.send(order)
  } catch (err) {
    console.log(err)
  }
});
router.use("/users", require("./users"))
router.use("/containers", require("./containers"))
router.use("/history", require("./history"))

module.exports = router;
