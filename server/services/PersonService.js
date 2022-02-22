const DataGenerationService = require('./DataGenerationService');
const MysqlRepository = require('../repositories/MysqlRepository');
const Neo4jRepository = require('../repositories/Neo4jRepository');

const generateData = () => {
    const tabPersons = DataGenerationService.generatePersonData(1000000);
    const resultsMysql = MysqlRepository.insertPersons(tabPersons);
    const resultsNosql = Neo4jRepository.insertPersons(tabPersons);

    return {
        'insertion_mysql_results': resultsMysql,
        'insertion_nosql_results': resultsNosql
    };
}

const generatePersonMysql = (nbPerson) => {
    const tabPersons = DataGenerationService.generatePersonData(nbPerson);

    return MysqlRepository.insertPersons(tabPersons);
}

const generatePersonNeo4j = (nbPerson) => {
    const tabPersons = DataGenerationService.generatePersonData(nbPerson);

    return Neo4jRepository.insertPersons(tabPersons);
}


module.exports = {
    generateData,
    generatePersonMysql,
    generatePersonNeo4j
}