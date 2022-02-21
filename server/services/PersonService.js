import DataGenerationService from "./DataGenerationService";
import MysqlRepository from "../repositories/MysqlRepository";

const generateData = (nbPerson) => {
    let tabPersons = DataGenerationService.generatePersonData(nbPerson);
    MysqlRepository.insertPersons();
    return tabPersons;
}


export default {
    generateData
}