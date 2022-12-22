import React from 'react'
import { Image } from 'react-native'

export default function showProfilePicture(user, style){
  if(user.url === null){
    return <Image style={style} source={require('../Images/Defaults/defaultProfilePicture.png')} />
  }else{
    return <Image style={style} source={{uri:user.url}} />
  }
}

export function showPartyBanner(party, style){
  if(party.url === null){
    return <Image style={style} source={require('../Images/Defaults/defaultPartyBanner.png')} />
  }else{
    return <Image style={style} source={{uri:party.url}} />
  }
}