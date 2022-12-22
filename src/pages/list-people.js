import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput
} from 'react-native';
import { blackOwned, redOwned, highlightOwned } from '../helper/helper';
import showProfilePicture from '../helper/helperDefaults'

export default function ListPeopleScreen({route, navigation}){

  const { people } = route.params;

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

  return(
    <View style={styles.mainContainer}>
      <FlatList
        contentContainerStyle={styles.list}
        data={people}
        keyExtractor={(item) => item.uid.toString()}
        renderItem={renderPeople}
      />
    </View>
  )

}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: blackOwned,
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
})