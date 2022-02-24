const Person = require('../entity/Person');
const Product = require("../entity/Product");

const {faker} = require('@faker-js/faker');

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

const generateRelationsData = (maxId) => {
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
                "follower": idPerson,
                "followed": randomId
            });
        }
    }

    return relations;
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

const generateProductsRelationsData = (tabPersons, maxIdProduct) => {
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

module.exports = {
    generatePersonData,
    generateRelationsData,
    generateProductsData,
    generateProductsRelationsData
}