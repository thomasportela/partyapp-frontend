import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { redOwned, blackOwned } from '../helper/helper';
import { useAuth } from '../contexts/authContext';

export default function BuyersAndTicketsScreen({navigation, route}) {

  const { pid } = route.params;

    return (
        <View style={styles.mainContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ListPeopleFromParty', {pid, inside: false})} style={styles.optionButton}>
            <Text style={styles.optionText}>FORA DA FESTA</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ListPeopleFromParty', {pid, inside: true})} style={styles.optionButton}>
            <Text style={styles.optionText}>DENTRO DA FESTA</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('TicketsScanner', {pid})} style={styles.optionButton}>
            <Text style={styles.optionText}>LER INGRESSOS</Text>
          </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: blackOwned,
      alignItems: 'center',
      justifyContent: 'space-evenly'
    },
    optionButton: {
      width: '80%',
      height: 40,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: redOwned,
    },
    optionText:{
      color: 'black',
      fontWeight: 'bold',
      fontSize: 18,
    }
})