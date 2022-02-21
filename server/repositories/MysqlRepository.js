const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE_ADRESS,{
    logging: false
});

const createMysqlStructure = async () => {
    const person = `
        CREATE TABLE IF NOT EXISTS person (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            firstname VARCHAR(8) NOT NULL,
            lastname VARCHAR(8) NOT NULL
        ) ENGINE InnoDB;
    `;

    var relation = `
        CREATE TABLE IF NOT EXISTS relation (
            id_person_following INT NOT NULL,
            id_person_followed INT NOT NULL,
            CONSTRAINT fk_id_person_following FOREIGN KEY (id_person_following) REFERENCES person(id),
            CONSTRAINT fk_id_person_followed FOREIGN KEY (id_person_followed) REFERENCES person(id),
            CONSTRAINT pk_relationship PRIMARY KEY (id_person_following, id_person_followed)
        )ENGINE InnoDB;
    `

    const product = `
        CREATE TABLE IF NOT EXISTS product (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            productName VARCHAR(8) NOT NULL,
            price INT NOT NULL
        )ENGINE InnoDB;
    `

    const order = `
        CREATE TABLE IF NOT EXISTS order (
            id_person INT NOT NULL,
            id_product INT NOT NULL,
            CONSTRAINT fk_id_person FOREIGN KEY (id_person) REFERENCES person(id),
            CONSTRAINT fk_id_product FOREIGN KEY (id_product) REFERENCES product(id),
            CONSTRAINT pk_purchase PRIMARY KEY (id_person, id_product)
        )ENGINE InnoDB;
    `

    try {
        const start = +new Date();

        await sequelize.query(person)
        await sequelize.query(relation)
        await sequelize.query(product)
        await sequelize.query(order)

        const end = +new Date();

        return {
            "status" : 200,
            "data" : "Toutes les tables ont été correctements ajoutées",
            "time" : (end - start) / 1000
        }

    } catch (error) {
        throw {
            "status" : 409,
            "data" : error,
            "time" : null
        }
    }
}