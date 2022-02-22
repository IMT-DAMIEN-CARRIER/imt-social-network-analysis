const express = require('express');
const { getAllDatas } = require("../../repositories/Neo4jRepository");
const router = express.Router();

router.get('/all', async (req, res) => {
    getAllDatas().then((response) => {
        res.json({res: response});
    });
});

module.exports = router;