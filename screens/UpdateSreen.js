import React, {useEffect} from 'react'
import {View,Text, StyleSheet, TextInput, TouchableOpacity,Modal} from 'react-native'
import * as Animatable from 'react-native-animatable';
import * as FileSystem from 'expo-file-system';
import getDateNow from '../utitls/GetDateNow'
import AsyncStorage from '@react-native-community/async-storage';
import { showMessage } from "react-native-flash-message";
const UpdateSreen = ({ route, navigation }) => {
    useEffect(()=> {
    },[] )
    const [modalVisible, setModalVisible] = React.useState(false);
    const [data, setData] = React.useState({
        textValue: '',
        isOk : false,
        isValidInput: false,
        isOk2: false,
        isEqual: false,
        round: false
    })
    const textInputChange = (val) => {
        var num = val.replace(/[^0-9]/g, '')
        setData({
            ...data,
            textValue: num,
            isValidInput: false,
            round: false
        })
    }
    const Update = async () => {
        try {
            if(data.textValue == ''){
              setData({
                  ...data,
                  isValidInput: true
              })
              return
          }
          if(data.textValue == route.params[0].usage.usage){
              if(!data.isOk){
                  setModalVisible(!modalVisible)
                  setData({
                      ...data,
                      isOk2: false,
                      isOk: true,
                      isEqual: true
                  })
                  return
              }
          }
          if(data.textValue < route.params[0].usage.usage){
              if(!data.isOk2){
                  setModalVisible(!modalVisible)
                  setData({
                      ...data,
                      isOk: false,
                      isOk2: true,
                      isEqual: false
                  })
                  return
              }
          }
            let read_location_ = await AsyncStorage.getItem('@read_location')
            let read_location_sub_ = await AsyncStorage.getItem('@read_location_sub')
            let read_location = JSON.parse(read_location_)
            let read_location_sub = JSON.parse(read_location_sub_)
            var datas = []
            var file_name_sub =''
            var file_name = ''
            if(read_location_sub != null && read_location_sub !== 0){
              if( read_location != null){
                file_name_sub = "contact"+read_location.id+"sub_"+read_location_sub.id+".json"
                let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name_sub);
                datas = JSON.parse(queue)
              }
            }else{
                file_name = "contact"+read_location.id+".json"
                let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
                datas = JSON.parse(queue)
            }
         
            const index = datas.results.findIndex(item => item.contact_id == route.params[0].contact_id)
            var items = route.params[0]
            items["current"] = {
              "month_of" : '',
              "usage" :data.textValue
            }
            switch(data.round){
              case true: 
                items["round"] = 1
                break
              default: 
                items["round"] = 0
            }
            if(index != -1){
              datas.results.splice(index,1,items)
            
              if(read_location_sub != null && read_location_sub !== 0){
                if( read_location != null){
                  await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + file_name_sub, JSON.stringify(datas));
                }
              }else{
                  await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + file_name,JSON.stringify(datas));
              }
              showMessage({
                message: "Success",
                description: "Your data have been updated.",
                type: "success",
              })
            }
            navigation.navigate('បានអាន');
          } catch (err) {
            alert(err.message)
        }
       
    }
    const Ok = () => {
        setModalVisible(!modalVisible);
        if(data.isEqual){
            setData({
                ...data,
                isOk: true,
                round: false
            })
        }else{
            setData({
                ...data,
                isOk2: true,
                round: true
            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={{height: 30}}>
                <View style={{flex: 1,flexDirection: 'row'}}>
                    <Text style={styles.font_16}>ឈ្មោះ:</Text>
                    <Text style={{fontSize: 16, marginLeft: 20,flex: 2}}>{route.params[0].contact_name}</Text>
                </View>
            </View>
            <View style={{height: 30}}>
                <View style={{flex: 1,flexDirection: 'row'}}>
                    <Text style={styles.font_16}>លេខកុងទ័រ:</Text>
                    <Text style={{fontSize: 16, marginLeft: 20,flex: 2}}>{route.params[0].number}</Text>
                </View>
            </View>
            <View style={{height: 30}}>
                <View style={{flex: 1,flexDirection: 'row'}}>
                    <Text style={styles.font_16}>ខែចាស់:</Text>
                    <Text style={{fontSize: 16, marginLeft: 20,flex: 2}}>{route.params[0].usage.month_of}</Text>
                </View>
            </View>
            <View style={{height: 30}}>
                <View style={{flex: 1,flexDirection: 'row'}}>
                    <Text style={styles.font_16}>អំណានចាស់:</Text>
                    <Text style={{fontSize: 16, marginLeft: 20,flex: 2}}>{route.params[0].usage.usage}</Text>
                </View>
            </View>
            <View style={{height: 30}}>
                <View style={{flex: 1,flexDirection: 'row'}}>
                    <Text style={styles.font_16}>អំណានថ្មី:</Text>
                    <Text style={{fontSize: 16, marginLeft: 20,flex: 2}}>{route.params[0].current ? route.params[0].current.usage : ''}</Text>
                </View>
            </View>
            <View style={{height: 40}}>
                <TextInput 
                    placeholder="អំណានថ្មី"
                    keyboardType = 'numeric'
                    placeholderTextColor="#666666"
                    style={styles.textInput}
                    autoCapitalize="none"
                    value={data.textValue}
                    onChangeText={(val) =>textInputChange(val)}
                    />
            </View>
            {!data.isValidInput ? null : 
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>បញ្ចូលលេខអំណានថ្មី។</Text>
                </Animatable.View>
            }           
            <TouchableOpacity style={styles.my_btn} onPress={() => Update()}>
                <Text style={{textAlign:"center",color: 'white'}}>បច្ចុប្បន្នភាព</Text>
            </TouchableOpacity>
            <View style={styles.centeredView}>
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Warning!</Text>
                    {
                        !data.isEqual ?
                        <Text>អំណានថ្មីបានធំជាងអំណានចាស់។​ តើវាជាកុងទ័រវិលជំុមែនដែរឬទេ??</Text>
                        : 
                        <Text>អំណានថ្មីអំណានចាស់ស្មើគ្នា។​ តើអ្នកពិតជាចង់​ធ្វើការកែប្រែមែនដែរឬទេ?</Text>
                    }
                    <TouchableOpacity
                      style={{ ...styles.openButton, backgroundColor: "#1c3d6e" }}
                      onPress={() => Ok()}
                    >
                      <Text style={styles.textStyle}>Ok</Text>
                    </TouchableOpacity>
                    
                  </View>
                </View>
              </Modal>
            </View>
        </View>
    )
}
export default UpdateSreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 10,
        fontSize: 16
    },
    font_16: {
        fontSize: 16,
        flex: 1
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        height: 40,
        borderRadius: 10,
        marginVertical: 0,
        backgroundColor: '#bcc2be',
  
    },
    my_btn:{
        padding: 10,
        backgroundColor: '#1c3d6e',
        borderRadius: 10,
        marginTop: 20,
        color: 'white',
        height: 40,
        marginVertical: 10,
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        width: 200,
        padding: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        marginTop: 14,
        backgroundColor: "#F194FF",
        borderRadius: 20,
        width: 120,
        height: 25,
        padding: 2,
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 8,
        color: '#ffcc00',
        fontSize: 18,
        textAlign: "center"
      },
      errorMsg: {
        color: '#ffcc00',
        paddingTop: 4
      }
    
})
