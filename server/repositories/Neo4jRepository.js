const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
    "neo4j://" +
    process.env.NEO4J_DATABASE_ADRESS +
    ":" +
    process.env.NEO4J_DATABASE_ADRESS,
    neo4j.auth.basic(
        process.env.NEO4J_DATABASE_ID,
        process.env.NEO4J_DATABASE_PWD
    )
);

const session = driver.session();