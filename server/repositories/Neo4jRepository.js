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
    let startTimeCreationRelations;

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

        await session.writeTransaction((tx) => {
            tx.run(
                `
MATCH (f:Person) WITH DISTINCT collect(f) as followers, range(0,20) as followersRange
MATCH (i:Person) WITH i, apoc.coll.randomItems(followers, apoc.coll.randomItem(followersRange)) as followers
FOREACH (follower in followers | CREATE (follower)-[:Relation]->(i))
            `);

            startTimeCreationRelations = Date.now();
        });

        const endTimeCreationRelations = Date.now();

        session.run('DROP CONSTRAINT constraint_id_person IF EXISTS');
        await session.close();

        const timeCreationPersons = endTimeCreationPersons - startTimeCreationPersons;
        const timeCreationRelation = endTimeCreationRelations - startTimeCreationRelations;
        const totalTime = timeCreationPersons + timeCreationRelation;

        return {
            status: 200,
            data: "Les " + arrayPerson.length + " personnes ont été correctements ajoutées",
            time_person: timeCreationPersons / 1000,
            time_relation: timeCreationRelation / 1000,
            total_time: totalTime / 1000
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

module.exports = {
    getAllDatas,
    insertPersons,
    clearTable
}