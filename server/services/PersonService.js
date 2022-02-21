const DataGenerationService =  require("./DataGenerationService");
const MysqlRepository = require("../repositories/MysqlRepository");

const generateData = () => {
    const tabPersons = DataGenerationService.generatePersonData(10000);
    const durationInsertPerson = MysqlRepository.insertPersons(tabPersons);

    return {
        'durationInsertPerson': durationInsertPerson
    };
}

const generatePerson = (nbPerson, nbProduct) => {
    const tabPersons = DataGenerationService.generatePersonData(nbPerson);

    return MysqlRepository.insertPersons(tabPersons);
}


module.exports = {
    generateData,
    generatePerson
}