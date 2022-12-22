import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/authContext'
import { useCreateParty } from '../contexts/createPartyContext'
import { TextInputMask } from 'react-native-masked-text'
import ImagePicker from 'react-native-image-crop-picker'
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
    Dimensions,
    LogBox,
} from 'react-native';
import { blackOwned, redOwned, highlightOwned } from '../helper/helper';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { uploadPartyBanner, updateParty } from '../services/createParty'
import { showPartyBanner } from '../helper/helperDefaults'

var mDateInput, mChangeDate1Input, mChangeDate2Input, mChangeDate3Input;

yup.addMethod(yup.string, '_date', function(){
  return this.test({name: '_date',exclusive: false, message: 'Acho que errou a data', test: function(value){
    if(mDateInput.props.value.length > 4 && mDateInput.isValid()){
      return true
    }else{
      return false
    }
  }})
})

yup.addMethod(yup.string, '_date1', function(){
  return this.test({name: '_date1',exclusive: false, message: 'Data errada', test: function(value){
    if(mChangeDate1Input.props.value.length > 4 && mChangeDate1Input.isValid()){
      return true
    }else{
      return false
    }
  }})
})

yup.addMethod(yup.string, '_date2', function(){
  return this.test({name: '_date2',exclusive: false, message: 'Data errada', test: function(value){
    if(mChangeDate2Input.props.value.length > 4 && mChangeDate2Input.isValid()){
      return true
    }else{
      return false
    }
  }})
})

yup.addMethod(yup.string, '_date3', function(){
  return this.test({name: '_date3',exclusive: false, message: 'Data errada', test: function(value){
    if(mChangeDate3Input.props.value.length > 4 && mChangeDate3Input.isValid()){
      return true
    }else{
      return false
    }
  }})
})

export default function ModifyPartyScreen({route, navigation}) {

  const {party} = route.params;

  const {user, doService} = useAuth()
  const {stopCreatingParty, tryingCancel , setTryingCancel, setPartyUpdated} = useCreateParty()
  const [loteModalVisible, setLoteModalVisible] = useState(false)
  const [changeLoteModalVisible, setChangeLoteModalVisible] = useState(false)
  const [bannerModalVisible, setBannerModalVisible] = useState(false)
  const [banner, setBanner] = useState({uri: party.url})
  const [changeLoteByDate, setChangeLoteByDate] = useState(party.changeLoteByDate)
  var obsnumber = 0
  party.obs1 && obsnumber++
  party.obs2 && obsnumber++
  party.obs3 && obsnumber++
  const [obsNumber, setObsNumber] = useState(obsnumber)
  const [obs1, setObs1] = useState(party.obs1 ? party.obs1 : '')
  const [obs2, setObs2] = useState(party.obs2 ? party.obs2 : '')
  const [obs3, setObs3] = useState(party.obs3 ? party.obs3 : '')
  const [lotes, setLotes] = useState(party.lotes)

  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

  const loteRules = (yup) => {
    if(lotes === 2){
      return {
        price2: yup.string().required('Ta vazio').price(),
        tickets_number2: yup.number().typeError('Número né').required('Faltando aqui').integer('Inteiro plz').positive('Positivo plz'),
      }
    }
    if(lotes === 3){
      return {
        price2: yup.string().required('Ta vazio').price(),
        tickets_number2: yup.number().typeError('Número né').required('Faltando aqui').integer('Inteiro plz').positive('Positivo plz'),
        price3: yup.string().required('Ta vazio').price(),
        tickets_number3: yup.number().typeError('Número né').required('Faltando aqui').integer('Inteiro plz').positive('Positivo plz'),
      }
    }
    if(lotes === 4){
      return {
        price2: yup.string().required('Ta vazio').price(),
        tickets_number2: yup.number().typeError('Número né').required('Faltando aqui').integer('Inteiro plz').positive('Positivo plz'),
        price3: yup.string().required('Ta vazio').price(),
        tickets_number3: yup.number().typeError('Número né').required('Faltando aqui').integer('Inteiro plz').positive('Positivo plz'),
        price4: yup.string().required('Ta vazio').price(),
        tickets_number4: yup.number().typeError('Número né').required('Faltando aqui').integer('Inteiro plz').positive('Positivo plz'),
      }
    }
  }

  const changeLoteRules = (yup) => {
    if(lotes === 2 && changeLoteByDate){
      return {
        change_lote_date1: yup.string().required('Data vazia')._date1(),
        change_lote_time1: yup.string().required('Hora vazia').time(),
      }
    }
    if(lotes === 3 && changeLoteByDate){
      return {
        change_lote_date1: yup.string().required('Data vazia')._date1(),
        change_lote_time1: yup.string().required('Hora vazia').time(),
        change_lote_date2: yup.string().required('Data vazia')._date2(),
        change_lote_time2: yup.string().required('Hora vazia').time(),
      }
    }
    if(lotes === 4 && changeLoteByDate){
      return {
        change_lote_date1: yup.string().required('Data vazia')._date1(),
        change_lote_time1: yup.string().required('Hora vazia').time(),
        change_lote_date2: yup.string().required('Data vazia')._date2(),
        change_lote_time2: yup.string().required('Hora vazia').time(),
        change_lote_date3: yup.string().required('Data vazia')._date3(),
        change_lote_time3: yup.string().required('Hora vazia').time(),
      }
    }
  }

  const validationSchema = yup.object({
    name: yup.string().required('Sem nome é complicado').max(27, 'Muito grande'),
    date: yup.string().required('Tem que por a data da festa')._date(),
    start_time: yup.string().required('Hora do início').time(),
    end_time: yup.string().required('Hora do término').time(),
    price1: yup.string().required('Ta vazio').price(),
    tickets_number1: yup.number().typeError('Número né').required('Faltando aqui').integer('Inteiro plz').positive('Positivo plz'),
    ...loteRules(yup),
    ...changeLoteRules(yup)
  }).nullable()

  const initialValues = {
    name: party.name,
    date: party.date,
    start_time: party.start_time,
    end_time: party.end_time,
    about: party.about,
    price1: party.price1.toString(),
    tickets_number1: party.tickets_number1.toString(),
    price2: party.price2 ? party.price2.toString(): null,
    tickets_number2: party.tickets_number2 ? party.tickets_number2.toString(): null,
    price3: party.price3 ? party.price3.toString(): null,
    tickets_number3: party.tickets_number3 ? party.tickets_number3.toString(): null,
    price4: party.price4 ? party.price4.toString(): null,
    tickets_number4: party.tickets_number4 ? party.tickets_number4.toString(): null,
    change_lote_date1: party.change_lote_date1,
    change_lote_time1: party.change_lote_time1,
    change_lote_date2: party.change_lote_date2,
    change_lote_time2: party.change_lote_time2,
    change_lote_date3: party.change_lote_date3,
    change_lote_time3: party.change_lote_time3,
  }

  const AddObs = () => {
    if(obsNumber === 3){
      return null
    }else{
      return (
        <TouchableOpacity
          style={{...styles.inputButton, alignItems: 'center', justifyContent: 'center'}}
          onPress={() => {
            obsNumber < 3 && setObsNumber(obsNumber + 1)
          }}
        >
          <Icon name="plus" color={redOwned} size={30} />
        </TouchableOpacity>
      )
    }
  }

  const Obs1 = () => {
    if(obsNumber >= 1){
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={{...styles.formTextInput, width: '86%',}}
            onEndEditing={e => setObs1(e.nativeEvent.text)}
            defaultValue={obs1}
            maxLength={32}
            placeholder='Ex: Open bar'
            placeholderTextColor='grey'
          />
          <TouchableOpacity
            style={styles.removeObsButton}
            onPress={() => {
              if(obsNumber === 3){
                setObs1(obs2)
                setObs2(obs3)
                setObs3('')
              }
              if(obsNumber === 2){
                setObs1(obs2)
                setObs2('')
              }
              obsNumber === 1 && setObs1('')
              setObsNumber(obsNumber - 1)
            }}
          >
            <Icon name="close" color={redOwned} size={25} />
          </TouchableOpacity>
        </View>
      )
    }else{return null}
  }

  const Obs2 = () => {
    if(obsNumber >= 2){
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={{...styles.formTextInput, width: '86%',}}
            onEndEditing={e => setObs2(e.nativeEvent.text)}
            defaultValue={obs2}
            maxLength={32}
            placeholder='Ex: Levar copo ou caneca'
            placeholderTextColor='grey'
          />
          <TouchableOpacity
            style={styles.removeObsButton}
            onPress={() => {
              if(obsNumber === 3){
                setObs2(obs3)
                setObs3('')
              }
              obsNumber === 2 && setObs2('')
              setObsNumber(obsNumber - 1)
            }}
          >
            <Icon name="close" color={redOwned} size={25} />
          </TouchableOpacity>
        </View>
      )
    }else{return null}
  }

  const Obs3 = () => {
    if(obsNumber === 3){
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={{...styles.formTextInput, width: '86%',}}
            onEndEditing={e => setObs3(e.nativeEvent.text)}
            defaultValue={obs3}
            maxLength={32}
            placeholder='Ex: Levar 1 kg de alimento'
            placeholderTextColor='grey'
          />
          <TouchableOpacity
            style={styles.removeObsButton}
            onPress={() => {
              obsNumber === 3 && setObs3('')
              setObsNumber(obsNumber - 1)
            }}
          >
            <Icon name="close" color={redOwned} size={25} />
          </TouchableOpacity>
        </View>
      )
    }else{return null}
  }

  const Lotes = () => {
    if(lotes === 1) return <Text style={styles.touchableText}>Não</Text>
    if(lotes === 2) return <Text style={styles.touchableText}>Sim, 2 lotes</Text>
    if(lotes === 3) return <Text style={styles.touchableText}>Sim, 3 lotes</Text>
    if(lotes === 4) return <Text style={styles.touchableText}>Sim, 4 lotes</Text>
  }

  function taxedPrice(price){
    if(price === undefined || price === null || price.length === 0){return ''}
    else{
      const taxedPrice = parseFloat(price.replace(',', '.')) * 0.9;
      return taxedPrice.toFixed(2).toString().replace('.',',')
    }
  }

  const Prices = (props) => {
    if(lotes === 1){
      return (
        <>
          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Preço  </Text>
                <Text style={styles.formErrorText}>{props.touched.price1 && props.errors.price1}</Text>
              </Text>
              <TextInput
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('price1')}
                value={props.values.price1}
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Você recebe (Reais)  </Text>
              </Text>
              <TextInput
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                value={taxedPrice(props.values.price1)}
                editable={false}
              />
            </View>
          </View> 
          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Quantidade de ingressos  </Text>
            <Text style={styles.formErrorText}>{props.touched.tickets_number1 && props.errors.tickets_number1}</Text>
          </Text>
          <TextInput
            style={styles.formTextInput}
            onChangeText={props.handleChange('tickets_number1')}
            value={props.values.tickets_number1}
            keyboardType='number-pad'
          />
        </>
      )
    }

    if(lotes === 2){
      return (
        <>
          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Preço do 1º lote  </Text>
                <Text style={styles.formErrorText}>{props.touched.price1 && props.errors.price1}</Text>
              </Text>
              <TextInput
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('price1')}
                value={props.values.price1}
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Você recebe (Reais)  </Text>
              </Text>
              <TextInput
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                value={taxedPrice(props.values.price1)}
                editable={false}
              />
            </View>
          </View>
          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Quantidade de ingressos do 1º lote  </Text>
            <Text style={styles.formErrorText}>{props.touched.tickets_number1 && props.errors.tickets_number1}</Text>
          </Text>
          <TextInput
            style={styles.formTextInput}
            onChangeText={props.handleChange('tickets_number1')}
            value={props.values.tickets_number1}
            keyboardType='number-pad'
          />

          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Preço do 2º lote  </Text>
                <Text style={styles.formErrorText}>{props.touched.price2 && props.errors.price2}</Text>
              </Text>
              <TextInput
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('price2')}
                value={props.values.price2}
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Você recebe (Reais)  </Text>
              </Text>
              <TextInput
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                value={taxedPrice(props.values.price2)}
                editable={false}
              />
            </View>
          </View> 

          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Quantidade de ingressos do 2º lote </Text>
            <Text style={styles.formErrorText}>{props.touched.tickets_number2 && props.errors.tickets_number2}</Text>
          </Text>
          <TextInput
            style={styles.formTextInput}
            onChangeText={props.handleChange('tickets_number2')}
            value={props.values.tickets_number2}
            keyboardType='number-pad'
          />

          <ChangeLote />
          <ChangeLoteDate handleChange={props.handleChange} values={props.values} touched={props.touched} errors={props.errors}/>
        </>
      )
    }

    if(lotes === 3){
      return (
        <>
          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Preço do 1º lote  </Text>
                <Text style={styles.formErrorText}>{props.touched.price1 && props.errors.price1}</Text>
              </Text>
              <TextInput
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('price1')}
                value={props.values.price1}
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Você recebe (Reais)  </Text>
              </Text>
              <TextInput
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                value={taxedPrice(props.values.price1)}
                editable={false}
              />
            </View>
          </View> 

          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Quantidade de ingressos do 1º lote  </Text>
            <Text style={styles.formErrorText}>{props.touched.tickets_number1 && props.errors.tickets_number1}</Text>
          </Text>
          <TextInput
            style={styles.formTextInput}
            onChangeText={props.handleChange('tickets_number1')}
            value={props.values.tickets_number1}
            keyboardType='number-pad'
          />

          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Preço do 2º lote  </Text>
                <Text style={styles.formErrorText}>{props.touched.price2 && props.errors.price2}</Text>
              </Text>
              <TextInput
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('price2')}
                value={props.values.price2}
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Você recebe (Reais)  </Text>
              </Text>
              <TextInput
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                value={taxedPrice(props.values.price2)}
                editable={false}
              />
            </View>
          </View> 

          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Quantidade de ingressos do 2º lote  </Text>
            <Text style={styles.formErrorText}>{props.touched.tickets_number2 && props.errors.tickets_number2}</Text>
          </Text>
          <TextInput
            style={styles.formTextInput}
            onChangeText={props.handleChange('tickets_number2')}
            value={props.values.tickets_number2}
            keyboardType='number-pad'
          />

          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Preço do 3º lote  </Text>
                <Text style={styles.formErrorText}>{props.touched.price3 && props.errors.price3}</Text>
              </Text>
              <TextInput
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('price3')}
                value={props.values.price3}
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Você recebe (Reais)  </Text>
              </Text>
              <TextInput
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                value={taxedPrice(props.values.price3)}
                editable={false}
              />
            </View>
          </View>  
          
          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Quantidade de ingressos do 3º lote  </Text>
            <Text style={styles.formErrorText}>{props.touched.tickets_number3 && props.errors.tickets_number3}</Text>
          </Text>
          <TextInput
            style={styles.formTextInput}
            onChangeText={props.handleChange('tickets_number3')}
            value={props.values.tickets_number3}
            keyboardType='number-pad'
          />

          <ChangeLote />
          <ChangeLoteDate handleChange={props.handleChange} values={props.values} touched={props.touched} errors={props.errors} />
        </>
      )
    }

    if(lotes === 4){
      return (
        <>
          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Preço do 1º lote  </Text>
                <Text style={styles.formErrorText}>{props.touched.price1 && props.errors.price1}</Text>
              </Text>
              <TextInput
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('price1')}
                value={props.values.price1}
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Você recebe (Reais)  </Text>
              </Text>
              <TextInput
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                value={taxedPrice(props.values.price1)}
                editable={false}
              />
            </View>
          </View> 

          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Quantidade de ingressos do 1º lote  </Text>
            <Text style={styles.formErrorText}>{props.touched.tickets_number1 && props.errors.tickets_number1}</Text>
          </Text>
          <TextInput
            style={styles.formTextInput}
            onChangeText={props.handleChange('tickets_number1')}
            value={props.values.tickets_number1}
            keyboardType='number-pad'
          />

          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Preço do 2º lote  </Text>
                <Text style={styles.formErrorText}>{props.touched.price2 && props.errors.price2}</Text>
              </Text>
              <TextInput
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('price2')}
                value={props.values.price2}
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Você recebe (Reais)  </Text>
              </Text>
              <TextInput
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                value={taxedPrice(props.values.price2)}
                editable={false}
              />
            </View>
          </View> 

          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Quantidade de ingressos do 2º lote  </Text>
            <Text style={styles.formErrorText}>{props.touched.tickets_number2 && props.errors.tickets_number2}</Text>
          </Text>
          <TextInput
            style={styles.formTextInput}
            onChangeText={props.handleChange('tickets_number2')}
            value={props.values.tickets_number2}
            keyboardType='number-pad'
          />

          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Preço do 3º lote  </Text>
                <Text style={styles.formErrorText}>{props.touched.price3 && props.errors.price3}</Text>
              </Text>
              <TextInput
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('price3')}
                value={props.values.price3}
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Você recebe (Reais)  </Text>
              </Text>
              <TextInput
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                value={taxedPrice(props.values.price3)}
                editable={false}
              />
            </View>
          </View>  
          
          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Quantidade de ingressos do 3º lote  </Text>
            <Text style={styles.formErrorText}>{props.touched.tickets_number3 && props.errors.tickets_number3}</Text>
          </Text>
          <TextInput
            style={styles.formTextInput}
            onChangeText={props.handleChange('tickets_number3')}
            value={props.values.tickets_number3}
            keyboardType='number-pad'
          />

          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Preço do 4º lote  </Text>
                <Text style={styles.formErrorText}>{props.touched.price4 && props.errors.price4}</Text>
              </Text>
              <TextInput
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('price4')}
                value={props.values.price4}
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <Text style={styles.smallFormTextBlock}>
                <Text style={styles.formText}>Você recebe (Reais)  </Text>
              </Text>
              <TextInput
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                value={taxedPrice(props.values.price4)}
                editable={false}
              />
            </View>
          </View>  
          
          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Quantidade de ingressos do 4º lote  </Text>
            <Text style={styles.formErrorText}>{props.touched.tickets_number4 && props.errors.tickets_number4}</Text>
          </Text>
          <TextInput
            style={styles.formTextInput}
            onChangeText={props.handleChange('tickets_number4')}
            value={props.values.tickets_number4}
            keyboardType='number-pad'
          />

          <ChangeLote />
          <ChangeLoteDate handleChange={props.handleChange} values={props.values} touched={props.touched} errors={props.errors} />
        </>
      )
    }
  }

  const WhenChangeLote = () => {
    if(changeLoteByDate){return <Text style={styles.touchableText}>Em uma data específica</Text>}
    else{return <Text style={styles.touchableText}>Quando os ingressos do lote acabarem</Text>}
  }

  const ChangeLote = () => {
    if(lotes === 2 || lotes === 3 || lotes === 4){
      return(
        <>
        <Text style={styles.formTextBlock}>
          <Text style={styles.formText}>Trocar de lote...  </Text>
          <Text style={styles.formErrorText}></Text>
        </Text>
        <TouchableOpacity
          style={styles.inputButton}
          onPress={() => setChangeLoteModalVisible(true)}
        >
          <WhenChangeLote />
        </TouchableOpacity>
        </>
      )
    }
  }

  const ChangeLoteDate = (props) => {
    if(changeLoteByDate){
      if(lotes === 2){
        return (
          <>
          <Text style={styles.smallFormTextBlock}>
            <Text style={styles.formText}>Data e hora da troca de lote  </Text>
            <Text style={styles.formErrorText}>{props.touched.change_lote_date1 && props.errors.change_lote_date1}  </Text>
            <Text style={styles.formErrorText}>{props.touched.change_lote_time1 && props.errors.change_lote_time1}</Text>
          </Text>
          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <TextInputMask
                type={'datetime'}
                options={{format: 'DD/MM'}}
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('change_lote_date1')}
                value={props.values.change_lote_date1}
                ref={(ref) => {mChangeDate1Input = ref}}
                placeholder='DD/MM'
                placeholderTextColor='grey'
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <TextInputMask
                type={'custom'}
                options={{mask: '99:99'}}
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                onChangeText={props.handleChange('change_lote_time1')}
                value={props.values.change_lote_time1}
                placeholder='HH:MM'
                placeholderTextColor='grey'
                keyboardType='number-pad'
              />
            </View>
          </View>
          </>
        )
      }
      if(lotes === 3){
        return (
          <>
          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Data e hora da troca do 1º lote   </Text>
            <Text style={styles.formErrorText}>{props.touched.change_lote_date1 && props.errors.change_lote_date1}  </Text>
            <Text style={styles.formErrorText}>{props.touched.change_lote_time1 && props.errors.change_lote_time1}</Text>
          </Text>
          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>

              <TextInputMask
                type={'datetime'}
                options={{format: 'DD/MM'}}
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('change_lote_date1')}
                value={props.values.change_lote_date1}
                ref={(ref) => {mChangeDate1Input = ref}}
                placeholder='DD/MM'
                placeholderTextColor='grey'
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <TextInputMask
                type={'custom'}
                options={{mask: '99:99'}}
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                onChangeText={props.handleChange('change_lote_time1')}
                value={props.values.change_lote_time1}
                placeholder='HH:MM'
                placeholderTextColor='grey'
                keyboardType='number-pad'
              />
            </View>
          </View>

          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Data e hora da troca do 2º lote  </Text>
            <Text style={styles.formErrorText}>{props.touched.change_lote_date2 && props.errors.change_lote_date2}  </Text>
            <Text style={styles.formErrorText}>{props.touched.change_lote_time2 && props.errors.change_lote_time2}</Text>
          </Text>
          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <TextInputMask
                type={'datetime'}
                options={{format: 'DD/MM'}}
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('change_lote_date2')}
                value={props.values.change_lote_date2}
                ref={(ref) => {mChangeDate2Input = ref}}
                placeholder='DD/MM'
                placeholderTextColor='grey'
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <TextInputMask
                type={'custom'}
                options={{mask: '99:99'}}
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                onChangeText={props.handleChange('change_lote_time2')}
                value={props.values.change_lote_time2}
                placeholder='HH:MM'
                placeholderTextColor='grey'
                keyboardType='number-pad'
              />
            </View>
          </View>
          </>
        )
      }
      if(lotes === 4){
        return (
          <>
          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Data e hora da troca do 1º lote   </Text>
            <Text style={styles.formErrorText}>{props.touched.change_lote_date1 && props.errors.change_lote_date1}  </Text>
            <Text style={styles.formErrorText}>{props.touched.change_lote_time1 && props.errors.change_lote_time1}</Text>
          </Text>
          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>

              <TextInputMask
                type={'datetime'}
                options={{format: 'DD/MM'}}
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('change_lote_date1')}
                value={props.values.change_lote_date1}
                ref={(ref) => {mChangeDate1Input = ref}}
                placeholder='DD/MM'
                placeholderTextColor='grey'
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <TextInputMask
                type={'custom'}
                options={{mask: '99:99'}}
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                onChangeText={props.handleChange('change_lote_time1')}
                value={props.values.change_lote_time1}
                placeholder='HH:MM'
                placeholderTextColor='grey'
                keyboardType='number-pad'
              />
            </View>
          </View>

          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Data e hora da troca do 2º lote  </Text>
            <Text style={styles.formErrorText}>{props.touched.change_lote_date2 && props.errors.change_lote_date2}  </Text>
            <Text style={styles.formErrorText}>{props.touched.change_lote_time2 && props.errors.change_lote_time2}</Text>
          </Text>
          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <TextInputMask
                type={'datetime'}
                options={{format: 'DD/MM'}}
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('change_lote_date2')}
                value={props.values.change_lote_date2}
                ref={(ref) => {mChangeDate2Input = ref}}
                placeholder='DD/MM'
                placeholderTextColor='grey'
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <TextInputMask
                type={'custom'}
                options={{mask: '99:99'}}
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                onChangeText={props.handleChange('change_lote_time2')}
                value={props.values.change_lote_time2}
                placeholder='HH:MM'
                placeholderTextColor='grey'
                keyboardType='number-pad'
              />
            </View>
          </View>

          <Text style={styles.formTextBlock}>
            <Text style={styles.formText}>Data e hora da troca do 3º lote  </Text>
            <Text style={styles.formErrorText}>{props.touched.change_lote_date3 && props.errors.change_lote_date3}  </Text>
            <Text style={styles.formErrorText}>{props.touched.change_lote_time3 && props.errors.change_lote_time3}</Text>
          </Text>
          <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
            <View style={{width: '50%'}}>
              <TextInputMask
                type={'datetime'}
                options={{format: 'DD/MM'}}
                style={styles.smallFormTextInput}
                onChangeText={props.handleChange('change_lote_date3')}
                value={props.values.change_lote_date3}
                ref={(ref) => {mChangeDate3Input = ref}}
                placeholder='DD/MM'
                placeholderTextColor='grey'
                keyboardType='number-pad'
              />
            </View>

            <View style={{width: '50%'}}>
              <TextInputMask
                type={'custom'}
                options={{mask: '99:99'}}
                style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                onChangeText={props.handleChange('change_lote_time3')}
                value={props.values.change_lote_time3}
                placeholder='HH:MM'
                placeholderTextColor='grey'
                keyboardType='number-pad'
              />
            </View>
          </View>
          </>
        )
      }
    }else{return null}
  }

  const PartyBanner = () => {
    if(banner.uri === null){return <Icon name="plus" color={redOwned} size={45} />}
    else{
      return <Image style={styles.bannerImage} source={{uri: banner.uri}} />}
  }

  const openCamera = async () => {
    try{
      const image = await ImagePicker.openCamera({
        width: 450,
        height: 205,
        cropping: true,
      })
      const bannerImage = {
        height: image.height,
        width: image.width,
        size: image.size,
        type: image.mime,
        uri: image.path,
        name: `user${user.uid}partybanner.${image.mime.split('/')[1]}`
      }
      const data = new FormData();
      data.append("file", bannerImage);
      data.append("pid", party.pid)
      const response = await doService(() => uploadPartyBanner(data))
      setBannerModalVisible(false)
      response.status === 201 && goBack()
    }catch(err){console.log(err)}
  }

  const openGallery = async () => {
    try{
      const image = await ImagePicker.openPicker({
        width: 450,
        height: 205,
        cropping: true
      })
      const bannerImage = {
        height: image.height,
        width: image.width,
        size: image.size,
        type: image.mime,
        uri: image.path,
        name: `user${user.uid}partybanner.${image.mime.split('/')[1]}`
      }
      const data = new FormData();
      data.append("file", bannerImage);
      data.append("pid", party.pid)
      const response = await doService(() => uploadPartyBanner(data))
      setBannerModalVisible(false)
      console.log(response)
      response.status === 201 && goBack()
    }catch(err){console.log(err)}
  }

  var changes = {}

  const SaveChangesButton = (props) => {
    const values = props.values

    for(var key in values){
      party[key] != values[key] ? changes = {...changes, [key]: values[key]} : delete changes[key];
    }
    for(var i = 1; i <= 3; i++) {
      eval(`if(obs${i} === ''){
        obs${i} = null;
      }`)
    }
    obs1 !== party.obs1 && obs1 !== '' ? changes = {...changes, obs1} : delete changes[obs1];
    obs2 !== party.obs2 && obs2 !== '' ? changes = {...changes, obs2} : delete changes[obs2];
    obs3 !== party.obs3 && obs3 !== '' ? changes = {...changes, obs3} : delete changes[obs3];
    lotes !== party.lotes ? changes = {...changes, lotes} : delete changes[lotes]
    changeLoteByDate !== party.changeLoteByDate ? changes = {...changes, changeLoteByDate} : delete changes[changeLoteByDate]

    if(Object.keys(changes).length > 0){
      return (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            props.handleSubmit()
          }}>
          <Text style={styles.submitText}>SALVAR ALTERAÇÕES!</Text>
        </TouchableOpacity>
      )
    }else{return null}
  }

  function goBack() {
    navigation.goBack()
    route.params.goBackToRefreshParties()
  }
  
  async function handleUpdates() {
    try {
      const response = await doService(() => updateParty(changes, party.pid))
      console.log(response)
      if(response === 201){
        goBack()
      }
    }catch(err) {
      console.log(err)
    }
  }



  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={{paddingBottom: 10}}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={tryingCancel}
        onRequestClose={() => setTryingCancel(false)}
        >
        <View style={styles.modalCenterContainer}>
          <View style={styles.cancelModalContainer}>
            <View style={styles.cancelModalTextContainer}>
              <Text style={styles.cancelModalText}>Deseja cancelar a criação da sua festa?</Text>
            </View>
            <View style={styles.cancelModalButtonsContainer}>
              <TouchableOpacity 
                onPress={() => setTryingCancel(false)}
                style={{...styles.cancelModalButton, borderRightWidth: 1}}
              >
                <Text style={styles.cancelModalTextButton}>NÃO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  stopCreatingParty()
                  setTryingCancel(false)
                }}
                style={styles.cancelModalButton}
              >
                <Text style={styles.cancelModalTextButton}>SIM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={loteModalVisible}
        onRequestClose={() => setLoteModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setLoteModalVisible(false)}>
          <View style={styles.modalCenterContainer}>
            <View style={styles.loteModalContainer}>
              <TouchableOpacity
                style={styles.loteModalButton}
                onPress={() => {
                    setLotes(1)
                    setChangeLoteByDate(false)
                    setLoteModalVisible(false)
                }}>
                <Text style={styles.loteModalText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.loteModalButton,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: redOwned,
                }}
                onPress={() => {
                  setLotes(2);
                  setLoteModalVisible(false);
                }}>
                <Text style={styles.loteModalText}>Sim, 2 lotes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.loteModalButton}
                onPress={() => {
                  setLotes(3);
                  setLoteModalVisible(false);
                }}>
                <Text style={styles.loteModalText}>Sim, 3 lotes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{...styles.loteModalButton, borderTopWidth: 1, borderColor: redOwned}}
                onPress={() => {
                  setLotes(4);
                  setLoteModalVisible(false);
                }}>
                <Text style={styles.loteModalText}>Sim, 4 lotes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={changeLoteModalVisible}
        onRequestClose={() => setChangeLoteModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setChangeLoteModalVisible(false)}>
          <View style={styles.modalCenterContainer}>
            <View style={styles.changeLoteModalContainer}>
              <TouchableOpacity
                style={styles.changeLoteModalButton}
                onPress={() => {
                  setChangeLoteByDate(false)
                  setChangeLoteModalVisible(false)
                }}>
                <Text style={{...styles.loteModalText, fontSize: 18, textAlign: 'center'}}>Quando os ingressos do lote acabarem</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.changeLoteModalButton,
                  borderTopWidth: 1,
                  borderColor: redOwned,
                }}
                onPress={() => {
                  setChangeLoteByDate(true)
                  setChangeLoteModalVisible(false)
                }}>
                <Text style={{...styles.loteModalText, fontSize: 18, textAlign: 'center'}}>Em uma data específica</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={bannerModalVisible}
        onRequestClose={() => {
          setBannerModalVisible(false);
        }}>
        <View style={{...styles.modalCenterContainer, justifyContent: 'flex-end'}}>
          <View style={styles.bannerModalContainer}>
            <View style={styles.bannerModalButtonsContainer}>
              <TouchableOpacity onPress={openCamera} style={styles.bannerModalButton}>
                <Text style={styles.bannerModalButtonText}>CÂMERA</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bannerModalButtonsContainer}>
              <TouchableOpacity onPress={openGallery} style={styles.bannerModalButton}>
                <Text style={styles.bannerModalButtonText}>GALERIA</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bannerModalButtonsContainer}>
              <TouchableOpacity onPress={() => setBannerModalVisible(false)} style={styles.bannerModalButton}>
                <Text style={styles.bannerModalButtonText}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={ () => {
          handleUpdates()
        }}>
        {(props) => (
          <View style={styles.formContainer}>
            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>Nome da festa  </Text>
              <Text style={styles.formErrorText}>{props.touched.name && props.errors.name}</Text>
            </Text>
            <TextInput
              style={styles.formTextInput}
              onChangeText={props.handleChange('name')}
              value={props.values.name}
            />

            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>Banner  </Text>
              <Text style={styles.formErrorText}></Text>
            </Text>
            <TouchableOpacity
              style={styles.partyBannerInput}
              onPress={() => setBannerModalVisible(true)}
            >
                <PartyBanner />
            </TouchableOpacity>

            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>Data  </Text>
              <Text style={styles.formErrorText}>{props.touched.date && props.errors.date}</Text>
            </Text>
            <TextInputMask
              type={'datetime'}
              options={{format: 'DD/MM'}}
              style={styles.formTextInput}
              onChangeText={props.handleChange('date')}
              value={props.values.date}
              ref={(ref) => {mDateInput = ref}}
              placeholder='DD/MM'
              placeholderTextColor='grey'
              keyboardType='number-pad'
            />

            <View style={{flexDirection: 'row', width: '97%', justifyContent: 'center', flex: 1}}>
              <View style={{width: '50%'}}>
                <Text style={styles.smallFormTextBlock}>
                  <Text style={styles.formText}>Início  </Text>
                  <Text style={styles.formErrorText}>{props.touched.start_time && props.errors.start_time}</Text>
                </Text>
                <TextInputMask
                  type={'custom'}
                  options={{mask: '99:99'}}
                  style={styles.smallFormTextInput}
                  onChangeText={props.handleChange('start_time')}
                  value={props.values.start_time}
                  placeholder='HH:MM'
                  placeholderTextColor='grey'
                  keyboardType='number-pad'
                />
              </View>

              <View style={{width: '50%'}}>
                <Text style={styles.smallFormTextBlock}>
                  <Text style={styles.formText}>Término  </Text>
                  <Text style={styles.formErrorText}>{props.touched.end_time && props.errors.end_time}</Text>
                </Text>
                <TextInputMask
                  type={'custom'}
                  options={{mask: '99:99'}}
                  style={{...styles.smallFormTextInput, marginLeft: '1%'}}
                  onChangeText={props.handleChange('end_time')}
                  value={props.values.end_time}
                  placeholder='HH:MM'
                  placeholderTextColor='grey'
                  keyboardType='number-pad'
                />
              </View>
            </View>

            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>Observações (opcional e máximo de 3) </Text>
            </Text>

            <Obs1 />
            <Obs2 />
            <Obs3 />
            <AddObs />

            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>Sobre (opcional) </Text>
              <Text style={styles.formErrorText}>{props.touched.about && props.errors.about}</Text>
            </Text>
            <TextInput
              style={styles.formTextAreaInput}
              multiline={true}
              numberOfLines={3}
              onChangeText={props.handleChange('about')}
              value={props.values.about}
              maxLength={300}
              placeholder='Comenta algo aí sobre vocês que estão organizando a festa. Pode fazer propaganda!'
              placeholderTextColor='grey'
            />



            <Text style={styles.formTextBlock}>
              <Text style={styles.formText}>Venda por lote?  </Text>
              <Text style={styles.formErrorText}></Text>
            </Text>
            <TouchableOpacity
              style={styles.inputButton}
              onPress={() => setLoteModalVisible(true)}
            >
              <Lotes />
            </TouchableOpacity>

            <Prices touched={props.touched} errors={props.errors} handleChange={props.handleChange} values={props.values}/>

            <SaveChangesButton values = {props.values} handleSubmit={props.handleSubmit} />
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
  cancelModalContainer: {
    backgroundColor: 'black',
    width: 300,
    height: 120,
    borderWidth: 1,
    borderColor: redOwned,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cancelModalTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: redOwned,
    width: '100%',
    height: 80,
  },
  cancelModalText: {
    padding: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
  },
  cancelModalButtonsContainer: {
    flexDirection: 'row',
    height: 38,
  },
  cancelModalButton: {
    height: '100%',
    width: '50%',
    borderColor: redOwned,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelModalTextButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  bannerModalContainer: {
    backgroundColor: 'black',
    width: '97%',
    height: 250,
    borderWidth: 1,
    borderColor: redOwned,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 10,
  },
  bannerModalTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: redOwned,
    width: '100%',
    height: 80,
  },
  bannerModalText: {
    padding: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
  },
  bannerModalButtonsContainer: {
    height: '33.3%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerModalButton: {
    height: 50,
    width: 300,
    borderWidth: 1,
    borderColor: redOwned,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 19,
  },
  loteModalContainer: {
    backgroundColor: 'black',
    width: 250,
    height: 200,
    borderWidth: 1,
    borderColor: redOwned,
    borderRadius: 15,
    overflow: 'hidden',
  },
  loteModalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '25%',
  },
  loteModalText: {
    color: 'white',
    fontSize: 20
  },
  changeLoteModalContainer:{
    backgroundColor: 'black',
    width: '88%',
    height: 125,
    borderWidth: 1,
    borderColor: redOwned,
    borderRadius: 15,
    overflow: 'hidden',
  },
  changeLoteModalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
  },
  bannerImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 90/41,
  },
  formContainer: {
    alignItems: 'center'
  },
  formTextBlock: {
    marginTop: 5,
    width: '96%',
    color: 'white',
  },
  smallFormTextBlock: {
    marginTop: 5,
    width: '100%',
    color: 'white',
    paddingLeft: '1.5%'
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
  smallFormTextInput: {
    marginTop: 3,
    width: '99%',
    height: 40,
    color: 'white',
    paddingLeft: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: redOwned
  },
  formTextAreaInput: {
    flexWrap: "wrap",
    marginTop: 3,
    width: '97%',
    height: 90,
    color: 'white',
    paddingLeft: 10,
    paddingRight: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: redOwned,
  },
  partyBannerInput: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 3,
    width: '97%',
    height: (0.97*(Dimensions.get('window').width))/(90/41),
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
  inputButton: {
    marginTop: 3,
    width: '97%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: redOwned,
    justifyContent: 'center',
  },
  touchableText: {
    color: 'white',
    paddingLeft: 10,
  },
  removeObsButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
    borderColor: redOwned,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    width: '10%',
    marginLeft: 3,
  },
})