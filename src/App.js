import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import './config/statusBarConfig';
import Routes from './routes'
import { AuthProvider, useAuth } from './contexts/authContext'
import { CreatePartyProvider } from './contexts/createPartyContext'
import Toast, { BaseToast } from 'react-native-toast-message';
import { redOwned, greenOwned } from './helper/helper';

const toastConfig = {
  success: ({ text1, text2, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: greenOwned, backgroundColor: 'black' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        color: 'white',
        fontSize: 16,
      }}
      text2Style={{
        color: 'white',
        fontSize: 14,
      }}
      text1={text1}
      text2={text2}
    />
  ),
  error: ({ text1, text2, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: redOwned, backgroundColor: 'black' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        color: 'white',
        fontSize: 16,
      }}
      text2Style={{
        color: 'white',
        fontSize: 14,
      }}
      text1={text1}
      text2={text2}
    />
  ),
};


const App = () => {
    return (
      <>
      <NavigationContainer>
      <AuthProvider>
      <CreatePartyProvider>
        <Routes/>
      </CreatePartyProvider>
      </AuthProvider>
      </NavigationContainer>
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
      </>
    );
};

export default App;