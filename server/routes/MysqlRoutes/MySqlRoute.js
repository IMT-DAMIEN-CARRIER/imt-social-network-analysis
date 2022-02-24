const express = require('express')
const {
    generatePersonMysql,
    generateProductMysql,
    findAllPerson, generateDataMysql
} = require('../../services/PersonService');
const {createMysqlStructure} = require('../../repositories/MysqlRepository');
const router = express.Router();

/**
 * /mysql/person/generate
 *
 * Génère la structure de BDD.
 */
router.get('/person/generate', async (req, res) => {
    createMysqlStructure().then((response) => {
        res.json({res: response});
    });
});

/**
 * /mysql/person/add
 *
 * {
 *  'nbPerson': X
 * }
 *
 * Ajoute en base la personne renseignée
 */
router.post('/person/add/', async (req, res) => {
    const {nbPerson} = req.body;

    generatePersonMysql(nbPerson).then((response) => {
        res.json({response});
    });
});

router.post('/person/generate/datas', async (req, res) => {
    const {nbPerson, nbProduct} = req.body;

    generateDataMysql(nbPerson, nbProduct).then((response) => {
        res.json({response});
    });
});

router.post('/product/add/', async (req, res) => {
    const {nbProduct} = req.body;

    generateProductMysql(nbProduct).then((response) => {
        res.json({response});
    })
});

router.get('/person/all', async (req, res) => {
    findAllPerson().then((response) => {
        res.json({response});
    });
});

module.exports = router;