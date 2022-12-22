import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, StyleSheet, Keyboard } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { blackOwned, redOwned } from '../helper/helper'
import verifyCodeFP from '../services/verifyCodeFP'
import { useAuth } from '../contexts/authContext'

const validationSchema = yup.object({
    code: yup.string().required('Digita aí po').min(6, 'O código tem 6 dígitos').max(6, 'O código tem 6 dígitos'),
    password: yup.string().required('Digite uma senha boa').min(6, 'Tem que ter pelo menos 6 caracteres'),
    password2: yup.string().required('Tem que repetir a senha').min(6, 'Tem que ter pelo menos 6 caracteres'),
})

export default function CodeVerificationForgotPasswordScreen({route}){

    const [samePassword, setSamePassword] = useState(true)

    const {phone} = route.params
    const [wrongCode, setWrongCode] = useState(false);
    const {login} = useAuth()
    
    useEffect(() => {
        console.log(phone)
    }, [])

    const CodeError = (props) => {
        if(wrongCode){
            return <Text style={styles.errorText}>Código errado</Text>
        }else{
            return <Text style={styles.errorText}>{props.touched.code && props.errors.code}</Text>
        }
    }

    const PasswordError = (props) => {
        if(samePassword){
            return <Text style={styles.formErrorText}>{props.touched.password2 && props.errors.password2}</Text>
        }else if(samePassword === false){
            return <Text style={styles.formErrorText}>As senhas não estão iguais</Text>
        }
    }

    const verifyPassword = (p1, p2) => {
        return p1 === p2 ? true : false
    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContainer}>
            <Text style={styles.infoText}>Mandamos um código de verificação no seu número. Digita ele aí embaixo, vlw.</Text>
            <Formik
                initialValues={{code: '', password: '', password2: ''}}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    if(verifyPassword(values.password, values.password2)){
                        setSamePassword(true)
                        const response = await verifyCodeFP(values.code, phone, values.password)
                        if(response === 401) {
                            setWrongCode(true)
                        }else if(response.status === 201){
                            const loginValues = {email: response.data.email, password: values.password}
                            login(loginValues)
                            setWrongCode(false)
                        }
                    }else{
                        setSamePassword(false)
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
                <CodeError touched={props.touched} errors={props.errors}/>

                <View style={styles.passwordContainer}>
                    <Text style={styles.infoText}>Digite uma nova senha:</Text>
                    <TextInput
                        style={{...styles.textInput, marginTop: 10, fontSize: 16, paddingBottom: 10}}
                        onChangeText={props.handleChange('password')}
                        value={props.values.password}
                        secureTextEntry
                    />
                    <Text style={styles.formErrorText}>{props.touched.password && props.errors.password}</Text>
                    <Text style={{...styles.infoText, marginTop: 5}}>Repita a senha:</Text>
                    <TextInput
                        style={{...styles.textInput, marginTop: 10, fontSize: 16, paddingBottom: 10}}
                        onChangeText={props.handleChange('password2')}
                        value={props.values.password2}
                        secureTextEntry
                    />
                    <PasswordError touched={props.touched} errors={props.errors} />
                </View>

                <TouchableHighlight style={styles.submitButton} onPress={props.handleSubmit}>
                    <Text style={styles.submitText}>TROCA LÁ</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
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
    passwordContainer: {
        width: '100%',
        marginTop: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: redOwned
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
    },
    formErrorText: {
        color: redOwned,
    },
})