import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { redOwned, blackOwned } from '../helper/helper';
import { useAuth } from '../contexts/authContext';

export default function SettingsScreen({navigation}) {
    const {logout} = useAuth();

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('UserInfo')} style={styles.optionButton}>
                <Text style={styles.optionText}>Sua Info</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} style={styles.optionButton}>
                <Text style={styles.optionText}>Deslogar</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: blackOwned,
    },
    optionButton: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: redOwned,
        justifyContent: 'center',
        height: 50,
    },
    optionText:{
        color: 'white',
        fontSize: 17,
        marginLeft: 18,
    }
})