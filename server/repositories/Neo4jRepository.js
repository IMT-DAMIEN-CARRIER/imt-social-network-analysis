const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    "neo4j://0.0.0.0:7687",
    neo4j.auth.basic(
        "neo4j",
        "admin"
    )
);

const getAllDatas = async () => {
    const session = driver.session();

    await session
        .run('Match(n) RETURN n')
        .then(function () {
            session.close();
        })
        .catch((error) => {
            console.error(error);
        });
};

const clearTable = async () => {
    const session = driver.session();

    await session
        .run('MATCH (n) DETACH DELETE n')
        .then(function () {
            session.close();
        })
        .catch((error) => {
            console.error(error);
        });
};

const insertObject = async function (arrayObject, tableName) {
    const session = driver.session();
    let arrayDatas;

    if (tableName === 'Person') {
        arrayDatas = arrayObject.map((person) => ({
            firstname: person.firstName, lastname: person.lastName
        }));
    } else if (tableName === 'Product') {
        arrayDatas = arrayObject.map((product) => ({
            productName: product.productName, price: product.price
        }));
    }

    let startTimeCreation;

    try {
        await session.writeTransaction((tx) => {
            tx.run(
                'UNWIND $props AS map CREATE (p:' + tableName + ') SET p = map',
                {
                    props: arrayDatas,
                }
            );

            startTimeCreation = Date.now();
        });

        const endTimeCreation = Date.now();
        await session.close();
        const timeCreation = endTimeCreation - startTimeCreation;

        let dataString = 'Les ' + arrayObject.length;

        if (tableName === 'Person') {
            dataString += ' personnes ont été correctements ajoutées';
        } else if (tableName === 'Product') {
            dataString += ' produits ont été correctements ajoutés';
        }

        return {
            status: 200,
            data: dataString,
            time: timeCreation / 1000
        };
    } catch (error) {
        console.error(error);

        return {
            status: 409,
            data: error,
            time: null,
        };
    }
};

const insertRelations = async (tabRelations) => {
    try {
        const session = driver.session();

        let start;
        await session.writeTransaction((tx) => {
            tx.run(
                `UNWIND $listFollow as followTab
         MATCH (p1:Person) WHERE ID(p1) = followTab.influencer
         UNWIND followTab.follower as followerTab
         MATCH (p2:Person) WHERE ID(p2) = followerTab
         CREATE (p1)-[:Relation]->(p2)
         RETURN p1, p2`,
                {
                    listFollow: tabRelations
                });

            start = Date.now();
        });
        const end = Date.now();
        const duration = (end - start) / 1000;
        await session.close();

        return {time_creation_relations: duration};
    } catch (error) {
        console.error(error);

        return {
            status: 409,
            data: error,
            time: null,
        };
    }
}

const insertOrders = async (tabOrders) => {
    try {
        const session = driver.session();

        let start;
        await session.writeTransaction((tx) => {
            tx.run(
                `UNWIND $ordersList as orderTab
           MATCH (p1:Person) WHERE ID(p1) = orderTab.idPerson
           UNWIND orderTab.ordersList as productTab
           MATCH (p2:Product) WHERE ID(p2) = productTab
           CREATE (p1)-[:Order]->(p2)
           RETURN p1,p2`,
                {
                    ordersList: tabOrders
                });
            start = Date.now();
        });

        const end = Date.now();
        const duration = (end - start) / 1000;
        await session.close();

        return {
            status: 200,
            time: duration,
            data: {}
        };
    } catch (error) {
        console.error(error);

        return {
            status: 409,
            data: error,
            time: null,
        };
    }
}

const getProductsOrderedByFollowersNeo4j = async (influencer, depth, limit) => {
    let products = [];

    try {
        const session = driver.session();
        depth++
        const query = ` MATCH (:Person {firstname: "${influencer.firstName}", lastname: "${influencer.lastName}"})<-[:Relation *1..${depth}]-(p:Person)
              WITH DISTINCT p
              MATCH (p)-[:Order]->(n:Product)
              RETURN n.productName, COUNT(*)
              LIMIT ${limit}`;

        const start = Date.now();
        const data = await session.run(query, {});

        for (let i = 0; i < data.records.length; i++) {
            products.push(
                {
                    name: data.records[i].get(0),
                    nbrOrders: data.records[i].get(1).low
                }
            )
        }

        await session.close();
        const duration = Date.now() - start;

        return {
            status: 200,
            time: duration / 1000,
            influencer: influencer.firstName + ' ' + influencer.lastName,
            result: products
        }
    } catch (e) {
        console.error(e);

        return {
            status: 409,
            data: e,
            time: null,
        };
    }
}

const getProductsOrderedByFollowersAndByProductNeo4j = async (influencer, productName, depth) => {
    try {
        const session = driver.session();
        depth++;
        const query = ` MATCH (:Person{firstname: "${influencer.firstName}", lastname: "${influencer.lastName}"})<-[:Relation *1..${depth}]-(p:Person)
                  WITH DISTINCT p
                  MATCH (p)-[:Order]->(n:Product {productName: "${productName}"})
                  RETURN n.productName, COUNT(*)`;

        const start = Date.now();
        const data = await session.run(query, {});
        let count = 0;

        if (data.records[0]) {
            count = data.records[0].get(1);
            count = count.low
        }

        await session.close();
        const duration = Date.now() - start;

        return {
            status: 200,
            time: duration / 1000,
            productName: productName,
            influencer: influencer.firstName + ' ' + influencer.lastName,
            nbOrders: count
        }
    } catch (e) {
        console.error(e);

        return {
            status: 409,
            data: e,
            time: null,
        };
    }
}

const getProductViralityNeo4j = async (productName, depth) => {
    try {
        const session = driver.session();
        depth++;

        const query = ` MATCH(:Product {productName:"${productName}"})<-[:Order]-(:Person)<-[:Relation *1..${depth}]-(p:Person)
              WITH DISTINCT p
              MATCH (p)-[n:Order]->(:Product {productName:'${productName}'})
              RETURN COUNT (n)`;

        const start = Date.now();
        const data = await session.run(query, {});
        const nbOrders = data.records[0].get(0).low;
        const duration = Date.now() - start;
        await session.close();

        return {
            status: 200,
            time: duration / 1000,
            productName: productName,
            nbOrders: nbOrders
        }
    } catch (e) {
        console.error(e);

        return {
            status: 409,
            data: e,
            time: null,
        };
    }
}

module.exports = {
    getAllDatas,
    insertObject,
    clearTable,
    insertRelations,
    insertOrders,
    getProductsOrderedByFollowersNeo4j,
    getProductsOrderedByFollowersAndByProductNeo4j,
    getProductViralityNeo4j
}