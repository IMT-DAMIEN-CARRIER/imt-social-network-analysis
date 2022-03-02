import {insertMysql, requestOneMysql, requestTwoMysql} from "./MysqlCall";
import {AxiosResponse} from "axios";
import {RequestName} from "../components/Main";
import {insertNeo4j, requestOneNeo4j, requestTwoNeo4j} from "./Neo4jCall";

export const switchTypeRequest = async (
    dbType: string,
    typeRequest: string,
    entity: string,
    depth: number,
    limit: number,
    nbInsertPerson: number,
    nbInsertProduct: number
): Promise<AxiosResponse | undefined> => {
    if ('MariaDB' === dbType) {
        switch (typeRequest) {
            case RequestName.INSERT:
                return await insertMysql(entity, nbInsertPerson, nbInsertProduct);
            case RequestName.REQUEST_ONE:
                return await requestOneMysql(depth, limit);
            case RequestName.REQUEST_TWO:
                return await requestTwoMysql(depth);
            case RequestName.REQUEST_THREE:
                return;
            default:
                throw new Error('Erreur dans le type de requête');
        }
    } else {
        switch (typeRequest) {
            case RequestName.INSERT:
                return await insertNeo4j(entity, nbInsertPerson, nbInsertProduct);
            case RequestName.REQUEST_ONE:
                return await requestOneNeo4j(depth, limit);
            case RequestName.REQUEST_TWO:
                return await requestTwoNeo4j(depth);
            case RequestName.REQUEST_THREE:
                return;
            default:
                throw new Error('Erreur dans le type de requête');
        }
    }
}