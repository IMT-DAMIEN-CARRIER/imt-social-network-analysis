const express = require('express')
const generatePerson = require("../../services/PersonService");
const router = express.Router();

/**
 * /mysql/generate
 *
 * Génère la structure de BDD.
 */
router.post('/generate', async (req, res) => {

});

/**
 * /mysql/perso/add/{nbPerso}
 *
 * {
 *   nbPerson: <nbPerson>
 * }
 *
 * Ajoute en base la personne renseignée
 */
router.post('/person/add/:nbPerso', async (req, res) => {
    const { nbPerson } = req.body;

    if (nbPerson) {
        const duration = generatePerson(nbPerson);

        res.json({ok: true, duration})
    } else {
        res.send("Il y a une erreur dans le paramètres envoyés.");
    }
});


module.exports = router;