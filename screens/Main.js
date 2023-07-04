import React from 'react';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'

import Icon from 'react-native-vector-icons/Ionicons'
import Home from './Home';
import ReviewScreen from '../screens/ReviewScreen'
import UpdateSreen from '../screens/UpdateSreen'
import SynceByLocation from '../screens/SynceByLocation'
import Setting from '../screens/SettingScreen'
import History from '../screens/ReadHistory'
import HaveRead from '../screens/HaveReadScreen'
import SkipRead from '../screens/SkipReadScreen'
import NotRead from '../screens/NotReadScreen'
const Stack = createStackNavigator();
const Main = ({navigation}) => (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#1c3d6e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
      fontWeight: 'bold'
      }
    }}>
      <Stack.Screen name="Home" mode="modal" component={Home} options={{
        headerLeft: () => (
            <Icon.Button name="ios-menu" size={25} backgroundColor="#fff" onPress={() => navigation.openDrawer()}></Icon.Button>
        ),
        headerShown: false 
      }} />
   
      <Stack.Screen name="Preview" component={ReviewScreen} options={{
    
      }} />
      <Stack.Screen name="Update" component={UpdateSreen} options={{
        // headerLeft: () => (
        //     <Icon.Button name="ios-menu" size={25} backgroundColor="#1f65ff" onPress={() => navigation.openDrawer()}></Icon.Button>
        // )
      }} />
      <Stack.Screen name="Synce By Location" component={SynceByLocation} options={{}} 
      />
      <Stack.Screen name="Setting" component={Setting} options={{}} 
      />
      <Stack.Screen name="History" component={History} options={{}}  />
      <Stack.Screen name="បានអាន" component={HaveRead} options={{}}  />
      <Stack.Screen name="ទិន្នន័យរំលង" component={SkipRead} options={{}}  />
      <Stack.Screen name="មិនទាន់អាន" component={NotRead} options={{}}  />
      
  </Stack.Navigator>
);

export default Main;

