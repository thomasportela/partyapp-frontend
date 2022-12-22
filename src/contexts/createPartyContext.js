import React, { createContext, useState, useEffect, useContext } from 'react';

const CreatePartyContext = createContext({});

export const CreatePartyProvider = ({children}) => {
    const [creatingParty, setCreatingParty] = useState(false)
    const [tryingCancel, setTryingCancel] = useState(false)
    const [partyCreated, setPartyCreated] = useState(false)

    function startCreatingParty() {
        setCreatingParty(true)
    }

    function stopCreatingParty() {
        setCreatingParty(false)
    }

    function doneCreatingParty() {
        setPartyCreated(true)
        setCreatingParty(false)
    }

    return (
        <CreatePartyContext.Provider value={{creatingParty, startCreatingParty, stopCreatingParty, doneCreatingParty, tryingCancel, setTryingCancel, partyCreated, setPartyCreated}}>
            {children}
        </CreatePartyContext.Provider>
    )
}

export function useCreateParty(){
    const context = useContext(CreatePartyContext)
    return context
};