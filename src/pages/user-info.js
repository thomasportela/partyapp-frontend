import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { redOwned, blackOwned } from '../helper/helper';
import { useAuth } from '../contexts/authContext';

export default function UserInfoScreen({navigation}) {
    const {logout, user} = useAuth();

    const getGender = () => {
      if(user.gender === 'M'){
        return 'Masculino'
      }else if(user.gender === 'F'){
        return 'Feminino'
      }else if(user.gender === 'N'){
        return 'Não-binário'
      }
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.option}>
                <Text style={styles.optionTitleText}>Nome</Text>
                <Text style={styles.optionText}>{user.name}</Text>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionTitleText}>E-mail</Text>
                <Text style={styles.optionText}>{user.email}</Text>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionTitleText}>Número do celular</Text>
                <Text style={styles.optionText}>{user.phone}</Text>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionTitleText}>CPF</Text>
                <Text style={styles.optionText}>{user.cpf}</Text>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionTitleText}>Gênero</Text>
                <Text style={styles.optionText}>{getGender()}</Text>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionTitleText}>Data de nascimento</Text>
                <Text style={styles.optionText}>{user.birthDate}</Text>
            </View>
            <View style={{...styles.option, flexDirection: 'row'}}>
              <View style={{height: '100%', width: '80%', justifyContent: 'center'}}>
                <Text style={{...styles.optionTitleText, marginLeft: '5.8%'}}>Senha</Text>
                <Text style={{...styles.optionText, marginLeft: '5.8%'}}>***********</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')} style={styles.alterButton}>
                <Text style={styles.alterText}>Alterar</Text>
              </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: blackOwned,
    },
    option: {
      width: '100%',
      borderBottomWidth: 0.8,
      borderBottomColor: redOwned,
      justifyContent: 'center',
      height: 50,
    },
    optionTitleText:{
      color: 'white',
      fontSize: 16,
      marginLeft: '4.5%',
      fontWeight: 'bold',
    },
    optionText:{
      color: 'white',
      fontSize: 14,
      marginLeft: '4.5%',
    },
    alterButton:{
      height: '100%',
      width: '20%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    alterText:{
      color: redOwned,
      fontSize: 14,
      textDecorationLine: 'underline',
    }
})