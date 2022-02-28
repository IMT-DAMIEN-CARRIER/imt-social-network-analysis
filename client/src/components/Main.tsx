import React, {useState} from 'react';
import {Stack} from 'react-bootstrap';
import '../styles/Main.css'
import Results from './Results';
import Switch from './Switch';
import ClearButton from './ClearButton';
import InsertBtn from './InsertBtn';
import SelectBtn from './SelectBtn';
import RunButton from './RunButton';
import ActionForm from './ActionForm';
import {switchTypeRequest} from '../service/utils';

export enum StateChanger {
    NB_INSERT = 'NB_INSERT',
    ENTITY = 'ENTITY',
    TYPE_REQUEST = 'TYPE_REQUEST',
    DEPTH = 'DEPTH',
    ID_PRODUCT = 'ID_PRODUCT',
    DB_TYPE = 'DB_TYPE',
    LIMIT = 'LIMIT'
}

export enum RequestName {
    INSERT = 'insert',
    REQUEST_ONE = 'request1',
    REQUEST_TWO = 'request2',
    REQUEST_THREE = 'request3',
}

const Main = () => {
    const [result, setResult] = useState<string>('');
    const [formState, setFormState] = useState<string>('hidden');
    const [typeRequest, setTypeRequest] = useState<string>(RequestName.INSERT);
    const [entity, setEntity] = useState<string>('person');
    const [nbInsert, setNbInsert] = useState<number>(0);
    const [depth, setDepth] = useState<number>(0);
    const [idProduct, setIdProduct] = useState<number>(0);
    const [dbType, setDbType] = useState<string>('MariaDB');
    const [limit, setLimit] = useState<number>(5);

    function handleChangeResult(newResult: string) {
        setResult(newResult);
    }

    function setActionForm(newState: string) {
        setFormState(newState);
    }

    function handleClear() {
        setResult('');
    }

    async function handleRunRequest(dbType: string, typeRequest: string, entity: string, nbInsert: number, depth: number, idProduct: number, limit: number) {
        const response = await switchTypeRequest(dbType, typeRequest, entity, nbInsert, depth, idProduct, limit);
        let res;

        if (response) {
            if (RequestName.REQUEST_ONE === typeRequest) {
                res = {
                    time: response.data.result.time + 's',
                    influenceur: response.data.idInfluenceur,
                    data: response.data.result.query
                };
            } else if (RequestName.REQUEST_TWO === typeRequest) {
                res = {
                    time: response.data.result.time + 's',
                    influenceur: response.data.idInfluenceur,
                    product: response.data.idProduct,
                    data: response.data.result.query
                };
            }
        } else {
            res = {
                error: 'Il y a eu une erreur dans la requête.'
            }
        }

        setResult(JSON.stringify(res, null, 2));
    }

    function handleSubmit(action: StateChanger, value: any) {
        switch (action) {
            case StateChanger.ENTITY:
                setEntity(value);

                break;
            case StateChanger.NB_INSERT:
                setNbInsert(value);

                break;
            case StateChanger.TYPE_REQUEST:
                setTypeRequest(value);

                break;

            case StateChanger.DEPTH:
                setDepth(value);

                break;

            case StateChanger.ID_PRODUCT:
                setIdProduct(value);

                break;
            case StateChanger.DB_TYPE:
                setDbType(value);

                break;

            case StateChanger.LIMIT:
                setLimit(value);

                break;
        }
    }

    return (
        <Stack className="App-main">
            <div className="Db-Selector">
                <Switch change={handleSubmit}/>
            </div>
            <div className="Actions-Btn-Container">
                <div className="Action-Btn">
                    <InsertBtn click={setActionForm} change={handleSubmit}/>
                </div>
                <div className="Action-Btn">
                    <SelectBtn click={setActionForm} change={handleSubmit}/>
                </div>
            </div>
            <div className="Action-Form">
                <ActionForm action={formState} change={handleSubmit}/>
            </div>
            <div className="Actions-Btn-Container">
                <RunButton
                    dbType={dbType}
                    typeRequest={typeRequest}
                    entity={entity}
                    depth={depth}
                    idProduct={idProduct}
                    nbInsert={nbInsert}
                    limit={limit}
                    click={handleRunRequest}
                />
            </div>
            <div className="Result-display">
                <Results result={result} onChange={handleChangeResult}/>
            </div>
            <div className="Clear-Btn">
                <ClearButton clear={handleClear}/>
            </div>
        </Stack>
    )
}

export default Main;