const Person = require('../entity/Person');
const Product = require("../entity/Product");

const faker = require('@faker-js/faker');

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

const generateRelationsData = (allPersons) => {
  const nbRelationMax = 20;
  let relations = [];

  allPersons.forEach(person => {
    let idAlreadyUsed = []
    const nbCurrentRelations = Math.floor(Math.random() * (nbRelationMax + 1));

    for (let i = 0; i < nbCurrentRelations; i++) {
      let randomPerson = allPersons[Math.floor(Math.random() * allPersons.length)];

      while (idAlreadyUsed.includes(randomPerson.id)) {
        randomPerson = allPersons[Math.floor(Math.random() * allPersons.length)];
      }

      idAlreadyUsed.push(randomPerson.id)

      relations.push({
        "id_person_following" : person.id,
        "id_person_followed" : randomPerson.id
      })
    }
  });

  return relations;
}


const generateProductsData = (nbProducts) => {
  let tabProduct = []

  for (let i = 0; i < nbProducts; i++) {
    const productName = faker.commerce.productName();
    const price = faker.commerce.price()
    const currentPerson = new Product(i, productName, price);

    tabProduct.push(currentPerson);
  }

  return tabProduct;
}

const generateProductsRelationsData = (tabPersons, tabProducts) => {
  let relationTab = [];
  const nbRelationsMax = 5

  tabPersons.forEach(person => {
    let idAlreadyUsed = []
    const nbCurrentRelations = Math.floor(Math.random() * (nbRelationsMax + 1));

    for (let i = 0; i < nbCurrentRelations; i++) {
      let randomProduct = tabProducts[Math.floor(Math.random() * tabProducts.length)];

      while (idAlreadyUsed.includes(randomProduct.id)) {
        randomProduct = tabProducts[Math.floor(Math.random() * tabProducts.length)];
      }

      idAlreadyUsed.push(randomProduct.id)

      relationTab.push({
        "id_person" : person.id,
        "id_product" : randomProduct.id
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