import React, { useEffect, useState } from 'react';
import { fetchPartiesData } from '../services/getPartiesData'
import { useAuth } from '../contexts/authContext'
import { useCreateParty } from '../contexts/createPartyContext'
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { redOwned, blackOwned } from '../helper/helper'
import { showPartyBanner } from '../helper/helperDefaults'

export default function HomeScreen({ navigation }){

  const {doService} = useAuth()
  const {partyCreated} = useCreateParty()

  const [parties, setParties] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  useEffect (() => {
    refreshParties()
  }, [])

  async function refreshParties(){
    setRefreshing(true)
    try{
      const response = await doService(fetchPartiesData)
      setParties(response)
      setRefreshing(false)
    }catch(err){
      console.log(err)
      setRefreshing(false)
    }
  }

  const renderItem = ({item}) => (
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
  );

  return (
    <View style={styles.mainContainer}>
      <FlatList
        contentContainerStyle={styles.list}
        numColumns={1}
        data={parties}
        keyExtractor={(item) => item.pid.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl colors={[redOwned]} progressBackgroundColor={'black'} refreshing={refreshing} onRefresh={refreshParties} />}
      />
    </View>
  );
  
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: blackOwned,
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
});