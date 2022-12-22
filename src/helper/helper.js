import React from 'react'
import { TouchableOpacity, StyleSheet, View, Text, Image, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native'
import { useCreateParty } from '../contexts/createPartyContext'
import { useAuth } from '../contexts/authContext'



export const redOwned = 'rgb(255, 8, 43)';
export const blackOwned = 'rgba(0, 0, 0, 0.91)';
export const highlightOwned = 'rgb(255, 0, 0)'
export const greenOwned = 'rgb(62, 157, 77)'

export const HeaderSettingsAndNotifications = () => {
    const navigation = useNavigation()
    const { notifications } = useAuth()
    const NotificationBell = () => {
      if(notifications.length !== 0){
        return (
          <TouchableOpacity onPress={() => {navigation.navigate('Notifications')}} style={{marginRight: 10}}>
            <Icon name="bell-alert" color={blackOwned} size={30} />
          </TouchableOpacity>
        )
      }else{
        return(
          <TouchableOpacity onPress={() => {navigation.navigate('Notifications')}} style={{marginRight: 10}}>
            <Icon name="bell" color={blackOwned} size={30} />
          </TouchableOpacity>
        )
      }
    }
    
    return(
      <View style={{flexDirection: 'row'}}>
        <NotificationBell />
        <TouchableOpacity onPress={() => {navigation.navigate('Settings')}} style={{marginRight: 10}}>
            <Icons name="settings" color={blackOwned} size={30} />
        </TouchableOpacity>
      </View>
    )
}

export const HeaderBack = () => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 8}}>
            <Icon name="arrow-left-bold" color={blackOwned} size={30} />
        </TouchableOpacity>
    )
}

export const HeaderCancel = (props) => {
    const {setTryingCancel} = useCreateParty();
    return (
        <TouchableOpacity onPress={() => {setTryingCancel(true);}} style={{marginLeft: 8}}>
            <Icon name="arrow-left-bold" color={blackOwned} size={30} />
        </TouchableOpacity>
    )
}

export const HeaderTitle = () => {
    return (
        <View>
            <Image style={{marginTop: 5, width: Dimensions.get('window').width*0.145, height: undefined, aspectRatio: 47/30, alignSelf: 'center'}} source={require('../Images/Icons/partyappblack.png')} />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: redOwned,
        borderBottomWidth: 0,
      },
})
