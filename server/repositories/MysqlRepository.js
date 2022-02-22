const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'projet_nosql'
});

const createMysqlStructure = async () => {
    const person = `
        CREATE TABLE IF NOT EXISTS person (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL
        ) ENGINE InnoDB;
    `;

    const relation = `
        CREATE TABLE IF NOT EXISTS relation (
            id_person_following INT NOT NULL,
            id_person_followed INT NOT NULL,
            CONSTRAINT fk_id_person_following FOREIGN KEY (id_person_following) REFERENCES person(id),
            CONSTRAINT fk_id_person_followed FOREIGN KEY (id_person_followed) REFERENCES person(id),
            CONSTRAINT pk_relationship PRIMARY KEY (id_person_following, id_person_followed)
        ) ENGINE InnoDB;
    `

    const product = `
        CREATE TABLE IF NOT EXISTS product (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            productName VARCHAR(255) NOT NULL,
            price INT NOT NULL
        ) ENGINE InnoDB;
    `

    const order = `
        CREATE TABLE IF NOT EXISTS orders (
            id_person INT NOT NULL,
            id_product INT NOT NULL,
            CONSTRAINT fk_id_person FOREIGN KEY (id_person) REFERENCES person(id),
            CONSTRAINT fk_id_product FOREIGN KEY (id_product) REFERENCES product(id),
            CONSTRAINT pk_purchase PRIMARY KEY (id_person, id_product)
        ) ENGINE InnoDB;
    `

    let connexion;

    try {
        connexion = await pool.getConnection();
        const start = Date.now();

        await connexion.query(person);
        await connexion.query(relation);
        await connexion.query(product);
        await connexion.query(order);

        const end = Date.now();

        return {
            "status": 200,
            "data": "done",
            "time": (end - start) / 1000
        }
    } catch (error) {
        return {
            "status": 409,
            "data": error,
            "time": null
        }
    } finally {
        if (connexion) await connexion.end();
    }
}

const insertPersons = async (arrayPerson) => {
    const batchSize = 100000;
    let insertIndex = 0;
    let duration = 0;

    while (insertIndex < arrayPerson.length) {
        // create batch
        let request = `INSERT INTO person (firstname, lastname) VALUES`;
        const nbPersonToInsert = arrayPerson.length - insertIndex;
        const maxVal = nbPersonToInsert < batchSize ? nbPersonToInsert : batchSize;

        for (let i = 0; i < maxVal - 1; i++) {
            let person = arrayPerson[insertIndex];

            request += `("` + person.firstName + `", "` + person.lastName + `"),`;

            insertIndex++;
        }

        request += `("` + arrayPerson[insertIndex] + `", "` + arrayPerson[insertIndex] + `");`;
        insertIndex++;

        const result = await executeQuery(request);

        if (result.status === '500') {
            return result;
        }

        duration += result.time;
    }

    return {
        status: '200',
        'time': duration
    };
}

const executeQuery = async (query) => {
    let connexion;

    try {
        connexion = await pool.getConnection();
        const start = Date.now();
        const result = await connexion.query(query);
        const end = Date.now();
        const dureeExec = (end - start) / 1000;

        return {
            'status': '200',
            'query': result,
            'time': dureeExec
        }
    } catch (error) {
        return {
            "status": '500',
            "data": error,
            "time": null
        }
    } finally {
        if (connexion) await connexion.end();
    }
}

const insertProducts = async () => {

}

const insertRelationship = async () => {

}

const insertPurchase = async () => {

}

module.exports = {
    createMysqlStructure,
    insertPersons,
    insertProducts,
    insertRelationship,
    insertPurchase
}