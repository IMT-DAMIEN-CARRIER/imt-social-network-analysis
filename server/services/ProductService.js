const DataGenerationService = require('./DataGenerationService');
const Neo4jRepository = require('../repositories/Neo4jRepository');

const generateProductNeo4j = async (tabPersons, nbProduct) => {
    const tabProducts = DataGenerationService.generateProductsData(nbProduct);
    const resultInsertProduct = await Neo4jRepository.insertObject(tabProducts, 'Product');

    const tabProductsRelations = await DataGenerationService.generateOrders();
    const resultInsertRelations = await Neo4jRepository.insertOrders(tabProductsRelations);

    return {
        resultInsertProduct,
        resultInsertRelations
    }
}

module.exports = {
    generateProductNeo4j
}