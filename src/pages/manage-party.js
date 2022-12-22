import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  LogBox,
} from 'react-native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import {redOwned, blackOwned} from '../helper/helper';
import {useAuth} from '../contexts/authContext';
import getOrganizers from '../services/getOrganizers'
import showProfilePicture, { showPartyBanner } from '../helper/helperDefaults'

export default function ManagePartyScreen({route, navigation}) {
  const {party} = route.params;
  const {user, notifications, doService, refreshNotifications} = useAuth();
  const [address, setAddress] = useState('')
  const [organizers, setOrganizers] = useState([])

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  useEffect(() => {
    const componentDidMount = async () => {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${party.latitude},${party.longitude}&key=AIzaSyDTDSBesQCSDBNgPDBdzBZg8ShY7HfzRnQ`)
      setAddress(response.data.results[0].formatted_address)
      const response2 = await doService(() => getOrganizers(party.pid))
      for(var i = response2.length -1; i >= 0; i--){
        if(response2[i].uid === user.uid){
          response2.splice(i, 1);
        }
      }
      setOrganizers(response2)
    }
    componentDidMount()
  }, [])

  async function goBackToRefreshParties() {
    navigation.goBack()
    route.params.refreshParties()
  }

  const position = {
    latitude: party.latitude,
    longitude: party.longitude,
    latitudeDelta: 0.00522,
    longitudeDelta: 0.00422,
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

  const OverviewContent = () => {
    if(party.lotes === 1){
      return(
        <>
        <Text style={styles.defaultTitle}>INGRESSOS</Text>

        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Vendidos (1º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_sold1}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Restantes (1º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_number1 - party.tickets_sold1}</Text>
        </View>

        <View style={styles.defaultLine}>
          <Text style={{...styles.defaultText, fontSize: 16, fontWeight: 'bold'}}>Dinheiro recebido:</Text>
          <Text style={{...styles.defaultText, fontSize: 16, fontWeight: 'bold'}}>R$ {party.money_made}</Text>
        </View>
        </>
      )
    }else if(party.lotes === 2){
      return (
        <>
        <Text style={styles.defaultTitle}>INGRESSOS</Text>

        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Vendidos (1º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_sold1}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Restantes (1º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_number1 - party.tickets_sold1}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Vendidos (2º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_sold2}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Restantes (2º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_number2 - party.tickets_sold2}</Text>
        </View>

        <View style={styles.defaultLine}>
          <Text style={{...styles.defaultText, fontSize: 16, fontWeight: 'bold'}}>Dinheiro recebido:</Text>
          <Text style={{...styles.defaultText, fontSize: 16, fontWeight: 'bold'}}>R$ {party.money_made}</Text>
        </View>
        </>
      )
    }else if(party.lotes === 3){
      return (
        <>
        <Text style={styles.defaultTitle}>INGRESSOS</Text>

        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Vendidos (1º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_sold1}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Restantes (1º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_number1 - party.tickets_sold1}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Vendidos (2º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_sold2}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Restantes (2º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_number2 - party.tickets_sold2}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Vendidos (3º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_sold3}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Restantes (3º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_number3 - party.tickets_sold3}</Text>
        </View>

        <View style={styles.defaultLine}>
          <Text style={{...styles.defaultText, fontSize: 16, fontWeight: 'bold'}}>Dinheiro recebido:</Text>
          <Text style={{...styles.defaultText, fontSize: 16, fontWeight: 'bold'}}>R$ {party.money_made}</Text>
        </View>
        </>
      )
    }else if(party.lotes === 4){
      return (
        <>
        <Text style={styles.defaultTitle}>INGRESSOS</Text>

        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Vendidos (1º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_sold1}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Restantes (1º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_number1 - party.tickets_sold1}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Vendidos (2º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_sold2}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Restantes (2º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_number2 - party.tickets_sold2}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Vendidos (3º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_sold3}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Restantes (3º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_number3 - party.tickets_sold3}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Vendidos (4º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_sold4}</Text>
        </View>
        <View style={styles.defaultLine}>
          <Text style={styles.defaultText}>Restantes (4º lote):</Text>
          <Text style={styles.defaultText}>{party.tickets_number4 - party.tickets_sold4}</Text>
        </View>

        <View style={styles.defaultLine}>
          <Text style={{...styles.defaultText, fontSize: 16, fontWeight: 'bold'}}>Dinheiro recebido:</Text>
          <Text style={{...styles.defaultText, fontSize: 16, fontWeight: 'bold'}}>R$ {party.money_made}</Text>
        </View>
        </>
      )
    }else{
      return null;
    }

  }

  const InfoContent = () => {
    return (
      <>
      <Text style={styles.defaultTitle}>INFO</Text>

      <View style={styles.defaultLine}>
        <Text style={styles.defaultText}>Nome:</Text>
        <Text style={styles.defaultBoldText}>{party.name}</Text>
      </View>
      <View style={styles.defaultLine}>
        <Text style={styles.defaultText}>Data:</Text>
        <Text style={styles.defaultBoldText}>{party.date}</Text>
      </View>
      <View style={styles.defaultLine}>
        <Text style={styles.defaultText}>Horário de início:</Text>
        <Text style={styles.defaultBoldText}>{party.start_time}</Text>
      </View>
      <View style={styles.bannerContainer}>
        {showPartyBanner(party, styles.banner)}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('ModifyParty', {party: party, goBackToRefreshParties})} style={styles.alterButton}>
        <Text style={styles.buttonText}>ALTERTAR</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PartyDetails', {party})} style={styles.alterButton}>
          <Text style={styles.buttonText}>VER PÁGINA DE VENDA</Text>
        </TouchableOpacity>
      </>
    )
  }

  const LocalizationContent = () => {
    return (
      <>
      <Text style={styles.defaultTitle}>LOCALIZAÇÃO</Text>
      <View style={styles.mapContainer}>
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
      </View>
      <Text style={{...styles.defaultText, marginTop: 5, paddingLeft: 3}}>{address}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('ChangeLocation', {party: party, goBackToRefreshParties})} style={styles.alterButton}>
        <Text style={styles.buttonText}>ALTERTAR</Text>
      </TouchableOpacity>
      </>
    )
  }

  const OrganizersContent = () => {
    return(
      <>
      <Text style={styles.defaultTitle}>ORGANIZADORES</Text>
      <FlatList
        data={organizers}
        style={{marginTop: 8}}
        numColumns={2}
        keyExtractor={item => item.uid.toString()}
        renderItem={renderItem}
      />
      <TouchableOpacity onPress={() => navigation.navigate('ChangeOrganizers', {_organizers: organizers, pid: party.pid, goBackToRefreshParties})} style={styles.alterButton}>
      {/* <TouchableOpacity onPress={() => console.log(organizers)} style={styles.alterButton}> */}
        <Text style={styles.buttonText}>ALTERTAR</Text>
      </TouchableOpacity>
      </>
    )
  }

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={{alignItems: 'center', paddingBottom: 5,}}>

      <View style={styles.defaultContainer}> 
        <InfoContent />
      </View>

      <View style={styles.defaultContainer}>
        <LocalizationContent />
      </View>

      <View style={styles.defaultContainer}>
        <OrganizersContent />
      </View>

      <View style={styles.defaultContainer}>
        <OverviewContent />
        <TouchableOpacity onPress={() => navigation.navigate('BuyersAndTickets', {pid: party.pid})} style={styles.alterButton}>
          <Text style={styles.buttonText}>COMPRADORES & INGRESSOS</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: blackOwned,
  },
  defaultContainer: {
    marginTop: 7,
    width: '97%',
    paddingHorizontal: '3%',
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: redOwned,
    borderRadius: 6,
  },
  defaultTitle: {
    marginTop: 8,
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  defaultLine: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  defaultText: {
    color: 'white',
    fontSize: 14,
  },
  defaultBoldText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bannerContainer: {
    marginTop: 5,
    width: '100%',
    aspectRatio: 90/41,
    borderColor: redOwned,
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    height: undefined,
    aspectRatio: 90/41,
  },
  alterButton: {
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
  mapContainer: {
    marginTop: 5,
    alignSelf: 'center',
    width: '99%',
    aspectRatio: 90/41,
    borderColor: 'white',
    borderWidth: 1,
    overflow: 'hidden',
  },
  map: {
    width: "100%",
    height: "100%",
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
});