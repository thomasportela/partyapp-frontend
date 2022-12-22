import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableHighlight,
  Dimensions,
  FlatList,
  LogBox,
  TouchableOpacity,
  Linking,
} from 'react-native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import { redOwned, blackOwned, highlightOwned } from '../helper/helper';
import getOrganizers from '../services/getOrganizers'
import getUserNameAndPicture from '../services/userServices'
import { purchaseTicket } from '../services/purchases';
import showProfilePicture, { showPartyBanner } from '../helper/helperDefaults'

export default function PartyDetailsScreen({route, navigation}) {
  const {doService} = useAuth();
  const {party} = route.params;
  const [address, setAddress] = useState('')
  const [organizers, setOrganizers] = useState([])

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation']);
    async function componentDidMount () {
      const response = await doService(() => getOrganizers(party.pid))
      const response2 = await doService(() => getUserNameAndPicture(party.creator_uid))
      console.log(response)
      console.log(response2)
      const organizers = response2.concat(response)
      for(var i = organizers.length -1; i >= 1; i--){
        if(organizers[i].uid === organizers[0].uid){
          organizers.splice(i, 1);
        }
      }
      setOrganizers(organizers);
      const response3 = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${party.latitude},${party.longitude}&key=AIzaSyDTDSBesQCSDBNgPDBdzBZg8ShY7HfzRnQ`)
      setAddress(response3.data.results[0].formatted_address)
    }
    componentDidMount();
  }, [])

  const position = {
    latitude: party.latitude,
    longitude: party.longitude,
    latitudeDelta: 0.00522,
    longitudeDelta: 0.00422,
  }

  const Observations = () => {
    const obs = [party.obs1, party.obs2, party.obs3]
    for(var i = obs.length - 1; i >= 0; i--) {
      if(obs[i] === null){obs.splice(i, 1)}
    }
    if(obs.length === 3){
      return (
        <>
        <Text style={styles.detailsText}>{obs[0]}</Text>
        <Text style={styles.detailsText}>{obs[1]}</Text>
        <Text style={styles.detailsText}>{obs[2]}</Text>
        </>
      )
    }else if(obs.length === 2) {
      return (
        <>
        <Text style={styles.detailsText}>{obs[0]}</Text>
        <Text style={styles.detailsText}>{obs[1]}</Text>
        </>
      )
    }else if(obs.length === 1){
      return (
        <Text style={styles.detailsText}>{obs[0]}</Text>
      )
    }else if(obs.length === 0){
      return null;
    }
  }
  

  const renderItem = ({item}) => {
    const splitName = item.name.split(' ')
    const name = item.name.split(' ')[0] + ' ' + splitName[splitName.length - 1];
    return (
      <TouchableOpacity onPress={() => {navigation.navigate('Profile', {_user: item})}} style={styles.nameAndPictureContainer}>
        {showProfilePicture(item, styles.profilePicture)}
        <Text style={styles.profileName}>{name}</Text>
      </TouchableOpacity>
    )
  }

  const SeeAllOrganizers = () => {
    if(organizers.length > 8){
      return(
        <TouchableOpacity onPress={() => navigation.navigate("ListPeople", {people: organizers})} style={styles.seeAllButton}>
          <Text style={styles.buttonText}>VER TODOS</Text>
        </TouchableOpacity>
      )
    }else{
      return null
    }
  } 

  const PartyAbout = () => {
    if(party.about !== null && party.about !== undefined){
      if(party.about.length !== 0){
        return (
          <View style={styles.partyInfoContainer}>
            <Text style={styles.titleOfContainersText}>Sobre</Text>
            <Text style={styles.partyAboutText}>
              {party.about}
            </Text>
          </View>
        )
      }else{
        return null;
      }
    }else{
      return null;
    }
  }

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={styles.scroll}>
      <View style={styles.partyImage}>
        {showPartyBanner(party, styles.imgResize)}
      </View>
      <TouchableOpacity
        underlayColor={highlightOwned}
        onPress={() => navigation.navigate("Checkout", {pid: party.pid})}
        style={styles.purchaseButton}>
        <Text style={styles.purchaseText}>COMPRAR</Text>
      </TouchableOpacity>

      <View style={styles.loteInfoContainer}>
        <Text style={styles.loteText}></Text>
      </View>

      <View style={styles.partyInfoContainer}>
        <Text style={styles.partyTitleText}>{party.name.toUpperCase()}</Text>
        <Text style={styles.partyPriceText}>{party.price != 0 ? `Preço: R$ ${party.price}` : 'Ingressos esgotados'}</Text>
      </View>

      <View style={styles.partyInfoContainer}>
        <Text style={styles.titleOfContainersText}>Detalhes</Text>
        <View style={styles.detailsContainer}>
          <Text>
            <Text style={styles.detailsText}>Data: </Text>
            <Text style={[styles.detailsText, {fontWeight: 'bold'}]}>{party.date}</Text>
          </Text>
          <Text>
            <Text style={styles.detailsText}>Duração: </Text>
            <Text style={[styles.detailsText, {fontWeight: 'bold'}]}>{party.start_time} a {party.end_time}</Text>
          </Text>
          <Observations></Observations>

        </View>
      </View>

      <View style={styles.partyInfoContainer}>
        <Text style={styles.titleOfContainersText}>
          Organizadores
        </Text>
        <View style={styles.organizersContainer}>
          <FlatList
            data={organizers.slice(0, 9)}
            keyExtractor={(item) => item.uid.toString()}
            renderItem={renderItem}
            numColumns={2}
            scrollEnabled={false}
          />

          <SeeAllOrganizers />
        </View>
      </View>

      <View style={styles.partyInfoContainer}>
        <Text style={styles.titleOfContainersText}>
          Localização
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(`geo:${party.latitude},${party.longitude}?q=${party.latitude},${party.longitude}(${party.name})`)} style={styles.localizationMapContainer}>
          <MapView
            style={styles.map}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            initialRegion={position}
          >
            <Marker
              coordinate={position}
            />
          </MapView>
        </TouchableOpacity>
        <Text style={{...styles.defaultText, marginTop: 5, paddingLeft: 3}}>{address}</Text>
      </View>

      <PartyAbout />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: blackOwned,
  },
  header: {
    backgroundColor: redOwned,
    borderBottomWidth: 0,
  },
  scroll: {
    paddingBottom: 10
  },
  partyImage: {
    width: '100%',
    aspectRatio: 90/41,
    overflow: 'hidden',
  },
  imgResize: {
    width: '100%',
    height: undefined,
    aspectRatio: 90/41,
  },
  purchaseButton: {
    position: 'absolute',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: redOwned,
    borderWidth: 2,
    width: 152,
    height: 52,
    borderRadius: 5,
    top: (((Dimensions.get('window').width)/(90/41))-30),
    right: 20,
  },
  loteInfoContainer: {
    height: 22,
    zIndex: 1,
    paddingLeft: 7,
  },
  loteText: {
    paddingTop: 1,
    color: 'white',
  },
  purchaseText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  partyInfoContainer: {
    marginTop: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 7,
    padding: 15,
    borderColor: redOwned,
  },
  partyTitleText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  partyPriceText: {
    color: '#fff',
    fontSize: 19,
  },
  titleOfContainersText: {
    color: 'white',
    fontSize: 18,
  },
  detailsContainer: {
    marginTop: 7,
  },
  detailsText: {
    color: 'white',
    fontSize: 16,
  },
  organizersContainer: {
    marginTop: 5,
  },
  seeAllButton: {
    marginTop: 8,
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: redOwned,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  nameAndPictureContainer: {
    flexDirection: 'row',
    width: '50%',
    marginTop: 4,
    alignItems: 'center',
  },
  profilePicture: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  profileName: {
    color: 'white',
    marginLeft: 5,
    width: '69%',
  },
  map: {
    width: "100%",
    height: "100%",
  },
  localizationMapContainer: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    //borderRadius: 7,
    overflow: 'hidden',
  },
  partyAboutText: {
    marginTop: 10,
    color: 'white',
    fontSize: 15,
    textAlign: 'justify',
  },
  defaultText: {
    color: 'white',
    fontSize: 14,
  },
});