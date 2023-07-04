import React, {useEffect} from 'react'
import { View, ActivityIndicator,Alert } from 'react-native';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';

import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme 
} from 'react-native-paper';
import * as ScreenOrientation from 'expo-screen-orientation';
ScreenOrientation.unlockAsync()
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack'
import FlashMessage from "react-native-flash-message"
import axios from 'react-native-axios';
import { AuthContext } from './components/context';
import {api_url} from './utitls/Options'
import AsyncStorage from '@react-native-community/async-storage';

const App = () => {
  // const [isLoading, setIsLoading] = React.useState(true);
  // const [userToken, setUserToken] = React.useState(null); 

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [isLogin , setISLogin] = React.useState(null);
  const [loading , setLoading] = React.useState(true);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }
  
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }
  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
  useEffect(() => {   // it is simila to componentdidmount
    checkUser()
  }, []);
  const checkUser = async () => {
    const user = await AsyncStorage.getItem('@banhji_user')
    if(user != null){
      setLoading(false)
      setISLogin(true)
    }else{
      setLoading(false)
      setISLogin(false)
    }
  }
  const authContext = React.useMemo(() => ({
    signIn: async(username,password) => {
      await axios({
        method: 'post',
        url: await api_url() + 'login',
        headers: {
            "Content-Type": "application/json",
        }, 
        data:  {
          email:username,
          password:password
        },
      }).then((res) =>{
        if(res.data.data != ''){
          console.log(res.data.data[0].connections[0].inst_database)
          AsyncStorage.setItem('@banhji_user', JSON.stringify(res.data.data))
          AsyncStorage.setItem('@banhji_database',res.data.data[0].connections[0].inst_database)
          setISLogin(true)
        }else{
          alert("ការចូលបានបរាជ័យ")
        }
      }).catch(err => {
        setISLogin(false)
        AsyncStorage.setItem('@banhji_user', '')
      })
    },
    signOut: async() => {
      AsyncStorage.setItem('@banhji_user', '')
      setISLogin(false)
    }
  }), []);

  if(loading){
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
  return (
    <PaperProvider theme={theme}>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer theme={theme}>
            { isLogin ? <AppStack/> :  <AuthStack/> }
          </NavigationContainer>
          <FlashMessage position="top" />
        </AuthContext.Provider>
    </PaperProvider>
  );
}
export default App;
