import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';


const RootStack = createStackNavigator();

const AutStack = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="SignInScreen" options={{headerShown: false}} component={SignInScreen}/>
    </RootStack.Navigator>
);

export default AutStack;