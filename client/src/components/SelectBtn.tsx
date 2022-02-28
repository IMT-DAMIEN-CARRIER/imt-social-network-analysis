import React from 'react';
import '../styles/ActionBtn.css'
import {RequestName, StateChanger} from "./Main";

type Props = {
    click: (newState: string) => void;
    change: (action: StateChanger, value: any) => void;
}

const SelectBtn = (props: Props) => {
    function handleClick() {
        props.click('select');
        props.change(StateChanger.TYPE_REQUEST, RequestName.REQUEST_ONE);
    }

    return (
        <div
            className="Btn"
            onClick={handleClick}
        >
            Récupérer des données
        </div>
    )
};

export default SelectBtn;