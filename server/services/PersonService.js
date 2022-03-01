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
    const tabRelations = DataGenerationService.generateRelationsDataMysql(parseInt(request.data[0]['id']));
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

    const tabPurchases = DataGenerationService.generateProductsRelationsDataMysql(tabPersons.result.query, request.data[0]['id']);
    const durationInsertPurchase = await MysqlRepository.insertPurchase(tabPurchases);

    return {
        durationInsertProducts,
        durationInsertPurchase
    };
}

const generatePersonNeo4j = async (nbPerson, nbProduct) => {
    const tabPersons = DataGenerationService.generatePersonData(nbPerson);
    const resultInsertPersons = await Neo4jRepository.insertObject(tabPersons, 'Person');

    const tabRelations = await DataGenerationService.generateRelationsDataNeo4j();
    const resultInsertRelations = await Neo4jRepository.insertRelations(tabRelations);

    if (nbProduct > 0) {
        const resultGenerationProduct = await ProductService.generateProductNeo4j(nbProduct);

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

const generateProductNeo4j = async (nbProduct) => {
    const resultGenerationProduct = await ProductService.generateProductNeo4j(nbProduct);

    return {
        resultGenerationProduct
    }
}

const findAllPerson = async () => {
    const resultFindAllPersons = await MysqlRepository.findAllPersons();

    return {"resultFindAllPersons": resultFindAllPersons.result.query}
}

const getProductsOrderedByFollowersMysql = async (profondeur, limit) => {
    const request = await MysqlRepository.getPersonMaxId();
    let idInfluenceur = 0;

    if (request.data[0]['id']) {
        idInfluenceur = Math.floor(Math.random() * request.data[0]['id'] + 1);
    }

    return {
        'idInfluenceur': idInfluenceur,
        'result': await MysqlRepository.getProductsOrderedByFollowersMysql(idInfluenceur, profondeur, limit)
    };
}

const getProductsOrderedByFollowersAndByProductMysql = async (profondeur) => {
    const requestInfluenceur = await MysqlRepository.getPersonMaxId();
    const maxId = requestInfluenceur.data[0]['id'];

    let idInfluenceur, idProduct = 0;

    if (maxId) {
        while (!idProduct) {
            idInfluenceur = Math.floor(Math.random() * maxId + 1);

            // On récupère la liste des produits pour l'influenceur aléatoire
            const tabProduct = await MysqlRepository.getProductByInfluencer(idInfluenceur);

            // On tire au sort l'un des produits de l'influenceur
            const randomIdProduct = Math.floor(Math.random() * tabProduct.data.length);
            idProduct = tabProduct.data[randomIdProduct]?.id;
        }
    }

    return {
        'idInfluenceur': idInfluenceur,
        'idProduct': idProduct,
        'result': await MysqlRepository.getProductsOrderedByFollowersAndByProductMysql(idInfluenceur, idProduct, profondeur)
    };
}

const getProductViralityMysql = async (profondeur) => {
    // On récupère la liste des produits pour l'influenceur aléatoire
    const maxProduct = await MysqlRepository.getProductMaxId();
    const maxId = maxProduct.data[0]['id'];

    // On tire au sort l'un des produits de l'influenceur
    const idProduct = Math.floor(Math.random() * maxId + 1);

    return {
        'idProduct': idProduct,
        'result': await MysqlRepository.getProductViralityMysql(idProduct, profondeur)
    }
}

module.exports = {
    generateDataMysql,
    generatePersonMysql,
    generateProductMysql,
    generatePersonNeo4j,
    generateProductNeo4j,
    findAllPerson,
    getProductsOrderedByFollowersMysql,
    getProductsOrderedByFollowersAndByProductMysql,
    getProductViralityMysql
}