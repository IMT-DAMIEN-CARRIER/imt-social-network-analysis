const DataGenerationService = require('./DataGenerationService');
const MysqlRepository = require('../repositories/MysqlRepository');
const Neo4jRepository = require('../repositories/Neo4jRepository');
const ProductService = require('./ProductService');

const generateDataMysql = async (nbPerson, nbProduct) => {
    const durationGenerateStructure = await MysqlRepository.createMysqlStructure();
    const durationInsertPerson = await generatePersonMysql(nbPerson);
    const durationInsertProduct = await generateProductMysql(nbProduct)

    return {
        durationGenerateStructure,
        durationInsertPerson,
        durationInsertProduct,
    };
}

const generatePersonMysql = async (nbPerson) => {
    const tabPersons = DataGenerationService.generatePersonData(nbPerson);
    const durationInsertPersons = await MysqlRepository.insertPersons(tabPersons);
    const request = await MysqlRepository.getPersonMaxId();
    const tabRelations = DataGenerationService.generateRelationsData(parseInt(request.query[0]['id']));
    const durationInsertRelations = await MysqlRepository.insertRelations(tabRelations);

    return {
        durationInsertPersons,
        durationInsertRelations
    };
}

const generateProductMysql = async (nbProduct) => {
    const tabProducts = DataGenerationService.generateProductsData(nbProduct);
    const durationInsertProducts = await MysqlRepository.insertProducts(tabProducts);
    const tabPersons = await MysqlRepository.findAllPersons();
    const request = await MysqlRepository.getProductMaxId();

    const tabPurchases = DataGenerationService.generateProductsRelationsData(tabPersons.result.query, request.query[0]['id']);
    const durationInsertPurchase = await MysqlRepository.insertPurchase(tabPurchases);

    return {
        durationInsertProducts,
        durationInsertPurchase
    };
}

const generatePersonNeo4j = async (nbPerson, nbProduct) => {
    const tabPersons = DataGenerationService.generatePersonData(nbPerson);
    const tabRelations = DataGenerationService.generateRelationsData(nbPerson);

    const map = new Map();

    tabRelations.forEach((item) => {
        if (map.has(item.follower)) {
            let element = map.get(item.follower);
            element.push(item.followed);
        } else {
            map.set(item.follower, [item.followed]);
        }
    });

    const resultInsertPersons = await Neo4jRepository.insertObject(tabPersons, 'Person');
    const resultInsertRelations = await Neo4jRepository.insertRelations(
        map,
        'Person',
        'Person',
        'Relation'
    );

    if (nbProduct > 0) {
        const resultGenerationProduct = await ProductService.generateProductNeo4j(tabPersons, nbProduct);

        return {
            resultInsertPersons,
            resultInsertRelations,
            resultGenerationProduct
        };
    }

    return {
        resultInsertPersons,
        resultInsertRelations,
    };
}

const findAllPerson = async () => {
    const resultFindAllPersons = await MysqlRepository.findAllPersons();

    return {"resultFindAllPersons": resultFindAllPersons.result.query}
}

const getProductsOrderedByFollowers = async (profondeur, limit) => {
    const request = await MysqlRepository.getPersonMaxId();
    let idInfluenceur = 0;

    if (request.query[0]['id']) {
        idInfluenceur = Math.floor(Math.random() * request.query[0]['id'] + 1);
    }

    return {
        'idInfluenceur': idInfluenceur,
        'result': await MysqlRepository.getProductsOrderedByFollowers(idInfluenceur, profondeur, limit)
    };
}

const getProductsOrderedByFollowersAndByProduct = async (profondeur, idProduct) => {
    const requestInfluenceur = await MysqlRepository.getPersonMaxId();
    const maxId = requestInfluenceur.query[0]['id'];

    let idInfluenceur = 0;

    if (maxId) {
        while (!idProduct) {
            idInfluenceur = Math.floor(Math.random() * maxId + 1);

            // On récupère la liste des produits pour l'influenceur aléatoire
            const tabProduct = await MysqlRepository.getProductByInfluencer(idInfluenceur);

            // On tire au sort l'un des produits de l'influenceur
            const randomIdProduct = Math.floor(Math.random() * tabProduct.query.length);
            idProduct = tabProduct.query[randomIdProduct]?.id;
        }
    }

    return {
        'idInfluenceur': idInfluenceur,
        'idProduct': idProduct,
        'result': await MysqlRepository.getProductsOrderedByFollowersAndByProduct(idInfluenceur, idProduct, profondeur)
    };
}

const getProductVirality = async (profondeur, idProduct) => {
    if (!idProduct) {
        // On récupère la liste des produits pour l'influenceur aléatoire
        const maxProduct = await MysqlRepository.getProductMaxId();
        const maxId = maxProduct.query[0]['id'];

        // On tire au sort l'un des produits de l'influenceur
        idProduct = Math.floor(Math.random() * maxId + 1);
    }

    return {
        'idProduct': idProduct,
        'result': await MysqlRepository.getProductVirality(idProduct, profondeur)
    }
}

module.exports = {
    generateDataMysql,
    generatePersonMysql,
    generateProductMysql,
    generatePersonNeo4j,
    findAllPerson,
    getProductsOrderedByFollowers,
    getProductsOrderedByFollowersAndByProduct,
    getProductVirality
}