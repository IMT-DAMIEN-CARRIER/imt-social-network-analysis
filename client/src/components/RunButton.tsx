import React from 'react';
import '../styles/ActionBtn.css'

type Props = {
    dbType: string;
    typeRequest: string;
    entity: string;
    nbInsert: number;
    depth: number;
    idProduct: number;
    limit: number
    click: (dbType: string, typeRequest: string, typeInsert: string, nbInsert: number, depth: number, idProduct: number, limit: number) => void;
}

const RunButton = (props: Props) => {

    return (
        <div
            className="Btn"
            onClick={() => props.click(
                props.dbType,
                props.typeRequest,
                props.entity,
                props.nbInsert,
                props.depth,
                props.idProduct,
                props.limit
            )}
        >
            Lancer la requête
        </div>
    );
};

export default RunButton;