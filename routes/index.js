const express = require('express');
const { default: axios } = require('axios');
const router = express.Router();
const moment = require("moment")
const ContainerController = require('../controllers/containers')
router.get('/', (req, res) => {
  res.send("ok");
});
router.all('/webhook', async (req, res) => {
  try {

    const payload = req.body
    // await LogsController.create(payload)
    const url = "https://services.ordertime.com/api/salesorder"

    const apiKey = "679a4193-297e-4821-b7de-9082129c13bf"
    const email = "ddelvalle@onwardbpo.com"
    const password = "Dulce12345"

    const headers = {
      apiKey,
      email,
      password
    }

    if (payload.ActionType === 1) {

      console.log(payload)
      const query = await axios.get(`${url}?docNo=${payload.UniqueId}`, { headers })

      const order = query.data
      
      const container = {
        "reference": order.CustomerPO,
        "reference_alt": String(payload.UniqueId).padStart(4, "0"),
        "source": "",
        "company": "CGI",
        "total_amount": order.TotalAmount,
        "customer": order.CustomerRef.Name,
        "status": "CERRADO - APROBADO POR EL CLIENTE",
        "close_date": order.Date
      }
      console.log(container)
      // await ContainerController.create(container)
      res.send(order)
    }
  } catch (err) {
    console.log(err)
  }
});
router.use("/users", require("./users"))
router.use("/containers", require("./containers"))
router.use("/history", require("./history"))

module.exports = router;
