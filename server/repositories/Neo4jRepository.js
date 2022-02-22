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

const insertRelations = async (idMax) => {
  const session = driver.session();
  const nbRelationMax = 20;

  try {
    let startTimeCreationRelations;
    await session.writeTransaction((tx) => {
      for (j = 1; j < idMax; j++) {

        let followedId = [];
        const nbCurrentRelations = Math.floor(Math.random() * (nbRelationMax + 1));

        for (let i = 0; i < nbCurrentRelations; i++) {
          let randomId;
          do {
            randomId = Math.floor(Math.random() * idMax + 1);
          } while (followedId.includes(randomId) || randomId === j);

          followedId.push(randomId);
        }
        tx.run(
            "MATCH (a:Person), (b:Person)" +
            " WHERE a.id = " + j + " AND b.id IN [" + followedId +
            "] CREATE (a)-[:Relation]->(b)"
        );
      }
      startTimeCreationRelations = Date.now();
    });
    const endTimeCreationRelations = Date.now();

    const total = (endTimeCreationRelations - startTimeCreationRelations) / 1000;

    await session.close();

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