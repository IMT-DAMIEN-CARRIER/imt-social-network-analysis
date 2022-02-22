const express = require('express')
const {generatePerson} = require('../../services/PersonService');
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
    req.props = Object.assign(req.query, req.params, req.body);

    generatePerson(req.props.nbPerson).then((response) => {
        res.json({response});
    });
});


module.exports = router;