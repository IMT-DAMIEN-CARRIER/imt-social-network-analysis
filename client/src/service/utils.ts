import {insertMysql, requestOne, requestThree, requestTwo} from "./MysqlCall";
import {AxiosResponse} from "axios";
import {RequestName} from "../components/Main";

export const switchTypeRequest = async (dbType: string, typeRequest: string, entity: string, nbInsert: number, depth: number, idProduct: number, limit: number): Promise<AxiosResponse | undefined> => {
    if ('MariaDB' === dbType) {
        switch (typeRequest) {
            case RequestName.INSERT:
                return await insertMysql(entity, nbInsert);
            case RequestName.REQUEST_ONE:
                return await requestOne(depth, limit);
            case RequestName.REQUEST_TWO:
                return await requestTwo(depth, idProduct);
            case RequestName.REQUEST_THREE:
                return await requestThree(depth, idProduct);
            default:
                throw new Error('Erreur dans le type de requête');
        }
    }
}