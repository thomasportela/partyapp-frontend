import React from 'react';
import Toast from 'react-native-toast-message';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { redOwned, blackOwned, greenOwned } from '../helper/helper';
import { useAuth } from '../contexts/authContext';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { verifyTicket } from '../services/tickets';
import { useState } from 'react/cjs/react.development';
import showProfilePicture from '../helper/helperDefaults'
import {
  acceptUserInParty,
  removeUserFromParty,
} from '../services/purchases';

export default function TicketsScannerScreen({navigation, route}) {

  const { doService } = useAuth()
  const { pid } = route.params;
  const [modalVisible, setModalVisible] = useState(false)
  const [ticketInQueue, setTicketInQueue] = useState('')
  // const [ticketInQueue, setTicketInQueue] = useState({inside: 0, name: "Cabeçote lendario no RL", uid: 4, url: "https://party-app-profile-pictures.s3.sa-east-1.amazonaws.com/6adc70e4d301e0fd9317f6c8b2aeb4ad4.jpeg"})

  async function handleQRCode(e){
    try{
      const response = await doService(() => verifyTicket(e.data, pid))
      if(response.status === 200){
        console.log(response.data)
        setTicketInQueue(response.data)
        setModalVisible(true)
      }else if(response.status === 400){
        response.data === 'ticketToAnotherParty' ? setTicketInQueue('toAnotherParty') : setTicketInQueue('invalid')
        setModalVisible(true)
      }
    }catch(err){
      console.log(err)
    }
  }

  async function handleAction(){
    try{
      const response = ticketInQueue.inside ? await doService(() => removeUserFromParty(pid, ticketInQueue.uid)) : await doService(() => acceptUserInParty(pid, ticketInQueue.uid))
      console.log(response)
      if(response.status === 201){
        Toast.show({
          type: `${ticketInQueue.inside ? 'error' : 'success'}`,
          position: 'bottom',
          text1: `${ticketInQueue.inside ? 'Saída' : 'Entrada'}`,
          text2: `${ticketInQueue.name} ${ticketInQueue.inside ? 'saiu da' : 'entrou na'} festa`
        });
        setModalVisible(false)
      }
      if(response.status === 400){
        ticketInQueue.inside ? setTicketInQueue('alreadyOut') : setTicketInQueue('alreadyIn')
        setModalVisible(true)
      }
    }catch(err){
      console.log(err)
    }

  }

  const ModalContent = () => {
    console.log(typeof(ticketInQueue))
    if(typeof(ticketInQueue) == 'object'){
      return(
        <View style={styles.modalCenterContainer}>
          <View style={styles.modalTicketInQueueContainer}>
            <View style={ticketInQueue.inside ? {...styles.modalProfilePicture, borderColor: greenOwned} : styles.modalProfilePicture}>
              {showProfilePicture(ticketInQueue, styles.profilePicture)}
            </View>
            <Text style={styles.modalNameText}>{ticketInQueue.name}</Text>
            <TouchableOpacity style={ticketInQueue.inside ? {...styles.modalAcceptButton, backgroundColor: redOwned} : styles.modalAcceptButton} onPress={() => handleAction()}>
              <Text style={styles.modalTextAccept}>LIBERAR {ticketInQueue.inside ? `SAÍDA` : `ENTRADA`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalRejectButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalTextReject}>REJEITAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }else if(ticketInQueue === 'toAnotherParty' || ticketInQueue === 'invalid'){
      return(
        <View style={styles.modalCenterContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalText}>{ticketInQueue === 'toAnotherParty' ? `Esse ingresso é para outra festa` : `Ingresso invalido`}</Text>
            </View>
            <View style={styles.modalButtonsContainer}>
            <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalTextButton}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }else if(ticketInQueue === 'alreadyIn' || 'alreadyOut'){
      return(
        <View style={styles.modalCenterContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalText}>{ticketInQueue === 'alreadyIn' ? `Essa pessoa já está dentro da festa` : `Essa pessoa já está fora da festa`}</Text>
          </View>
          <View style={styles.modalButtonsContainer}>
          <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalTextButton}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      )
    }else{
      return null
    }
  }

    return (
      <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalContent />
      </Modal>
      <QRCodeScanner
        reactivate={true}
        reactivateTimeout={1500}
        onRead={e => handleQRCode(e)}
        topContent={
          <Text style={styles.readTicketText}>
            Respira, calma, buceta
          </Text>
        }
        bottomContent={
          <Text style={styles.readTicketText}>
          </Text>
        }
        topViewStyle={{backgroundColor: 'black', alignItems: 'center'}}
        bottomViewStyle={{backgroundColor: 'black', alignItems: 'center', justifyContent: 'center'}}
      />
      </>
    )
}

const styles = StyleSheet.create({
    readTicketText:{
      color: 'white',
      fontSize: 18,
    },
    modalCenterContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalTicketInQueueContainer: {
      width: '90%',
      height: '70%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: redOwned,
    },
    modalProfilePicture: {
      width: '72%',
      aspectRatio: 1/1,
      borderColor: redOwned,
      borderWidth: 3,
      borderRadius: 500,
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalNameText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'white',
      marginTop: '5%'
    },
    modalAcceptButton: {
      marginTop: '5%',
      width: '90%',
      height: '8%',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'black',
      backgroundColor: greenOwned,
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalTextAccept:{
      fontWeight: 'bold',
      fontSize: 20,
      color: 'black'
    },
    modalRejectButton: {
      marginTop: '5%',
      width: '90%',
      height: '8%',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: redOwned,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalTextReject:{
      fontWeight: 'bold',
      fontSize: 20,
      color: redOwned
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
      width: '100%',
      borderColor: redOwned,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalTextButton: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 15,
    },
    profilePicture: {
      width: '97%',
      aspectRatio: 1/1,
      resizeMode: 'stretch',
      borderRadius: 500,
    },
})