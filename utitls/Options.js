import AsyncStorage from '@react-native-community/async-storage';

const api_url = async ()=>{
    let api_url = await AsyncStorage.getItem("@banhji_api_url")
    if(api_url != null){
      return api_url
    }
    return 'http://192.168.0.28:3000/'
}
const allnumeric = (inputtxt) =>{
      var numbers = /^[0-9]+$/;
      if(inputtxt.value.match(numbers)){
        return true;
      } else{
        return false;
      }
   } 
const isANumber = (str)=>{
    return !/\D/.test(str);
}
const validateIsEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}
export {api_url , validateIsEmail}