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

    session
        .run('Match(n) RETURN n')
        .then(function (result) {
            console.log(result.records);
            session.close();
        })
        .catch((error) => {
            console.error(error);
        });
};

const clearTable = async () => {
    const session = driver.session();

    session
        .run('MATCH (n) DETACH DELETE n')
        .then(function (result) {
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
        arrayDatas = arrayObject.map((person, i) => ({
            id: i, firstname: person.firstName, lastname: person.lastName
        }));
    } else if (tableName === 'Product') {
        arrayDatas = arrayObject.map((product, i) => ({
            id: i, productName: product.productName, price: product.price
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
            time_person: timeCreation / 1000
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

const insertRelations = async (tabRelations, tableRightName, tableLeftName, relationName) => {
    const batchSize = 100000;
    const startVal = 0;
    let indexAlreadyDone = 1;
    let index = indexAlreadyDone;
    let maxVal = tabRelations.size < batchSize ? tabRelations.size : batchSize;
    let total = 0;

    try {
        let startTimeCreationRelations;
        let test = 0;

        while (indexAlreadyDone < tabRelations.size) {
            const session = driver.session();

            await session.writeTransaction((tx) => {
                for (let j = startVal + index; j < maxVal; j++) {
                    if (tabRelations.has(j)) {
                        tx.run(
                            "MATCH (a:" + tableRightName + "), (b:" + tableLeftName + ")" +
                            " WHERE a.id = " + j + " AND b.id IN [" + tabRelations.get(j) +
                            "] CREATE (a)-[:" + relationName + "]->(b)"
                        );
                    }

                    indexAlreadyDone++;
                }

                startTimeCreationRelations = Date.now();
            });

            const endTimeCreationRelations = Date.now();
            const duration = (endTimeCreationRelations - startTimeCreationRelations) / 1000;
            total += duration;

            maxVal = tabRelations.size - maxVal < batchSize ? tabRelations.size : maxVal + batchSize;

            test++;
            await session.close();

            // A dé-commenter pour vérifier que les batchs se lancent
            //console.log('Nb relations : ' + tabRelations.size + ', BATCH ' + test);

            index = indexAlreadyDone;
        }

        return {time_creation_relation: total};

    } catch (error) {
        console.error(error);

        return {
            status: 409,
            data: error,
            time: null,
        };
    }
};

module.exports = {
    getAllDatas,
    insertObject,
    clearTable,
    insertRelations
}