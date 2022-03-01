import React, {useState} from 'react';
import '../styles/ActionForm.css'
import {RequestName, StateChanger} from "./Main";
import RequestBtn from "./RequestBtn";
import {Button} from "@chakra-ui/react";

type Props = {
    action: string;
    change: (action: StateChanger, value: any) => void;
    click: () => void;
    isLoading: boolean;
}

const ActionForm = (props: Props) => {
    let form;
    const [selectedRequest, setSelectedRequest] = useState<string>(RequestName.REQUEST_ONE);
    const [selectedTypeInsert, setSelectedTypeInsert] = useState('person');

    const titleReq1: string = 'Liste et nombre de produits commandés par les cercles de followers d\'un individu random';
    const titleReq2: string = 'Nombre de fois qu\'un produit a été commandé par les cercles de followers d\'un individu random';
    const titleReq3: string = 'Nombre de personnes dans un cercle de followers ayant commandé un produit spécifique';

    function changeSelectedRequest(newRequest: string) {
        setSelectedRequest(newRequest);
        props.change(StateChanger.TYPE_REQUEST, newRequest);
    }

    function changeSelectedTypeInsert(typeInsert: string) {
        setSelectedTypeInsert(typeInsert);
        props.change(StateChanger.ENTITY, typeInsert)
    }

    function changeNbInsert(nbInsert: number) {
        if (selectedTypeInsert === 'person') {
            props.change(StateChanger.NB_INSERT_PERSON, nbInsert);
            props.change(StateChanger.NB_INSERT_PRODUCT, 0);
        } else {
            props.change(StateChanger.NB_INSERT_PRODUCT, nbInsert);
            props.change(StateChanger.NB_INSERT_PERSON, 0);
        }
    }

    function changeDepth(depth: number) {
        props.change(StateChanger.DEPTH, depth);
    }

    function changeLimit(limit: number) {
        props.change(StateChanger.LIMIT, limit);
    }

    if (props.action === RequestName.INSERT) {
        return (
            <div className="insert-form">
                <h3>Insertion de données</h3>
                <div className="form-container">
                    <div className="radio-btn-container">
                        <input type="radio"
                               id="insert-choice-1"
                               name="contact"
                               value="person"
                               checked={selectedTypeInsert === "person"}
                               onChange={(e) => changeSelectedTypeInsert(e.target.value)}
                        />
                        <label htmlFor="insert-choice-1">Utilisateurs</label>
                        <input type="radio"
                               id="insert-choice-2"
                               name="contact"
                               value="product"
                               checked={selectedTypeInsert === "product"}
                               onChange={(e) => changeSelectedTypeInsert(e.target.value)}
                        />
                        <label htmlFor="insert-choice-2">Produits</label>
                    </div>
                    <label htmlFor="insert-number">Nombre d'éléments à insérer : </label>
                    <input
                        id="insert-number"
                        type="number"
                        name="insert-number"
                        placeholder="100"
                        onChange={(e) => changeNbInsert(+e.target.value)}
                    />
                </div>
                <div className="Actions-Btn-Container">
                    <Button mt={4} className="Btn" onClick={props.click} isLoading={props.isLoading}>Récupérer</Button>
                </div>
            </div>
        )
    } else if (props.action === 'select') {
        if (selectedRequest === RequestName.REQUEST_ONE) {
            form =
                <>
                    <h3>Requête 1</h3>
                    <p>{titleReq1}</p>
                    <div className="form-container">
                        <label htmlFor="insert-number">Niveau de profondeur souhaité : </label>
                        <input
                            id="input-profondeur"
                            type="number"
                            name="profondeur"
                            placeholder="3"
                            onChange={(e) => changeDepth(+e.target.value)}
                        />
                    </div>
                    <div className="form-container">
                        <label htmlFor="insert-number">Limit : </label>
                        <input
                            id="input-limit"
                            type="number"
                            name="limit"
                            placeholder="5"
                            onChange={(e) => changeLimit(+e.target.value)}
                        />
                    </div>
                </>;
        } else if (selectedRequest === RequestName.REQUEST_TWO) {
            form =
                <>
                    <h3>Requête 2</h3>
                    <p>{titleReq2}</p>
                    <div className="form-container">
                        <div>
                            <label htmlFor="insert-number">Niveau de profondeur souhaité : </label>
                            <input
                                id="input-profondeur"
                                type="number"
                                name="profondeur"
                                placeholder="3"
                                onChange={(e) => changeDepth(+e.target.value)}
                            />
                        </div>
                    </div>
                </>;
        } else if (selectedRequest === RequestName.REQUEST_THREE) {
            form =
                <>
                    <h3>Requête 3</h3>
                    <p>{titleReq3}</p>
                    <div className="form-container">
                        <div>
                            <label htmlFor="insert-number">Niveau de profondeur souhaité : </label>
                            <input
                                id="input-profondeur"
                                type="number"
                                name="profondeur"
                                placeholder="3"
                                onChange={(e) => changeDepth(+e.target.value)}
                            />
                        </div>
                    </div>
                </>;

        } else {
            form = <h3>error</h3>;
        }

        return (
            <div className="insert-form">
                <h3>Récupération de données</h3>
                <div className="Actions-Btn-Container">
                    <div className="Action-Btn">
                        <RequestBtn title={titleReq1} click={changeSelectedRequest}
                                    requestLabel={RequestName.REQUEST_ONE}
                                    btnLabel={'Requête 1'}/>
                    </div>
                    <div className="Action-Btn">
                        <RequestBtn title={titleReq2} click={changeSelectedRequest}
                                    requestLabel={RequestName.REQUEST_TWO}
                                    btnLabel={'Requête 2'}/>
                    </div>
                    <div className="Action-Btn">
                        <RequestBtn title={titleReq3} click={changeSelectedRequest}
                                    requestLabel={RequestName.REQUEST_THREE}
                                    btnLabel={'Requête 3'}/>
                    </div>
                </div>
                {form}
                <div className="Actions-Btn-Container">
                    <Button mt={4} className="Btn" onClick={props.click} isLoading={props.isLoading}>Récupérer</Button>
                </div>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
};

export default ActionForm;