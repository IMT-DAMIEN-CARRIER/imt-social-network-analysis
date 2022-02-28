const Person = require('../entity/Person');
const Product = require("../entity/Product");

const {faker} = require('@faker-js/faker');
const neo4j = require("neo4j-driver");
const _ = require('lodash');

const driver = neo4j.driver(
    "neo4j://0.0.0.0:7687",
    neo4j.auth.basic(
        "neo4j",
        "admin"
    )
);

const generatePersonData = (nbPerson) => {
    let tabPersons = [];

    for (let i = 0; i < nbPerson; i++) {
        const firstname = faker.name.firstName();
        const lastname = faker.name.lastName();
        const currentPerson = new Person(firstname, lastname);

        tabPersons.push(currentPerson);
    }

    return tabPersons;
}

const generateRelationsDataMysql = (maxId) => {
    const nbRelationMax = 20;
    let relations = [];

    for (let idPerson = 1; idPerson <= maxId; idPerson++) {
        let idAlreadyUsed = [];
        const nbCurrentRelations = Math.floor(Math.random() * (nbRelationMax + 1));

        for (let i = 0; i < nbCurrentRelations; i++) {
            let randomId;
            do {
                randomId = Math.floor(Math.random() * maxId + 1);
            } while (idAlreadyUsed.includes(randomId) || randomId === idPerson);

            idAlreadyUsed.push(randomId);

            relations.push({
                "influencer": idPerson,
                "follower": randomId
            });
        }
    }

    return relations;
}

const generateRelationsDataNeo4j = async () => {
    let tabRelations = [];
    const nbRelationMax = 20;

    try {
        const session = driver.session();
        let query = `MATCH (n:Person) RETURN count(n)`;
        let response = await session.run(query, {});
        const nbPersons = _.get(response, 'records[0]._fields[0].low');

        let idMinPerson;
        query = `MATCH (n:Person) RETURN min(id(n))`;
        response = await session.run(query, {});
        idMinPerson = _.get(response, 'records[0]._fields[0].low');

        let tabFollowers = [];
        let randomFollow;

        for (let i = 0; i < nbPersons; i++) {
            let randNbRelation = Math.floor(Math.random() * nbRelationMax);

            for (let j = 0; j < randNbRelation; j++) {
                do {
                    randomFollow = Math.floor(Math.random() * nbPersons) + idMinPerson;
                } while (tabFollowers.includes(randomFollow) || randomFollow === i + idMinPerson);

                tabFollowers.push(randomFollow);
            }

            tabRelations.push({
                influencer: i + idMinPerson,
                follower: tabFollowers
            })

            tabFollowers = []
        }

        await session.close();

        return tabRelations;
    } catch (e) {
        console.error(e);
    }
}

const generateProductsData = (nbProducts) => {
    let tabProduct = []

    for (let i = 0; i < nbProducts; i++) {
        const productName = faker.commerce.productName();
        const price = faker.commerce.price()
        const currentProduct = new Product(productName, price);

        tabProduct.push(currentProduct);
    }

    return tabProduct;
}

const generateProductsRelationsDataMysql = (tabPersons, maxIdProduct) => {
    let relationTab = [];
    const nbRelationsMax = 5;

    tabPersons.forEach(person => {
        let idAlreadyUsed = []
        const nbCurrentRelations = Math.floor(Math.random() * (nbRelationsMax + 1));

        for (let i = 0; i < nbCurrentRelations; i++) {
            let randomProduct;

            do {
                randomProduct = Math.floor(Math.random() * maxIdProduct + 1);
            } while (idAlreadyUsed.includes(randomProduct));

            idAlreadyUsed.push(randomProduct)

            relationTab.push({
                "person": person.id,
                "product": randomProduct
            })
        }
    });

    return relationTab;
}

const generateOrders = async () => {
    let tabOrders = [];

    try {
        const session = driver.session();
        let query = 'MATCH (n:Person) RETURN count(n)';
        let response = await session.run(query, {});
        const nbPersons = _.get(response, 'records[0]._fields[0].low');

        query = 'MATCH (n:Product) RETURN count(n)';
        response = await session.run(query, {});
        const nbProducts = _.get(response, 'records[0]._fields[0].low');

        query = 'MATCH (n:Person) RETURN min(id(n))';
        response = await session.run(query, {});
        const minIdPerson = _.get(response, 'records[0]._fields[0].low');

        query = 'MATCH (n:Product) RETURN min(id(n))';
        response = await session.run(query, {});
        const minIdProduct = _.get(response, 'records[0]._fields[0].low');

        let ordersList = [];
        let randomOrder;

        for (let i = 0; i < nbPersons; i++) {
            let numberOfOrder = Math.floor(Math.random() * 5);

            for (let j = 0; j < numberOfOrder; j++) {
                do {
                    randomOrder = Math.floor(Math.random() * nbProducts) + minIdProduct;
                } while (ordersList.includes(randomOrder) || randomOrder === i + nbProducts);

                ordersList.push(randomOrder);
            }

            tabOrders.push({
                idPerson: i + minIdPerson,
                ordersList: ordersList
            });

            ordersList = [];
        }

        return tabOrders;
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    generatePersonData,
    generateRelationsDataMysql,
    generateProductsData,
    generateProductsRelationsDataMysql,
    generateRelationsDataNeo4j,
    generateOrders
}