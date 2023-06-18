const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.send("ok");
});

router.use("/users", require("./users"))
router.use("/containers", require("./containers"))

module.exports = router;
