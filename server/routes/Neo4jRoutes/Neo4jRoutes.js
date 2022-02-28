const express = require('express');
const {
    getAllDatas,
    clearTable,
    getProductsOrderedByFollowers,
    getProductsOrderedByFollowersAndByProduct, getProductVirality
} = require("../../repositories/Neo4jRepository");
const {generatePersonNeo4j, generateProductNeo4j} = require("../../services/PersonService");
const router = express.Router();
const Person = require('../entity/Person');

router.get('/all', async (req, res) => {
    await getAllDatas().then((response) => {
        res.json({res: response});
    });
});

router.post('/person/add', async (req, res) => {
    const {nbPerson, nbProduct} = req.query;

    generatePersonNeo4j(nbPerson, nbProduct).then((response) => {
        res.json({response});
    });
})

router.post('/product/add', async (req, res) => {
    const {nbProduct} = req.query;

    generateProductNeo4j(nbProduct).then((response) => {
        res.json({response});
    });
});

router.get('/product/get/product-ordered-from-followers-by-influencer', async (req, res) => {
    const {profondeur, firstname, lastname} = req.query;

    const influencer = new Person(firstname, lastname);

    getProductsOrderedByFollowers(influencer, profondeur).then((response) => {
        res.json({response});
    });
});

router.get('/product/get/product-ordered-from-followers-by-influencer-by-product', async (req, res) => {
    const {profondeur, firstname, lastname, productName} = req.query;

    const influencer = new Person(firstname, lastname);
    getProductsOrderedByFollowersAndByProduct(influencer, productName, profondeur).then((response) => {
        res.json({response});
    });
});

router.get('/product/get/product-virality', async (req, res) => {
    const {profondeur, productName} = req.query;

    getProductVirality(productName, profondeur).then((response) => {
        res.json({response});
    });
})

router.delete("/clearTable", async (req, res) => {
    await clearTable().then((response) => {
        res.json({res: response});
    });
});

module.exports = router;