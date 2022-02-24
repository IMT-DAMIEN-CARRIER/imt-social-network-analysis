const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'projet_nosql'
});

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
            'status': '500',
            'data': error,
            'time': null
        }
    } finally {
        if (connexion) await connexion.end();
    }
}

const createMysqlStructure = async () => {
    const dropPerson = 'DROP TABLE IF EXISTS person';
    const dropRelation = 'DROP TABLE IF EXISTS relation';
    const dropProduct = 'DROP TABLE IF EXISTS product';
    const dropOrders = 'DROP TABLE IF EXISTS orders';

    const person = `
        CREATE TABLE IF NOT EXISTS person (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL
        ) ENGINE InnoDB;
    `;

    const relation = `
        CREATE TABLE IF NOT EXISTS relation (
            id_influencer INT NOT NULL,
            id_follower INT NOT NULL,
            CONSTRAINT fk_id_person_following FOREIGN KEY (id_influencer) REFERENCES person (id),
            CONSTRAINT fk_id_person_followed FOREIGN KEY (id_follower) REFERENCES person (id),
            CONSTRAINT pk_relationship PRIMARY KEY (id_influencer, id_follower)
        ) ENGINE InnoDB;
    `;

    const product = `
        CREATE TABLE IF NOT EXISTS product (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            productName VARCHAR(255) NOT NULL,
            price INT NOT NULL
        ) ENGINE InnoDB;
    `;

    const order = `
        CREATE TABLE IF NOT EXISTS orders (
            id_person INT NOT NULL,
            id_product INT NOT NULL,
            CONSTRAINT fk_id_person FOREIGN KEY (id_person) REFERENCES person (id),
            CONSTRAINT fk_id_product FOREIGN KEY (id_product) REFERENCES product (id),
            CONSTRAINT pk_purchase PRIMARY KEY (id_person, id_product)
        ) ENGINE InnoDB;
    `;

    let connexion;

    try {
        connexion = await pool.getConnection();
        const start = Date.now();

        await connexion.query(dropRelation);
        await connexion.query(dropOrders);
        await connexion.query(dropPerson);
        await connexion.query(dropProduct);
        await connexion.query(person);
        await connexion.query(product);
        await connexion.query(relation);
        await connexion.query(order);

        const end = Date.now();

        return {
            'status': 200,
            'data': 'done',
            'time': (end - start) / 1000
        }
    } catch (error) {
        return {
            'status': 409,
            'data': error,
            'time': null
        }
    } finally {
        if (connexion) await connexion.end();
    }
}

const getPersonMaxId = async () => {
    const request = `SELECT MAX(id) as id FROM person;`;

    return await executeQuery(request);
}

const getProductMaxId = async () => {
    const request = `SELECT MAX(id) as id FROM product;`;

    return await executeQuery(request);
}

const insertPersons = async (arrayPerson) => {
    const batchSize = 100000;
    let insertIndex = 0;
    let duration = 0;

    while (insertIndex < arrayPerson.length) {
        // create batch
        let request = 'INSERT INTO person (firstname, lastname) VALUES';
        const nbPersonToInsert = arrayPerson.length - insertIndex;
        const maxVal = nbPersonToInsert <= batchSize ? nbPersonToInsert : batchSize;

        for (let i = 0; i < maxVal - 1; i++) {
            let person = arrayPerson[insertIndex];

            request += '("' + person.firstName + '", "' + person.lastName + '"),';

            insertIndex++;
        }

        request += `("` + arrayPerson[insertIndex].firstName + `", "` + arrayPerson[insertIndex].lastName + `");`;
        insertIndex++;

        const result = await executeQuery(request);

        if (result.status === '500') {
            return result;
        }

        duration += result.time;
    }

    return {
        'status': '200',
        'time': duration,
        'data': 'L\'insertion de ' + arrayPerson.length + ' a été réalisée'
    };
}

const insertRelations = async (arrayRelations) => {
    const batchSize = 100000;
    let insertIndex = 0;
    let duration = 0;

    while (insertIndex < arrayRelations.length) {
        // create batch
        let request = 'INSERT INTO relation (id_influencer, id_follower) VALUES';
        const nbRelationToInsert = arrayRelations.length - insertIndex;
        const maxVal = nbRelationToInsert < batchSize ? nbRelationToInsert : batchSize;

        for (let i = 0; i < maxVal - 1; i++) {
            let relation = arrayRelations[insertIndex];

            request += '(' + relation.follower + ', ' + relation.followed + '),';

            insertIndex++;
        }

        request += `(` + arrayRelations[insertIndex].follower + `, ` + arrayRelations[insertIndex].followed + `);`;
        insertIndex++;

        const result = await executeQuery(request);

        if (result.status === '500') {
            return result;
        }

        duration += result.time;
    }

    return {
        'status': '200',
        'time': duration,
        'data': 'L\'insertion de ' + arrayRelations.length + ' a été réalisée'
    };
}

const insertProducts = async (arrayProduct) => {
    const batchSize = 100000;
    let insertIndex = 0;
    let duration = 0;

    while (insertIndex < arrayProduct.length) {
        let request = 'INSERT INTO product (productName, price) VALUES ';
        const nbProductToInsert = arrayProduct.length - insertIndex;
        const maxVal = nbProductToInsert < batchSize ? nbProductToInsert : batchSize;

        for (let i = 0; i < maxVal - 1; i++) {
            let product = arrayProduct[insertIndex];
            request += '("' + product.productName + '", "' + product.price + '"),';
            insertIndex++;
        }

        request += '("' + arrayProduct[insertIndex].productName + '", "' + arrayProduct[insertIndex].price + '");';
        insertIndex++;

        const result = await executeQuery(request);

        if (result.status === '500') {
            return result;
        }

        duration += result.time;
    }

    return {
        'status': '200',
        'time': duration,
        'data': 'L\'insertion de ' + arrayProduct.length + ' produits a été réalisée.'
    };
}

const insertPurchase = async (arrayPurchase) => {
    const batchSize = 100000;
    let insertIndex = 0;
    let duration = 0;

    while (insertIndex < arrayPurchase.length) {
        let request = 'INSERT INTO orders (id_person, id_product) VALUES ';
        const nbRelationToInsert = arrayPurchase.length - insertIndex;
        const maxVal = nbRelationToInsert < batchSize ? nbRelationToInsert : batchSize;

        for (let i = 0; i < maxVal - 1; i++) {
            let relation = arrayPurchase[insertIndex];

            request += '(' + relation.person + ', ' + relation.product + '),';

            insertIndex++;
        }

        request += `(` + arrayPurchase[insertIndex].person + `, ` + arrayPurchase[insertIndex].product + `);`;
        insertIndex++;

        const result = await executeQuery(request);

        if (result.status === '500') {
            return result;
        }

        duration += result.time;
    }

    return {
        'status': '200',
        'time': duration,
        'data': 'Les relations de personnes -> produits ont été insérées'
    };
}

const findAllPersons = async () => {
    const result = await executeQuery('SELECT * FROM person;');

    return {result};
}

const getProductByInfluencer = async (idInfluencer) => {
    if (idInfluencer === 0) {
        return {
            'status': '500',
            'data': 'Error 500'
        };
    }

    let request = ` SELECT pr.id
            FROM product pr
            JOIN orders o ON pr.id=o.id_product
            JOIN person p ON o.id_person=p.id
            WHERE p.id=
    ` + idInfluencer + ' ORDER BY pr.id';

    return await executeQuery(request);
}

const generateRequestSelectOneAndTwo = (request, depth, idInfluencer) => {
    if (depth > 0) {
        for (let counter = 1; counter <= depth; counter++) {
            request += ' OR o.id_person IN';

            for (let i = 1; i < counter; i++) {
                request += `
                (SELECT r.id_follower
                    FROM relation r
                    WHERE r.id_influencer IN 
                `;
            }

            request += `
                (SELECT r.id_follower
                    FROM relation r
                    WHERE r.id_influencer=` + idInfluencer;

            request += ')'.repeat(counter);
        }
    }

    return request
}

const getProductsOrderedByFollowers = async (idInfluencer, depth, limit) => {
    if (idInfluencer === 0) {
        return {
            status: '500',
            'data': 'Error 500'
        };
    }

    let request = `SELECT pr.id, pr.productName, COUNT(o.id_person) AS nbOrders 
                FROM product pr
                JOIN orders o ON pr.id=o.id_product
                JOIN person p ON p.id=o.id_person
                WHERE p.id=` + idInfluencer
    ;

    request = generateRequestSelectOneAndTwo(request, depth, idInfluencer);
    request += ' GROUP BY pr.id LIMIT ' + limit;

    return await executeQuery(request);
}

const getProductsOrderedByFollowersAndByProduct = async (idInfluencer, idProduct, depth) => {
    if (!idInfluencer) {
        return {
            'status': '500',
            'data': 'Error 500 : influenceur'
        };
    }

    if (!idProduct) {
        return {
            'status': '500',
            'data': 'Error 500 : product'
        };
    }

    let request = `SELECT pr.id, pr.productName, COUNT(o.id_person) AS nbOrders 
                FROM product pr
                JOIN orders o ON pr.id=o.id_product
                JOIN person p ON p.id=o.id_person
                WHERE pr.id=` + idProduct + ' AND (p.id=' + idInfluencer
    ;

    request = generateRequestSelectOneAndTwo(request, depth, idInfluencer);
    request += ') GROUP BY pr.id';

    return await executeQuery(request);
}

const getProductVirality = async (idProduct, depth) => {
    if (!idProduct) {
        return {
            'status': '500',
            'data': 'Error 500 : product'
        };
    }

    let request = `SELECT pr.productName, COUNT(o.id_person) AS 'nbOrder'
            FROM product pr
            JOIN orders o ON pr.id=o.id_product
            WHERE pr.id=` + idProduct;

    if (depth > 0) {
        request += ' AND O.id_person IN ';

        for (let i = 1; i < depth; i++) {
            request += `(SELECT r.id_influencer
                FROM relation r
                JOIN orders o ON r.id_follower=o.id_person
                JOIN product pr ON o.id_product=pr.id
                WHERE pr.id=` + idProduct + ' AND r.id_influencer IN ';
        }

        request += `(SELECT r.id_influencer
                FROM relation r
                JOIN orders o ON r.id_follower=o.id_person
                JOIN product pr ON o.id_product=pr.id
                WHERE pr.id=` + idProduct;

        request += ')'.repeat(depth);
    }

    request += ' GROUP BY pr.id';

    return await executeQuery(request);
}

module.exports = {
    createMysqlStructure,
    insertPersons,
    insertProducts,
    insertRelations,
    insertPurchase,
    getPersonMaxId,
    getProductMaxId,
    findAllPersons,
    getProductByInfluencer,
    getProductsOrderedByFollowers,
    getProductsOrderedByFollowersAndByProduct,
    getProductVirality
}