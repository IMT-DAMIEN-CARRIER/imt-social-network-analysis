import Product from '../entity/Product';
import faker from '@faker-js/faker';

const generateProducts = (nbProducts) => {
    let tabProduct = []

    for (let i = 0; i < nbProducts; i++) {
        const productName = faker.commerce.productName();
        const price = faker.commerce.price()
        const currentPerson = new Product(i, productName, price);

        tabProduct.push(currentPerson);
    }

    return tabProduct;
}

const generateProductsRelations = (tabPersons, tabProducts) => {
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

export default {
    generateProducts,
    generateProductsRelations
}