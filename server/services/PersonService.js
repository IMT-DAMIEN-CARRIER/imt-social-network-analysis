const DataGenerationService = require('./DataGenerationService');
const MysqlRepository = require('../repositories/MysqlRepository');
const Neo4jRepository = require('../repositories/Neo4jRepository');

const generateData = async () => {
  const initNbPerson = 100000;

  const tabPersons = DataGenerationService.generatePersonData(initNbPerson);
  const durationInsertPerson = await MysqlRepository.insertPersons(tabPersons);
  const resultsNosql = Neo4jRepository.insertPersons(tabPersons);

  const request = await MysqlRepository.getPersonMaxId();

  const tabRelations = DataGenerationService.generateRelationsData(parseInt(request.query[0]['id']));

  const durationInsertRelations = await MysqlRepository.insertRelations(tabRelations);

  return {
    'durationInsertPersonMysql': durationInsertPerson,
    'durationInsertRelationsMysql': durationInsertRelations,
    'durationInsertPersoNeo4J': resultsNosql
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