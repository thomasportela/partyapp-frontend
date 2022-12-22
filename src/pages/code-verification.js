import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableHighlight, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { blackOwned, redOwned, highlightOwned } from '../helper/helper'
import verifyCode from '../services/verifyCode'
import { useAuth } from '../contexts/authContext'

const validationSchema = yup.object({
    code: yup.string().required('Digita aí po').min(6, 'O código tem 6 dígitos').max(6, 'O código tem 6 dígitos')
})

export default function CodeVerificationScreen({route}){

    const {user} = route.params
    const [wrongCode, setWrongCode] = useState(false);
    const {login} = useAuth()
    
    useEffect(() => {
        console.log(user)
    }, [])

    const ErrorMessage = (props) => {
        if(wrongCode){
            return <Text style={styles.errorText}>Código errado</Text>
        }else{
            return <Text style={styles.errorText}>{props.touched.code && props.errors.code}</Text>
        }
    }

    return(
        <View style={styles.mainContainer}>
            <Text style={styles.infoText}>Mandamos um código de verificação no seu número. Digita ele aí embaixo, vlw.</Text>
            <Formik
                initialValues={{code: ''}}
                // validationSchema={validationSchema}
                onSubmit={async (values) => {
                    console.log(values)
                    const response = await verifyCode(values.code, user)
                    if(response === 401) {
                        setWrongCode(true)
                    }else if(response === 201){
                        const loginValues = {email: user.email, password: user.password}
                        login(loginValues)
                        setWrongCode(false)
                    }
                }}
            >
            {(props) => (
                <>
                <TextInput
                    style={styles.textInput}
                    onChangeText={props.handleChange('code')}
                    value={props.values.code}
                    keyboardType='numeric'
                />
                <ErrorMessage touched={props.touched} errors={props.errors}/>

                <TouchableHighlight underlayColor={highlightOwned} style={styles.submitButton} onPress={props.handleSubmit}>
                    <Text style={styles.submitText}>MANDA LÁ</Text>
                </TouchableHighlight>
                </>
            )}
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: blackOwned,
        flex: 1,
        alignItems: 'center',
    },
    infoText: {
        color: 'white',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        width: 300,
    },
    textInput: {
        marginTop: 20,
        width: 150,
        height: 40,
        color: 'white',
        fontSize: 20,
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
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
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