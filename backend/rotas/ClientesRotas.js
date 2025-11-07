const express = require("express");
const router = express.Router();

const client = require("../models/Cliente");

router.get('/', async(req, res) => {
    res.status(200).send("chegou em clientes");
});

module.exports = router;