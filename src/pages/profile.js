import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Modal, FlatList, Linking } from 'react-native'
import {redOwned, blackOwned } from '../helper/helper'
import { useAuth } from '../contexts/authContext'
import { checkFriend, sendFriendRequest, unfriend, acceptFriendRequest } from '../services/friendship'
import { getUserSocials } from '../services/userServices'
import { getUserParties } from '../services/getPartiesData'
import showProfilePicture from '../helper/helperDefaults'

export default function ProfileScreen({route, navigation}) {

  const {user, doService} = useAuth()
  const {_user} = route.params
  const [socialsArray, setSocialsArray] = useState([])
  const [friendRequested, setFriendRequested] = useState(false)
  const [waitingAccept, setWaitingAccept] = useState(false)
  const [friends, setFriends] = useState(false)
  const [userParties, setUserParties] = useState ([])
  const [modalVisible, setModalVisible] = useState(false)
  
  useEffect(() => {
    async function componentDidMount () {
      if(user.uid !== _user.uid) {
        const response = await doService(() => checkFriend(_user.uid))
        console.log(response)
        if(response.data === 'friends'){
          setFriends(true)
        }else if(response.data === 'sent'){
          setFriendRequested(true)
        }else if(response.data === 'waiting'){
          setWaitingAccept(true)
        }
      }
      const socials = await doService(() => getUserSocials(_user.uid))
      const array = [];
      console.log(socials)
      for(var key in socials){
        if(socials[key] !== null){
          array.push({social: key, username: socials[key]})
        }
      }
      setSocialsArray(array)
      const parties = await doService(() => getUserParties(_user.uid))
      setUserParties(parties)
    }
    componentDidMount()
  }, [])

  const handleSendFriendRequest = async () => {
    const response = await doService(() => sendFriendRequest(_user.uid))
    if(response === 500){console.log('Ja amigos')}
    else if(response === 201){
      console.log('aqui')
      setFriendRequested(true)
    }
  }

  const handleAcceptFriendRequest = async () => {
    const response = await doService(() => acceptFriendRequest(_user.uid))
    if(response === 201){
      setFriends(true)
    }
  }

  const handleUnfriend = async () => {
    const response = await doService(() => unfriend(_user.uid))
    if(response === 400){console.log('Ja não está seguindo')}
    if(response === 201){
      setFriends(false)
      setFriendRequested(false)
    }
  }

  const ProfilePicture = () => {
    return showProfilePicture(_user, styles.profilePicture)
  }

  const FriendButton = () => {
    if(user.uid === _user.uid) return null;
    if(friends){
        return (
          <View style={styles.sendFriendRequestContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.friendsButton}>
              <Text style={styles.friendsText}>AMIGOS</Text>
            </TouchableOpacity>
          </View>
        )
    }else if(friendRequested){
        return (
          <View style={styles.sendFriendRequestContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.friendsButton}>
              <Text style={{...styles.friendsText, fontSize: 18}}>PEDIDO DE AMIZADE ENVIADO</Text>
            </TouchableOpacity>
          </View>
        )
    }else if(waitingAccept){
      return (
        <View style={styles.sendFriendRequestContainer}>
          <TouchableOpacity onPress={() => {handleAcceptFriendRequest()}} style={styles.notFriendsButton}>
            <Text style={styles.notFriendsText}>ACEITAR PEDIDO DE AMIZADE</Text>
          </TouchableOpacity>
        </View>
      )
    }else if(!friends) {
      return (
        <View style={styles.sendFriendRequestContainer}>
          <TouchableOpacity onPress={() => {handleSendFriendRequest()}} style={styles.notFriendsButton}>
            <Text style={styles.notFriendsText}>ADICIONAR AOS AMIGOS</Text>
          </TouchableOpacity>
        </View>
      )
  }
}

  const renderSocials = ({item}) => {
    var iconPath, url;
    if(item.social === 'instagram'){
      iconPath = require('../Images/Icons/instagram.png');
      url = `https://www.instagram.com/${item.username.replace('@', '')}`;
    }
    if(item.social === 'twitter'){
      iconPath = require('../Images/Icons/twitter.png');
      url = `https://www.twitter.com/${item.username.replace('@', '')}`;
    }
    if(item.social === 'tiktok'){
      iconPath = require('../Images/Icons/tiktok.png');
      url = `https://www.tiktok.com/${item.username.charAt(0) === '@' ? item.username : '@' + item.username}`;
    }
    if(item.social === 'youtube'){
      iconPath = require('../Images/Icons/youtube.png');
      url = `https://www.youtube.com/${item.username}`;
    }
    console.log(url)
    return (
      <TouchableOpacity style={styles.socialButton} onPress={async () => await Linking.openURL(url)}>
        <Image source={iconPath} />
        <Text style={styles.username}>{item.username}</Text>
      </TouchableOpacity>
    )
  }

  const Socials = () => {
    if(socialsArray.length !== 0){
      return (
        <View style={styles.socialsContainer}>
          <FlatList 
            data={socialsArray}
            keyExtractor={(item) => item.social}
            renderItem={renderSocials}
            numColumns={2}
            scrollEnabled={false}
          />
        </View>
      )
    }else{
      return null;
    }

  }

  const renderItem = ({item}) => (
    <View style={styles.partyContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('PartyDetails', {party: item})
        }
        style={styles.partyButtonImg}>
        <Image style={styles.partyBanner} source={{uri:item.url}} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('PartyDetails', {party: item})}
        style={styles.partyButtonTitle}>
        <Text style={styles.partyTitleText}>{item.name.toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  );

  const DisplayUserParties = () => {
    if(userParties.length !== 0){
      return(
        <FlatList
          contentContainerStyle={styles.list}
          numColumns={1}
          data={userParties}
          keyExtractor={(item) => item.pid.toString()}
          renderItem={renderItem}
        />
      )
    }else{
      return <Text style={styles.greyText}>Esta pessoa não esta organizando nenhume festa no momento</Text>
    }
  }

  return (
    <ScrollView style={styles.mainContainer}>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalCenterContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalText}>Deseja desfazer amizade com {_user.name}?</Text>
            </View>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={{...styles.modalButton, borderRightWidth: 1}}
              >
                <Text style={styles.modalTextButton}>NÃO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleUnfriend()
                  setModalVisible(false)
                }}
                style={styles.modalButton}
              >
                <Text style={styles.modalTextButton}>SIM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.profilePictureContainer}>
        <View style={styles.borderContainer}>
          <ProfilePicture />
        </View>
        <Text style={styles.profileNameText}>{_user.name}</Text>
      </View>

      <FriendButton />

      <Socials />

      <View style={styles.partiesContainer}>
        <Text style={styles.partiesTitleText}>Festas de {_user.name.split(' ')[0]}:</Text>
        <DisplayUserParties />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: blackOwned,
  },
  modalCenterContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'black',
    width: 300,
    height: 120,
    borderWidth: 1,
    borderColor: redOwned,
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: redOwned,
    width: '100%',
    height: 80,
  },
  modalText: {
    padding: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    height: 38,
  },
  modalButton: {
    height: '100%',
    width: '50%',
    borderColor: redOwned,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  profilePictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  borderContainer: {
    borderWidth: 2,
    borderColor: redOwned,
    width: 155,
    height: 155,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 155
  },
  profilePicture: {
    height: 140,
    width: 140,
    resizeMode: 'stretch',
    borderRadius: 140,
  },
  profileNameText: {
    marginTop: 15,
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold'
  },
  sendFriendRequestContainer: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: redOwned,
  },
  notFriendsButton: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: redOwned,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    height: 39,
    width: '97%',
  },
  friendsButton: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: blackOwned,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: redOwned,
    height: 39,
    width: '97%',
  },
  notFriendsText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  friendsText: {
    color: redOwned,
    fontWeight: 'bold',
    fontSize: 20,
  },
  socialsContainer: {
    marginTop: 6,
    width: '100%',
    paddingBottom: 4,
    borderTopWidth: 1,
    borderColor: redOwned,
  },
  socialButton: {
    flexDirection: 'row',
    width: '50%',
    marginTop: 10,
    marginLeft: '2.5%',
    alignItems: 'center',
  },
  username: {
    color: 'white',
    marginLeft: 5,
    width: '80%',
  },
  partiesContainer: {
    marginTop: 6,
    borderTopWidth: 1,
    borderColor: redOwned,
  },
  partiesTitleText: {
    paddingLeft: 10,
    marginTop: 5,
    color: 'white',
    fontSize: 18,
  },
  greyText: {
    color: 'grey',
    textAlign: 'center',
    marginTop: 6,
  },
  list: {
    paddingTop: 6,
  },
  partyContainer: {
    width: '97%',
    alignSelf: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  partyButtonImg: {
    overflow: 'hidden',
    width: '100%',
    aspectRatio: 90/41,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  partyBanner: {
    width: '100%',
    height: undefined,
    aspectRatio: 90/41,
  },
  partyButtonTitle: {
    backgroundColor: redOwned,
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderWidth: 1,
  },
  partyTitleText: {
    color: blackOwned,
    fontSize: 18,
    fontWeight: 'bold',
  },
})