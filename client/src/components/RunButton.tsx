import React from 'react';
import '../styles/ActionBtn.css'

type Props = {
    click: () => void;
}

const RunButton = (props: Props) => {

    return (
        <div
            className="Btn"
            onClick={() => props.click()}
        >
            Lancer la requête
        </div>
    );
};

export default RunButton;