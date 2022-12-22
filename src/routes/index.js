import React from 'react';
import { useAuth } from '../contexts/authContext';
import { useCreateParty} from '../contexts/createPartyContext';
import AppRoutes from './app.routes'
import AuthRoutes from './auth.routes'
import CreatePartyRoutes from './createParty.routes'


const Routes = () => {
    const { loged } = useAuth();
    const { creatingParty } = useCreateParty();
    if(loged){
        if(creatingParty){
            return <CreatePartyRoutes />
        }
        return <AppRoutes />
    }else{
        return <AuthRoutes />
    }    
}

export default Routes