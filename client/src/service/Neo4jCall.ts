import axios, {AxiosResponse} from 'axios';

const urlLocal = 'http://localhost:5050/neo4j';

export const insertNeo4j = async (entity: string, nbInsertPerson: number, nbInsertProduct: number): Promise<AxiosResponse> => {
    let url = urlLocal;
    let params;

    if ('person' === entity) {
        url += '/person';
        params = {
            nbPerson: nbInsertPerson,
            nbProduct: nbInsertProduct
        }
    } else {
        url += '/product';
        params = {
            nbProduct: nbInsertProduct
        }
    }

    return await axios.post(url + '/add', params);
}

export const requestOneNeo4j = async (depth: number, limit: number) => {
    return await axios.get(
        urlLocal + '/product/get/product-ordered-from-followers-by-influencer',
        {
            params: {
                profondeur: depth,
                limit: limit
            }
        }
    );
}

export const requestTwoNeo4j = async (depth: number) => {
    return await axios.get(
        urlLocal + '/product/get/product-ordered-from-followers-by-influencer-by-product',
        {
            params: {
                profondeur: depth
            }
        }
    )
}