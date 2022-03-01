const express = require('express');
const {
    getAllDatas,
    clearTable,
    getProductsOrderedByFollowersNeo4j,
    getProductsOrderedByFollowersAndByProductNeo4j, getProductViralityNeo4j
} = require("../../repositories/Neo4jRepository");
const {generatePersonNeo4j, generateProductNeo4j} = require("../../services/PersonService");
const router = express.Router();
const {getRandomProductName, getRandomPerson} = require("../../services/DataGenerationService");

router.get('/all', async (req, res) => {
    await getAllDatas().then((response) => {
        res.json(response);
    });
});

// router.get('/test', async (req, res) => {
//     await getRandomProductName().then((response) => {
//         res.json({res: response});
//     });
// });

router.post('/person/add', async (req, res) => {
    const {nbPerson, nbProduct} = req.query;

    generatePersonNeo4j(nbPerson, nbProduct).then((response) => {
        res.json(response);
    });
})

router.post('/product/add', async (req, res) => {
    const {nbProduct} = req.query;

    generateProductNeo4j(nbProduct).then((response) => {
        res.json(response);
    });
});

router.get('/product/get/product-ordered-from-followers-by-influencer', async (req, res) => {
    const {profondeur, limit} = req.query;
    const limitReq = !limit ? 5 : limit;
    const influencer = await getRandomPerson();

    getProductsOrderedByFollowersNeo4j(influencer, profondeur, limitReq).then((response) => {
        res.json(response);
    });
});

router.get('/product/get/product-ordered-from-followers-by-influencer-by-product', async (req, res) => {
    const {profondeur} = req.query;

    const productName = await getRandomProductName();
    const influencer = await getRandomPerson();

    getProductsOrderedByFollowersAndByProductNeo4j(influencer, productName, profondeur).then((response) => {
        res.json(response);
    });
});

router.get('/product/get/product-virality', async (req, res) => {
    const {profondeur} = req.query;
    const productName = await getRandomProductName();

    getProductViralityNeo4j(productName, profondeur).then((response) => {
        res.json(response);
    });
})

router.delete("/clearTable", async (req, res) => {
    await clearTable().then((response) => {
        res.json(response);
    });
});

module.exports = router;