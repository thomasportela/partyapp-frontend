import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TextInputMask } from 'react-native-masked-text'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableHighlight,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import { blackOwned, redOwned, highlightOwned } from '../helper/helper';
import { TextInput } from 'react-native-gesture-handler';
import sendCode from '../services/sendCode'

let cpfInput;
let birthDateInput;
let phoneInput;

yup.addMethod(yup.string, 'cpf', function(){
  return this.test({name: 'cpf',exclusive: true, message: 'CPF falso não vai rolar...', test: function(){
    if(cpfInput.isValid()){
      return true
    }else{
      return false
    }
  }})
})

yup.addMethod(yup.string, 'birthDate', function(){
  return this.test({name: 'birthDate',exclusive: true, message: 'Acho que errou a data', test: function(){
    if(birthDateInput.props.value.length > 9){
      if(birthDateInput.isValid()){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }})
})

const validationSchema = yup.object({
  name: yup.string().required('Sem nome é complicado'),
  email: yup.string().required('Tem que por o email').email('E-mail inválido não vai dar...'),
  phone: yup.string().required('Tem que por o número').min(19, 'Número ta errado'),
  gender: yup.string(),
  cpf: yup.string().required('Digite seu CPF').cpf(),
  birthDate : yup.string().required('Nasceu quando?').birthDate(),
  password: yup.string().required('Digite uma senha boa').min(6, 'Tem que ter pelo menos 6 caracteres'),
  password2: yup.string().required('Tem que repetir a senha').min(6, 'Tem que ter pelo menos 6 caracteres'),
})


export default function SingUpScreen({navigation}) {

  const [modalVisible, setModalVisible] = useState(false)
  const [gender, setGender] = useState('')
  const [verifyGender, setVerifyGender] = useState(false)
  const [samePassword, setSamePassword] = useState(true)
  const [emailExists, setEmailExists] = useState(false)
  const [phoneExists, setPhoneExists] = useState(false)
  const [cpfExists, setCpfExists] = useState(false)

  const initialValues = {
    name: '',
    email: '',
    phone: '+55',
    gender: '',
    cpf: '',
    birthDate: '',
    password: '',
    password2: '',
  }

  const PasswordError = (props) => {
    if(samePassword){
      return <Text style={styles.formErrorText}>{props.touched.password && props.errors.password}</Text>
    }else if(samePassword === false){
      return <Text style={styles.formErrorText}>As senhas não estão iguais</Text>
    }
  }

  const EmailError = (props) => {
    if(emailExists){
      return <Text style={styles.formErrorText}>Já temos uma conta com esse E-mail</Text>
    }else{
      return <Text style={styles.formErrorText}>{props.touched.email && props.errors.email}</Text>
    }
  }

  const PhoneError = (props) => {
    if(phoneExists){
      return <Text style={styles.formErrorText}>Já temos uma conta com esse número</Text>
    }else{
      return <Text style={styles.formErrorText}>{props.touched.phone && props.errors.phone}</Text>
    }
  }

  const CpfError = (props) => {
    if(cpfExists){
      return <Text style={styles.formErrorText}>Já temos uma conta com esse CPF</Text>
    }else{
      return <Text style={styles.formErrorText}>{props.touched.cpf && props.errors.cpf}</Text>
    }
  }

  const Gender = () => {
    if(gender.length === 0){
        return <Text style={styles.genderText}>-</Text>
    }else if(gender === 'M'){
        return <Text style={styles.genderText}>Masculino</Text>
    }else if(gender === 'F'){
        return <Text style={styles.genderText}>Feminino</Text>
    }else if(gender === 'N'){
        return <Text style={styles.genderText}>Não-binário</Text>
    }
  }

  const GenderError = () => {
    if(verifyGender){
      if(gender.length === 0){
        return <Text style={styles.formErrorText}>Escolha seu gênero</Text>
      }else{
        return null;
      }
    }else{
      return null;
    }
  }


  const verifyPassword = (p1, p2) => {
    return p1 === p2 ? true : false
  }

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={{paddingBottom: 10}}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalCenterContainer}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                  style={styles.genderModalButton}
                  onPress={() => {
                      setGender('M')
                      setModalVisible(false)
                  }}>
                <Text style={styles.genderModalText}>Masculino</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.genderModalButton,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: redOwned,
                }}
                onPress={() => {
                  setGender('F');
                  setModalVisible(false);
                }}>
                <Text style={styles.genderModalText}>Feminino</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={styles.genderModalButton}
                  onPress={() => {
                      setGender('N')
                      setModalVisible(false)
                  }}>
                <Text style={styles.genderModalText}>Não-binário</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          values.gender = gender
          if(values.gender.length != 0){
            if(verifyPassword(values.password, values.password2)){
              setSamePassword(true)
              const rawPhone = `+${phoneInput.getRawValue()}`
              const response = await sendCode(rawPhone, values.email, values.cpf)
              console.log(response)
              if(response === 'email'){
                setEmailExists(true)
                setPhoneExists(false)
                setCpfExists(false)
              }
              if(response === 'phone'){
                setEmailExists(false)
                setPhoneExists(true)
                setCpfExists(false)
              }
              if(response === 'cpf'){
                setEmailExists(false)
                setPhoneExists(false)
                setCpfExists(true)
              }
              response === 200 && navigation.navigate('CodeVerification', {user: {...values, phone: rawPhone}})
            }else{
              setSamePassword(false)
            }
          }
        }}>
        {(props) => (
          <View style={styles.formContainer}>
            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>Nome </Text>
              <Text style={styles.formErrorText}>{props.touched.name && props.errors.name}</Text>
            </Text>
            <TextInput
              style={styles.formTextInput}
              onChangeText={props.handleChange('name')}
              value={props.values.name}
            />

            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>E-mail </Text>
              <EmailError touched={props.touched} errors={props.errors}/>
            </Text>
            <TextInput
              style={styles.formTextInput}
              onChangeText={props.handleChange('email')}
              value={props.values.email}
            />

            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>Número do celular </Text>
              <PhoneError touched={props.touched} errors={props.errors}/>
            </Text>
            <TextInputMask
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '+99 (99) '
              }}
              style={styles.formTextInput}
              onChangeText={props.handleChange('phone')}
              value={props.values.phone}
              ref={(ref) => phoneInput = ref}
              keyboardType='numeric'
            />

            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>CPF </Text>
              <CpfError touched={props.touched} errors={props.errors}/>
            </Text>
            <TextInputMask
              type={'cpf'}
              style={styles.formTextInput}
              onChangeText={props.handleChange('cpf')}
              value={props.values.cpf}
              keyboardType='numeric'
              ref={(ref) => {cpfInput = ref}}
            />

            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>Gênero </Text>
              <GenderError />
            </Text>
            <TouchableOpacity
              style={styles.genderButton}
              onPress={() => setModalVisible(true)}>
              <Gender />
            </TouchableOpacity>

            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>Data de nascimento </Text>
              <Text style={styles.formErrorText}>{props.touched.birthDate && props.errors.birthDate}</Text>
            </Text>
            <TextInputMask
              type={'datetime'}
              options={{format: 'DD/MM/YYYY'}}
              style={styles.formTextInput}
              onChangeText={props.handleChange('birthDate')}
              value={props.values.birthDate}
              ref={(ref) => {birthDateInput = ref}}
              keyboardType='number-pad'
            />

            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>Senha </Text>
              <PasswordError touched={props.touched} errors={props.errors} />
            </Text>
            <TextInput
              style={styles.formTextInput}
              onChangeText={props.handleChange('password')}
              value={props.values.password}
              secureTextEntry
            />

            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>Repita a senha </Text>
              <Text style={styles.formErrorText}>{props.touched.password2 && props.errors.password2}</Text>
            </Text>
            <TextInput
              style={styles.formTextInput}
              onChangeText={props.handleChange('password2')}
              value={props.values.password2}
              secureTextEntry
            />

            <TouchableHighlight
              underlayColor={highlightOwned}
              style={styles.submitButton}
              onPress={() => {
                props.handleSubmit()
                setVerifyGender(true)
              }}>
              <Text style={styles.submitText}>É ISSO!</Text>
            </TouchableHighlight>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: blackOwned,
    },
    modalCenterContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'black',
        width: 250,
        height: 150,
        borderWidth: 1,
        borderColor: redOwned,
        borderRadius: 15,
        overflow: 'hidden',
    },
    genderModalButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '33.3%',
    },
    genderModalText: {
        color: 'white',
        fontSize: 20
    },
    formContainer: {
        alignItems: 'center'
    },
    formTextBlock: {
        marginTop: 5,
        width: '96%',
        color: 'white',
    },
    formText: {
        color: 'white',
    },
    formTextInput: {
        marginTop: 3,
        width: '97%',
        height: 40,
        color: 'white',
        paddingLeft: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: redOwned
    },
    formErrorText: {
        color: redOwned,
        width: '96%',
    },
    submitButton: {
        marginTop: 8,
        backgroundColor: redOwned,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'black',
        width: '97%',
        height: 40,
        borderRadius: 5,
      },
      submitText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 17,
      },
      genderButton: {
        marginTop: 3,
        width: '97%',
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: redOwned,
        justifyContent: 'center',
      },
      genderText: {
        color: 'white',
        paddingLeft: 10,
      }
})