import Person from '../entity/Person';

const generateString = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

const generatePerson = (nbPerson) => {
    let tabPersons = [];

    for (let i = 0; i < nbPerson; i++) {

        const randomFirstName = generateString();
        const randomLastName = generateString();

        const currentPerson = new Person(i, randomFirstName, randomLastName);

        tabPersons.push(currentPerson)
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