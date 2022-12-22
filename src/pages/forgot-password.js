import React, { useState } from 'react';
import { View, TouchableHighlight, TouchableWithoutFeedback, Text, StyleSheet, Keyboard} from 'react-native';
import { Formik } from 'formik';
import { TextInputMask } from 'react-native-masked-text'
import * as yup from 'yup';
import sendCodeFP from '../services/sendCodeFP'

import { blackOwned, redOwned, highlightOwned } from '../helper/helper';

const validationSchema = yup.object({
    phone: yup.string().required('Tem que por o número').min(19, 'Número ta errado')
})

let phoneInput

export default function ForgotPasswordScreen({navigation}) {

    const [numberNotFound, setNumberNotFound] = useState(false)

    const ErrorMessage = (props) => {
        if(numberNotFound){
            return <Text style={styles.errorText}>Não achamos uma conta com esse número</Text>
        }else{
            return <Text style={styles.errorText}>{props.touched.phone && props.errors.phone}</Text>
        }
    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContainer}>
            <Text style={styles.infoText}>Coloca aí seu número:</Text>
            <Formik
                initialValues={{phone: '+55 '}}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    setNumberNotFound(false)
                    const rawPhone = `+${phoneInput.getRawValue()}`
                    const response = await sendCodeFP(rawPhone)
                    response === 404 && setNumberNotFound(true)
                    response === 201 && navigation.navigate('ForgotPasswordVerification', {phone: rawPhone})
                }}
            >
            {(props) =>(
                <>
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
              <ErrorMessage touched={props.touched} errors={props.errors}/>

              <TouchableHighlight underlayColor={highlightOwned} style={styles.submitButton} onPress={props.handleSubmit}>
                  <Text style={styles.submitText}>VÊ LÁ</Text>
              </TouchableHighlight>
              </>
            )}
            </Formik>
        </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: blackOwned,
        alignItems: 'center'
    },
    infoText: {
        color: 'white',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        width: 300,
    },
    formTextInput: {
        marginTop: 25,
        width: 200,
        height: 40,
        color: 'white',
        fontSize: 18,
        paddingBottom: 8,
        textAlign: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: redOwned,
    },
    errorText: {
        color: redOwned,
    },
    submitButton: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 40,
        backgroundColor: redOwned,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
    },
    submitText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 17,
    }
})