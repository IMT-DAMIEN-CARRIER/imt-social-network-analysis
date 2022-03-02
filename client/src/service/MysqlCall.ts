import axios, {AxiosResponse} from 'axios';

const urlLocal = 'http://localhost:5050/mysql';

export const insertMysql = async (entity: string, nbInsertPerson: number, nbInsertProduct: number): Promise<AxiosResponse> => {
    let url = urlLocal;
    let params;

    if ('person' === entity) {
        url += '/person';
        params = {
            nbPerson: nbInsertPerson
        }
    } else {
        url += '/product';
        params = {
            nbProduct: nbInsertProduct
        }
    }

    return await axios.post(
        url + '/add',
        params
    );
}

export const requestOneMysql = async (depth: number, limit: number): Promise<AxiosResponse> => {
    return await axios.get(
        urlLocal + '/person/get/product-ordered-from-followers-by-influencer',
        {
            params: {
                profondeur: depth,
                limit: limit
            }
        }
    );
}

export const requestTwoMysql = async (depth: number): Promise<AxiosResponse> => {
    return await axios.get(
        urlLocal + '/person/get/product-ordered-from-followers-by-influencer-by-product',
        {
            params: {
                profondeur: depth
            }
        }
    );
}