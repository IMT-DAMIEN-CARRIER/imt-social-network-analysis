const DataGenerationService = require('./DataGenerationService');
const Neo4jRepository = require('../repositories/Neo4jRepository');

const generateProductNeo4j = async (tabPersons, nbProduct) => {
    const tabProducts = DataGenerationService.generateProductsData(nbProduct);
    // const tabProductsRelations = DataGenerationService.generateProductsRelationsData(tabPersons, tabProducts)

    // const map = new Map();
    //
    // tabProductsRelations.forEach((item) => {
    //     if (map.has(item.person)) {
    //         let element = map.get(item.person);
    //         element.push(item.product);
    //     } else {
    //         map.set(item.person, [item.product]);
    //     }
    // });

    const resultInsertProduct = await Neo4jRepository.insertObject(tabProducts, 'Product');
    // const resultInsertRelations = await Neo4jRepository.insertRelations(
    //     map,
    //     'Person',
    //     'Product',
    //     'Order'
    // );

    return {
        resultInsertProduct,
        // resultInsertRelations
    }
}

module.exports = {
    generateProductNeo4j
}