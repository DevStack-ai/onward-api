const express = require('express');
const LogsController = require('../controllers/logs');
const router = express.Router();


router.get('/', (req, res) => {
  res.send("ok");
});
router.all('/webhook', async (req, res) => {

  const payload = req.body
  await LogsController.create(payload)
  res.send("ok");
});
router.use("/users", require("./users"))
router.use("/containers", require("./containers"))
router.use("/history", require("./history"))

module.exports = router;
