import axios, {AxiosResponse} from 'axios';

export const insertMysql = async (entity: string, nbInsert: number): Promise<AxiosResponse> => {
    let url = 'http://localhost:5050/mysql';

    if ('person' === entity) {
        url += '/person';
    } else {
        url += '/product';
    }

    return await axios.post(
        url + '/add',
        {params: {nbProduct: nbInsert}}
    );
}

export const requestOne = async (depth: number, limit: number): Promise<AxiosResponse> => {
    return await axios.get(
        'http://localhost:5050/mysql/person/get/product-ordered-from-followers-by-influencer',
        {
            params: {
                profondeur: depth,
                limit: limit
            }
        }
    );
}

export const requestTwo = async (depth: number, idProduct: number): Promise<AxiosResponse> => {
    return await axios.get(
        'http://localhost:5050/mysql/person/get/product-ordered-from-followers-by-influencer-by-product',
        {
            params: {
                profondeur: depth,
                idProduct: idProduct
            }
        }
    );
}

export const requestThree = async (depth: number, idProduct: number): Promise<AxiosResponse> => {
    return await axios.get(
        'http://localhost:5050/mysql/person/get/product-virality',
        {
            params: {
                profondeur: depth,
                idProduct: idProduct
            }
        }
    );
}