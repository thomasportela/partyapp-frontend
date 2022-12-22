import React, { useEffect } from 'react';
import LoginScreen from '../pages/login';
import SignUpScreen from '../pages/sign-up';
import ForgotPasswordScreen from '../pages/forgot-password';
import CodeVerificationScreen from '../pages/code-verification';
import CodeVerificationForgotPasswordScreen from '../pages/forgot-password-verification'
import { createStackNavigator } from '@react-navigation/stack';
import { blackOwned, redOwned, HeaderBack, HeaderTitle } from '../helper/helper';

const AuthStack = createStackNavigator();

const AuthRoutes = () => {
        return(
            <AuthStack.Navigator>
                <AuthStack.Screen options={{headerShown: false}} name="Login" component={LoginScreen}/>
                <AuthStack.Screen
                    options={{
                        headerStyle: { backgroundColor: redOwned},
                        headerTitleAlign: 'center',
                        headerTitle: () => (<HeaderTitle/>),
                        headerLeft: () => (<HeaderBack/>)
                    }} 
                    name="SignUp"
                    component={SignUpScreen}
                />
                <AuthStack.Screen
                    options={{
                        headerStyle: { backgroundColor: redOwned},
                        headerTitleAlign: 'center',
                        headerTitle: () => (<HeaderTitle/>),
                        headerLeft: () => (<HeaderBack/>)
                    }}
                    name="CodeVerification"
                    component={CodeVerificationScreen}
                />
                <AuthStack.Screen
                    options={{
                        headerStyle: { backgroundColor: redOwned},
                        headerTitleAlign: 'center',
                        headerTitle: () => (<HeaderTitle/>),
                        headerLeft: () => (<HeaderBack/>)
                    }}
                    name="ForgotPassword"
                    component={ForgotPasswordScreen}
                />
                <AuthStack.Screen
                    options={{
                        headerStyle: { backgroundColor: redOwned},
                        headerTitleAlign: 'center',
                        headerTitle: () => (<HeaderTitle/>),
                        headerLeft: () => (<HeaderBack/>)
                    }}
                    name="ForgotPasswordVerification"
                    component={CodeVerificationForgotPasswordScreen}
                />
            </AuthStack.Navigator>
        )
    }

export default AuthRoutes;