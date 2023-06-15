const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

router.use("/users", require("./users"))

module.exports = router;
