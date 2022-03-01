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
    ENTITY = 'ENTITY',
    TYPE_REQUEST = 'TYPE_REQUEST',
    DEPTH = 'DEPTH',
    DB_TYPE = 'DB_TYPE',
    LIMIT = 'LIMIT',
    NB_INSERT_PERSON = 'NB_INSERT_PERSON',
    NB_INSERT_PRODUCT = 'NB_INSERT_PRODUCT'
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
    const [depth, setDepth] = useState<number>(0);
    const [dbType, setDbType] = useState<string>('MariaDB');
    const [limit, setLimit] = useState<number>(5);
    const [nbInsertPerson, setNbInsertPerson] = useState<number>(0);
    const [nbInsertProduct, setNbInsertProduct] = useState<number>(0);

    function handleChangeResult(newResult: string) {
        setResult(newResult);
    }

    function setActionForm(newState: string) {
        setFormState(newState);
    }

    function handleClear() {
        setResult('');
    }

    async function handleRunRequest() {
        const response = await switchTypeRequest(
            dbType,
            typeRequest,
            entity,
            depth,
            limit,
            nbInsertPerson,
            nbInsertProduct
        );

        let res;

        if (response) {
            if ('MariaDB' === dbType) {
                switch (typeRequest) {
                    case RequestName.INSERT:
                        if ('person' === entity) {
                            res = {
                                durationInsertPersons: response.data.result.durationInsertPersons,
                                durationInsertRelations: response.data.result.durationInsertRelations,
                            }
                        } else {
                            res = {
                                durationInsertProducts: response.data.result.durationInsertProducts,
                                durationInsertPurchase: response.data.result.durationInsertPurchase
                            }
                        }

                        break;
                    case RequestName.REQUEST_ONE:
                        res = {
                            status: response.data.result.status,
                            time: response.data.result.time + 's',
                            influenceur: response.data.idInfluenceur,
                            data: response.data.result.data
                        };

                        break;
                    case RequestName.REQUEST_TWO:
                        res = {
                            status: response.data.result.status,
                            time: response.data.result.time + 's',
                            influenceur: response.data.idInfluenceur,
                            product: response.data.idProduct,
                            nbOrders: response.data.result.data[0].nbOrders
                        };

                        break;
                    case RequestName.REQUEST_THREE:
                        res = {
                            status: response.data.result.status,
                            time: response.data.result.time + 's',
                            idProduct: response.data.idProduct,
                            data: response.data.result.data
                        };

                        break;
                }
            } else {
                res = {
                    status: response.data.status,
                    time: response.data.time + 's'
                };

                switch (typeRequest) {
                    case RequestName.INSERT:
                        break;
                    case RequestName.REQUEST_ONE:
                        res = {
                            ...res,
                            influencer: response.data.influencer,
                            data: response.data.result
                        };

                        break;
                    case RequestName.REQUEST_TWO:
                        res = {
                            ...res,
                            influencer: response.data.influencer,
                            productName: response.data.productName,
                            nbOrders: response.data.nbOrders
                        };

                        break;
                    case RequestName.REQUEST_THREE:
                        res = {
                            ...res,
                            productName: response.data.productName,
                            nbOrders: response.data.nbOrders
                        };

                        break;
                }
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
            case StateChanger.TYPE_REQUEST:
                setTypeRequest(value);

                break;
            case StateChanger.DEPTH:
                setDepth(value);

                break;
            case StateChanger.DB_TYPE:
                setDbType(value);

                break;
            case StateChanger.LIMIT:
                setLimit(value);

                break;
            case StateChanger.NB_INSERT_PERSON:
                setNbInsertPerson(value);

                break;
            case StateChanger.NB_INSERT_PRODUCT:
                setNbInsertProduct(value);

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