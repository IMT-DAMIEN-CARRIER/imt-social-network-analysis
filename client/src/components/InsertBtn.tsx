import React from 'react';
import '../styles/ActionBtn.css'
import {RequestName, StateChanger} from "./Main";

type Props = {
    click: (newState: string) => void;
    change: (action: StateChanger, value: any) => void;
}

const InsertBtn = (props: Props) => {
    function handleClick() {
        props.click(RequestName.INSERT);
        props.change(StateChanger.TYPE_REQUEST, RequestName.INSERT);
    }

    return (
        <div className="Btn" onClick={handleClick}>Insertion de données</div>
    );
};

export default InsertBtn;