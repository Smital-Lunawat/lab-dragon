"use client"

import React, { useState, useContext, useEffect } from 'react';


// components
import Sidebar from './Sidebar';
import EntityInput from './EntityInput';
import CreationPopupProvider, { CreationPopupContext } from '../contexts/CreationPopupContext';

const BASE_API = "http://localhost:8000/api/";

async function getSidebarItems() {
    const response = await fetch(BASE_API + "entities");
    return await response.json();
}


export default function EntityPopupWrapper({ children }) {
    
    const [entities, setEntities] = useState([]); // The entities that will be displayed in the sidebar
    const { isPopupOpen, setIsPopupOpen, setName } = useContext(CreationPopupContext);
    

    const closePopup = () => {setIsPopupOpen(false)}

    function populateSidebarItems() {
        getSidebarItems().then(data => {
            setEntities(data);
        });
    }

    useEffect(() => {
        populateSidebarItems();
    }, []);


    return (
        <div>
            {isPopupOpen ? <EntityInput populateSideBar={populateSidebarItems}/> : null}
            <div className="flex-container">
                <div className="sidebar-wrapper">
                    <Sidebar entities={entities}/>
                </div>
                <div className="children-wrapper">
                    {children}
                </div>
            </div>
            <button className="add-entity-button" onClick={() => {
                    setName("");
                    setIsPopupOpen(!isPopupOpen);
                }}>+</button>
        </div>
    )

    
}




