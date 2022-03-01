import React, {useEffect, useState} from 'react';
import '../styles/Switch.css'
import {StateChanger} from "./Main";

type Props = {
    change: (action: StateChanger, value: any) => void;
}

const Switch = (props: Props) => {

    const MARIA_DB: string = 'MariaDB';
    const NEO4J: string = 'Neo4j';

    const [neo4jSelected, setNeo4jSelected] = useState(false);

    function switchDatabaseState() {
        setNeo4jSelected(!neo4jSelected);
    }

    useEffect(() => {
        changeTypeDB(neo4jSelected ? NEO4J : MARIA_DB);
    }, [neo4jSelected])

    function changeTypeDB(dbType: string) {
        props.change(StateChanger.DB_TYPE, dbType);
    }

    return (
        <div className='button' onClick={switchDatabaseState}>
            <div
                className={`switch-btn ${!neo4jSelected ? 'button-selected-element' : 'rotate-button-selected-element'}`}>
                <p>{!neo4jSelected ? MARIA_DB : NEO4J}</p>
            </div>
            <div className={`switch-btn ${!neo4jSelected ? 'not-selected-element' : 'rotate-not-selected-element'}`}>
                <p>{!neo4jSelected ? NEO4J : MARIA_DB}</p>
            </div>
        </div>
    )
};

export default Switch;