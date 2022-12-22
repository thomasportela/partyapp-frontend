import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext'
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Modal,
    TouchableWithoutFeedback,
    FlatList,
    TouchableOpacity,
    Dimensions,
    TextInput
} from 'react-native';
import { blackOwned, redOwned, highlightOwned } from '../helper/helper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { searchPeople, searchParties } from '../services/searches'
import showProfilePicture, { showPartyBanner } from '../helper/helperDefaults'

  
const initialLayout = { width: Dimensions.get('window').width };


export default function SearchScreen({route, navigation}) {
    const {doService} = useAuth();
    const [searchText, setSearchText] = useState('');
    const [people, setPeople] = useState([]);
    const [parties, setParties] = useState([]);
    const [notFoundParty, setNotFoundParty] = useState(false);
    const [notFoundPeople, setNotFoundPeople] = useState(false);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'parties', title: 'Festas' },
      { key: 'people', title: 'Pessoas' },
    ]);

    const PeopleRoute = () => (
        <View style={{flex: 1, backgroundColor: blackOwned }} >
            <NotFoundPeople />
            <FlatList
              contentContainerStyle={styles.list}
              data={people}
              keyExtractor={(item) => item.uid.toString()}
              renderItem={renderPeople}
            />
        </View>
    );

    const PartiesRoute = () => (
      <View style={{flex: 1, backgroundColor: blackOwned }} >
          <NotFoundParty />
          <FlatList
            contentContainerStyle={styles.list}
            data={parties}
            keyExtractor={(item) => item.pid.toString()}
            renderItem={renderParties}
          />
      </View>
  );

  async function handleSearch() {
    if(index === 0){
      if(searchText.length === 0){
        setParties([]);
        setNotFoundParty(true);
      }else{
        const response = await doService(() => searchParties(searchText))
        if(response === 404){
          setParties([]);
          setNotFoundParty(true);
        }else{
          setNotFoundParty(false);
          setParties(response.parties);
        }
      }
    }
    if(index === 1){
      if(searchText.length === 0){
        setPeople([]);
        setNotFoundPeople(true);
    }else{
        const response = await doService(() => searchPeople(searchText))
        if(response === 404){
          setPeople([]);
          setNotFoundPeople(true);
        }else{
          setNotFoundPeople(false);
          setPeople(response.users);
        }
      }
    }
  }

    const NotFoundPeople = () => {
      if(notFoundPeople){
        return <Text style={styles.notFoundPeople}>Não encontramos ninguém com essa busca</Text>
      }else{return null}
    }

  const NotFoundParty = () => {
    if(notFoundParty){
      return <Text style={styles.notFoundPeople}>Não encontramos nenhuma festa com essa busca</Text>
    }else{return null}
  }

    const renderTabBar = props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: redOwned }}
          style={styles.tabBar}
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', height: 40}}
        />
      );

    const renderScene = SceneMap({
      parties: PartiesRoute,
      people: PeopleRoute,
    });

    const renderPeople = ({item}) => (
        <TouchableOpacity style={styles.peopleContainer} onPress={() => navigation.navigate('Profile', {_user: item})}>
            <View style={styles.profilePictureContainer}>
              {showProfilePicture(item, styles.profilePicture)}
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )

    const renderParties = ({item}) => (
      <View style={styles.partyContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('PartyDetails', {party: item})
          }
          style={styles.partyButtonImg}>
          {showPartyBanner(item, styles.partyBanner)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('PartyDetails', {party: item})}
          style={styles.partyButtonTitle}>
          <Text style={styles.partyTitleText}>{item.name.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    )

    return(
      <View style={styles.mainContainer}>
        <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Faça sua busca"
              placeholderTextColor="grey"
              onSubmitEditing={handleSearch}
              onChangeText={(text) => setSearchText(text)}
              defaultValue={searchText}
            />
            <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch()} >
              <Icon name="magnify" color={redOwned} size={25} />
            </TouchableOpacity>
        </View>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
        />
      </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    searchContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: blackOwned
    },
    searchInput: {
      paddingLeft: 10,
      width: '85%',
      height: 40,
      color: 'white',
    },
    searchButton: {
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: 10,
      width: '15%',
      height: 40,
    },
    resultsContainer: {
      borderTopWidth: 1,
      borderColor: redOwned
    },
    scene: {
      flex: 1,
    },
    tabBar: {
      backgroundColor: blackOwned,
      borderTopWidth: 1,
      borderColor: redOwned,
    },
    list: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    peopleContainer: {
      width: '97%',
      height: 60,
      flexDirection: 'row',
    },
    profilePictureContainer: {
      width: 60,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    profilePicture: {
        height: 50,
        width: 50,
        resizeMode: 'cover',
        borderRadius: 50,
    },
    nameContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    nameText: {
      color: 'white',
      marginLeft: 10,
    },
    notFoundPeople: {
      color: 'grey',
      width: '100%',
      textAlign: 'center',
      marginTop: 20,
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
      width: Dimensions.get('window').width*0.97,
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