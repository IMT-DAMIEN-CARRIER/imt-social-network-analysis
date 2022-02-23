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

const insertPersons = async function (arrayPerson) {
    const session = driver.session();

    let arrayDatas = arrayPerson.map((person, i) => ({
        id: i, firstname: person.firstName, lastname: person.lastName
    }));

    let startTimeCreationPersons;

    try {
        session.run('CREATE CONSTRAINT constraint_id_person IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE');

        await session.writeTransaction((tx) => {
            tx.run(
                'UNWIND $props AS map CREATE (p:Person) SET p = map',
                {
                    props: arrayDatas,
                }
            );

            startTimeCreationPersons = Date.now();
        });

        const endTimeCreationPersons = Date.now();

        session.run('DROP CONSTRAINT constraint_id_person IF EXISTS');
        await session.close();

        const timeCreationPersons = endTimeCreationPersons - startTimeCreationPersons;

        return {
            status: 200,
            data: "Les " + arrayPerson.length + " personnes ont été correctements ajoutées",
            time_person: timeCreationPersons / 1000
        };
    } catch (error) {
        console.log(error);

        return {
            status: 409,
            data: error,
            time: null,
        };
    }
};

const insertRelations = async (tabRelations) => {
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
                            "MATCH (a:Person), (b:Person)" +
                            " WHERE a.id = " + j + " AND b.id IN [" + tabRelations.get(j) +
                            "] CREATE (a)-[:Relation]->(b)"
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
        console.log(error);

        return {
            status: 409,
            data: error,
            time: null,
        };
    }
};

module.exports = {
    getAllDatas,
    insertPersons,
    clearTable,
    insertRelations
}