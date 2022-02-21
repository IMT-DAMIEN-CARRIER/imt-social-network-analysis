const express = require('express')
const generatePerson = require('../../services/PersonService');
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
 * /mysql/person/add/{nbPerso}
 *
 * {
 *   nbPerson: <nbPerson>
 * }
 *
 * Ajoute en base la personne renseignée
 */
router.post('/person/add/:nbPerso', async (req, res) => {

});


module.exports = router;