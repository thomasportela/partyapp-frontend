import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { redOwned, blackOwned } from '../helper/helper';
import { useAuth } from '../contexts/authContext';
import { WebView } from 'react-native-webview';
import { purchaseTicket } from '../services/purchases';

export default function CheckoutScreen({navigation, route}) {

  const {doService} = useAuth()
  const {pid} = route.params
  const [paymentUrl, setPaymentUrl] = useState(null)

  useEffect(() => {
    getPaymentUrl()
  }, [])
  
  async function getPaymentUrl(){
    const response = await doService(() => purchaseTicket(pid))
    if(response.status === 201){
      setPaymentUrl(response.data)
    }else if(response.status === 400 && response.data === 'owner'){
      console.log('vc é o dono da festa porra')
    }else if(response.status === 400 && response.data === 'alreadyPurchased'){
      console.log('vc ja tem porra')
    }
  }

  function onChangeState(state){
    console.log(state)
    if(state.canGoBack == true && !state.url.includes('mercadopago')){
      if(state.url.includes('approved')){
        navigation.goBack()
      }else{
        navigation.navigate('Home')
      }
    }
  }

  return(
    <View style={styles.mainContainer}>
      {paymentUrl &&
        <WebView 
          source={{ uri: paymentUrl }} 
          style={styles.webView}
          startInLoadingState={true}
          // onNavigationStateChange={state => onChangeState(state)}
        />
      }
    </View>

    
  )
}

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: blackOwned
    },
    webView:{
      flex: 1
    }
})