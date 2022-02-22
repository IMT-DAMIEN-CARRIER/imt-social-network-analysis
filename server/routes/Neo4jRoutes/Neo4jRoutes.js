const express = require('express');
const {getAllDatas, clearTable} = require("../../repositories/Neo4jRepository");
const {generatePersonNeo4j} = require("../../services/PersonService");
const router = express.Router();

router.get('/all', async (req, res) => {
    getAllDatas().then((response) => {
        res.json({res: response});
    });
});

router.post('/person/add', async (req, res) => {
    const {nbPerson} = req.body;

    generatePersonNeo4j(nbPerson).then((response) => {
        res.json({response});
    });
})

router.delete("/clearTable", async (req, res) => {
    clearTable().then((response) => {
        res.json({res: response});
    });
});

module.exports = router;