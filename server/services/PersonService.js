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

module.exports = {
    generateDataMysql,
    generatePersonMysql,
    generateProductMysql,
    generatePersonNeo4j,
    findAllPerson
}