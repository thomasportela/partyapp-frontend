import React, { createContext, useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { authenticate } from '../services/authentication'
import axiosDo from '../services/axios'
import handleRefreshToken from '../services/refreshToken'
import getUserNameAndPicture from '../services/userServices'
import { checkFriendRequests } from '../services/friendship'

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true)

    async function refreshNotifications() {
      try{
        const response = await doService(checkFriendRequests);
        console.log(response)
        response.status === 200 ? setNotifications(response.data.friendRequests) : setNotifications([])
      }catch(err){
        console.log(err)
      }
    }

    useEffect(() => {
        // logout()
        // setLoading(false)
        async function loadStorageData() {
            const storagedUser = await AsyncStorage.getItem('@PartyApp:user')
            const storagedAccessToken = await AsyncStorage.getItem('@PartyApp:accessToken')
            if(storagedUser != null && storagedAccessToken != null){
                console.log(storagedUser, storagedAccessToken)
                setUser(JSON.parse(storagedUser))
                axiosDo.defaults.headers.common['Authorization'] = `Bearer ${storagedAccessToken}`;
                refreshNotifications();
            }
            setLoading(false)
        }
        loadStorageData();
    }, [])

    async function doService(service){
        const response = await service()
        if(response.status === 401 || response.status === 403){
            const isRefreshed = await getRefreshedToken()
            if(isRefreshed){return await doService(service)}
        }else{
            console.log(response)
            return response
        }
    }

    async function updateProfilePicture() {
        const userInDB = await doService(() => getUserNameAndPicture(user.uid));
        console.log(userInDB)
        const newUser = {...user, url: userInDB[0].url}
        setUser(newUser)
        await AsyncStorage.setItem('@PartyApp:user', JSON.stringify(newUser))
    }

    async function login(values){
        const response = await authenticate(values);
        if(response === 412){
            return 'Não achamos nem teu e-mail \u{1f937}';
        }else if(response === 401){
            return 'A senha não é essa não \u{1f914}';
        }else{
            axiosDo.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`
            await AsyncStorage.setItem('@PartyApp:user', JSON.stringify(response.user))
            console.log(response.accessToken)
            await AsyncStorage.setItem('@PartyApp:accessToken', response.accessToken)
            await AsyncStorage.setItem('@PartyApp:refreshToken', response.refreshToken)
            setUser(response.user)
            refreshNotifications()
        }
    }

    async function logout(){
        AsyncStorage.clear().then(() => setUser(null));
    }

    async function getRefreshedToken(){
        const refreshToken = await AsyncStorage.getItem('@PartyApp:refreshToken')
        console.log(refreshToken);
        const response = await handleRefreshToken(refreshToken);
        if(response == 401 || response == 403){
            logout();
            return false;
        }else{
            const accessToken = response
            axiosDo.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            await AsyncStorage.setItem('@PartyApp:accessToken', accessToken)
            return true;
        }
    }

    if(loading){
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
                <ActivityIndicator size="large" color="white"></ActivityIndicator>
            </View>
        )
    }

    return (
        <AuthContext.Provider value={{loged: !!user, user, login, logout, doService, updateProfilePicture, refreshNotifications, notifications}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)
    return context
};