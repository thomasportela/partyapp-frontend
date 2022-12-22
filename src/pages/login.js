import React, { useState } from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/authContext';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import {blackOwned, redOwned, highlightOwned} from '../helper/helper';
import { useEffect } from 'react';

const validationSchema = yup.object({
  email: yup.string().required('Tem que por o e-mail \u{1F611}').email('Olhando bem parece que esse e-mail não é válido \u{1f644}'),
  password: yup.string().required('Tem que por a senha \u{1F611}').min(6, 'Aquela sua senha boa tinha mais de 6 caractéres \u{1f92b}')
})

export default function LoginScreen({navigation}) {
  const {login} = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    console.log(Dimensions.get('window').width)
  }, [])

  async function handleLogin(values) {
    const errorMsg = await login(values);
    if(typeof errorMsg === 'string'){
      setError(errorMsg);
    }
  }

  const ErrorTextEmail = () => {
    if(error === 'Não achamos nem teu e-mail \u{1f937}'){
      return <Text style={styles.errorTextServer}>{error}</Text>
    }else{
      return null
    }
  }

  const ErrorTextPassword = () => {
    if(error === 'A senha não é essa não \u{1f914}'){
      return <Text style={styles.errorTextServer}>{error}</Text>
    }else{
      return null
    }
  }

  return (
    <TouchableWithoutFeedback style={{flex:1}} onPress={Keyboard.dismiss}>
      <View style={styles.mainContainer}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source = {require('../Images/Icons/Iconenobackground.png')} />
        </View>
        <View style={styles.formContainer}>
          <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log('tentei logar')
              handleLogin(values)
              Keyboard.dismiss()
            }}>
            {(props) => (
              <View style={styles.formContainer}>

                <Text style={styles.formText}>
                  <Text style={{color: 'white'}}>E-mail  </Text>
                  <ErrorTextEmail></ErrorTextEmail>
                </Text>

                <TextInput
                  style={styles.inputText}
                  placeholder="Coloque seu e-mail mais legal"
                  placeholderTextColor="grey"
                  onChangeText={props.handleChange('email')}
                  value={props.values.email}
                />

                <Text style={styles.errorText}>{props.touched.email ? props.errors.email : null}</Text>

                <Text style={styles.formText}>
                  <Text style={{color: 'white'}}>Senha  </Text>
                  <ErrorTextPassword></ErrorTextPassword>
                </Text>
                <TextInput
                  style={styles.inputText}
                  placeholder="Coloque aquela senha"
                  placeholderTextColor="grey"
                  onChangeText={props.handleChange('password')}
                  value={props.values.password}
                  secureTextEntry
                />

                <Text style={styles.errorText}>{props.touched.password && props.errors.password}</Text>


                  <TouchableOpacity style={styles.loginButton} onPress={props.handleSubmit}>
                    <Text style={styles.buttonText}>
                      APERTA AÍ PRA LOGAR
                    </Text>
                  </TouchableOpacity>

              </View>
            )}
          </Formik>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.infoText}>Se ainda não tem conta, você pode criar uma:</Text>
          <TouchableOpacity  style={styles.signupButton} onPress={() => {navigation.navigate('SignUp')}}>
            <Text style={styles.buttonText}>REGISTRAR-SE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.forgotPasswordContainer}>
          <Text style={styles.infoText}>Ou se sua memória ja não está tão boa, você pode apertar aqui embaixo:</Text>
          <TouchableOpacity  style={styles.signupButton} onPress={() => {navigation.navigate('ForgotPassword')}}>
            <Text style={styles.buttonText}>ESQUECI MINHA SENHA</Text>
          </TouchableOpacity>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: blackOwned,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 30,
  },
  logo:{
    width: '70%',
    height: undefined,
    aspectRatio: 353/225,
    resizeMode: 'contain',
  },
  formContainer: {
    marginTop: 25,
    width: '100%',
    alignSelf: 'center',
  },
  inputText: {
    color: 'white',
    borderWidth: 1,
    borderColor: redOwned,
    borderRadius: 5,
    width: '89%',
    height: 45,
    marginTop: 3,
    alignSelf: 'center'
  },
  formText: {
    width: '89%',
    color: 'white',
    alignSelf: 'center',
  },
  errorText: {
    color: redOwned,
    height: 17,
    width: '89%',
    alignSelf: 'center'
  },
  errorTextServer: {
    color: redOwned,
  },
  loginButton: {
    backgroundColor: redOwned,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    height: 40,
    width: '89%',
    borderRadius: 5,
    marginTop: 5,
  },
  signupContainer: {
    marginTop: 18,
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: redOwned,
  },
  infoText: {
    color: 'white',
    paddingTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  signupButton: {
    marginTop: 10,
    height: 40,
    width: '89%',
    backgroundColor: redOwned,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
  },
  forgotPasswordContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  }
});
