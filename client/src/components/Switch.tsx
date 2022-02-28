import React, {useState} from 'react';
import '../styles/Switch.css'
import {StateChanger} from "./Main";

type Props = {
    change: (action: StateChanger, value: any) => void;
}

const Switch = (props: Props) => {

    const MARIA_DB: string = 'MariaDB';
    const NEO4J: string = 'Neo4j';

    const [neo4jselected, setNeo4JSelected] = useState(false);

    function switchDatabaseState() {
        setNeo4JSelected(!neo4jselected);
        changetypeDB('MariaDB');

        if (neo4jselected) {
            changetypeDB('Neo4j');
        }
    }

    function changetypeDB(dbType: string) {
        props.change(StateChanger.DB_TYPE, dbType);
    }

    return (
        <div className='button' onClick={switchDatabaseState}>
            <div
                className={`switch-btn ${!neo4jselected ? 'button-selected-element' : 'rotate-button-selected-element'}`}>
                <p>{!neo4jselected ? MARIA_DB : NEO4J}</p>
            </div>
            <div className={`switch-btn ${!neo4jselected ? 'not-selected-element' : 'rotate-not-selected-element'}`}>
                <p>{!neo4jselected ? NEO4J : MARIA_DB}</p>
            </div>
        </div>
    )
};

export default Switch;