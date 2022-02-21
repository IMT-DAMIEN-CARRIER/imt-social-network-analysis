import Person from '../entity/Person';
import faker from '@faker-js/faker';

const generatePerson = (nbPerson) => {
    let tabPersons = [];

    for (let i = 0; i < nbPerson; i++) {
        const firstname = faker.name.firstName();
        const lastname = faker.name.lastName();
        const currentPerson = new Person(firstname, lastname);

        tabPersons.push(currentPerson);
    }

    return tabPersons;
}

const generateRelations = (allPersons) => {
    const nbRelationMax = 20;
    let relations = [];

    allPersons.forEach(person => {
        let idAlreadyUsed = []
        const nbCurrentRelations = Math.floor(Math.random() * (nbRelationMax + 1));

        for (let i = 0; i < nbCurrentRelations; i++) {
            let randomPerson = allPersons[Math.floor(Math.random() * allPersons.length)];

            while (idAlreadyUsed.includes(randomPerson.id)) {
                randomPerson = allPersons[Math.floor(Math.random() * allPersons.length)];
            }

            idAlreadyUsed.push(randomPerson.id)

            relations.push({
                "id_person_following" : person.id,
                "id_person_followed" : randomPerson.id
            })
        }
    });

    return relations;
}

export default {
    generatePerson,
    generateRelations
}