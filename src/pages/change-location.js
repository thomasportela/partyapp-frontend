import React, {useState, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import { useAuth } from '../contexts/authContext'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import {blackOwned, redOwned, highlightOwned} from '../helper/helper';
import { updateParty } from '../services/createParty'

export default function ChangeLocationScreen({route, navigation}) {
  const {party} = route.params;

  const {doService} = useAuth()
  const [lat, setLat] = useState(party.latitude);
  const [lng, setLng] = useState(party.longitude);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const componentDidMount = async () => {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${party.latitude},${party.longitude}&key=AIzaSyDTDSBesQCSDBNgPDBdzBZg8ShY7HfzRnQ`)
      setAddress(response.data.results[0].formatted_address)
    }
    componentDidMount()
  }, [])

  function position() {
    if(lat === null || lng === null){
      const position = {
        latitude: defaultLat,
        longitude: defaultLng,
        latitudeDelta: 0.00322,
        longitudeDelta: 0.00222,
      }
      return position
    }else{
      const position = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.00322,
        longitudeDelta: 0.00222,
      }
      return position
    }
  };

  async function setAddressByTouch(latitude, longitude){
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDTDSBesQCSDBNgPDBdzBZg8ShY7HfzRnQ`)
    console.log(response)
    setAddress(response.data.results[0].formatted_address)
  }

  function setAddressByPlaces(address) {
    setAddress(address)
  }

  const LocationMarker = () => {
    if(lat === null || lng === null){
      return null
    }else{
      return (
        <Marker
          onDragEnd={(e) => {
            setLat(e.nativeEvent.coordinate.latitude);
            setLng(e.nativeEvent.coordinate.longitude);
            setAddressByTouch(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
          }}
          coordinate={position()}
          draggable
        />
      );
    }
  }

  function goBack() {
    navigation.goBack()
    route.params.goBackToRefreshParties()
  }

  const SubmitContainer = () => {
    if(lat === null || lng === null){
      return null
    }else{
      return (
        <View style={styles.submitContainer}>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{address}</Text>
          </View>

          <TouchableHighlight
            underlayColor={highlightOwned}
            style={styles.submitButton}
            onPress={async () => {
              console.log('lat', lat, 'lng', lng)
              const changes = {lat, lng}
              try {
                const response = await doService(() => updateParty(changes, party.pid))
                console.log(response)
                if(response === 201){
                  goBack()
                }
              }catch(err) {
                console.log(err)
              }
            }}
          >
            <Text style={styles.buttonText}>É ESSE!</Text>
          </TouchableHighlight>

        </View>
      )
    }
  }




  return (
    <View style={styles.mainContainer}>
      <MapView
        style={styles.map}
        customMapStyle={mapStyle}
        liteMode={false}
        onPress={(e) => {
          console.log(e.nativeEvent)
          setLat(e.nativeEvent.coordinate.latitude);
          setLng(e.nativeEvent.coordinate.longitude);
          setAddressByTouch(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
        }}
        region={position()}>
        <LocationMarker />
      </MapView>

      <GooglePlacesAutocomplete
        placeholder='Escolha a localização da sua festa'
        enableHighAccuracyLocation={true}
        enablePoweredByContainer={false}
        fetchDetails={true}
        returnKeyType={'search'}
        autoFillOnNotFound={true}
        onPress={(data, details = null) => {
          setLat(details.geometry.location.lat);
          setLng(details.geometry.location.lng);
          setAddressByPlaces(data.description)
        }}
        styles={{
          container: {
            position: 'absolute',
            top: 50,
            width: '95%',
            zIndex: 100,
          },
          textInput:{
            backgroundColor: 'black',
            color: 'white',
            borderWidth: 1,
            borderColor: redOwned
          },
          row: {
            backgroundColor: 'black',
          },
          listView: {
            backgroundColor: 'black',
            color: 'white'
          },
          description: {
            color: 'white'
          }
        }}
        onFail={error => console.log(error)}
        query={{
          key: 'AIzaSyDTDSBesQCSDBNgPDBdzBZg8ShY7HfzRnQ',
          language: 'pt-BR',
        }}
      />

      <SubmitContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: blackOwned
  },
  map: {
    width: '100%',
    height: '100%',
  },
  submitContainer: {
    position: 'absolute',
    zIndex: 100,
    width: '95%',
    height: 120,
    borderWidth: 1,
    bottom: 40,
    borderColor: redOwned,
    backgroundColor: 'black',
    borderRadius: 5,
    alignItems: 'center',
  },
  addressContainer: {
    width: '100%',
    height: '65%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressText: {
    color: 'white',
    fontSize: 15,
    width: '80%',
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
    height: '35%',
    backgroundColor: redOwned,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  },
})


const mapStyle = [
  {
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "elementType": "labels.text",
    "stylers": [
      {
        "color": "#863104"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#802d2d"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8d3434"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e4747"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8d3434"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#212121"
      },
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c4c4c4"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.attraction",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b1aaaa"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b1aaaa"
      }
    ]
  },
  {
    "featureType": "poi.government",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b1aaaa"
      }
    ]
  },
  {
    "featureType": "poi.medical",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b1aaaa"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#cac4c4"
      }
    ]
  },
  {
    "featureType": "poi.place_of_worship",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.school",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdb7b7"
      }
    ]
  },
  {
    "featureType": "poi.sports_complex",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#cac4c4"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b1aaaa"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b1aaaa"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#b1aaaa"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#0f0f0f"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b1aaaa"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]