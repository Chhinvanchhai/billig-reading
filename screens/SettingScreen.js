import React, {useEffect} from 'react'
import {View, Text, Modal, StyleSheet, TouchableOpacity,TextInput, Alert} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { showMessage, hideMessage } from "react-native-flash-message";
import * as FileSystem from 'expo-file-system';
import { set } from 'react-native-reanimated';

const Setting = ({navigation}) => {
    const [modalVisible, setModalVisible] = React.useState(true);
    const [password, setPassword] = React.useState('123321')
    const [data, setData ] = React.useState({
        textValue: '',
        def_database: 'db_1496997052',
    })
    const [url, setURL] = React.useState('http://192.168.0.28:3000/')
    useEffect(()=>{
        getDbName()
        getPass()
        getUrl()
        // deleteFile()
    },[])
    const Ok = () => {
        if(data.textValue == password){
            setModalVisible(!modalVisible)
        }else{
            navigation.goBack()
        }
    }
    const textInputChange = (val) => {
        setData({
            ...data,
            textValue: val,
        })
    }
    const textDbChange = (val) => {
        setData({
            ...data,
            def_database: val,
        })
    }
    const textPassChange = (val) => {
        setPassword(val)
    }
    const textURLChange = (val) => {
        setURL(val)
    }
    const getDbName = async() => {
        try{
            const db = await AsyncStorage.getItem('@banhji_database')
            if(db != null) {
                setData({
                    ...data,
                    def_database: db,
                })
            }
        } catch (err){
            alert(err)
        }
    } 
    const getPass = async() => {
        try{
            const pass = await AsyncStorage.getItem('@banhji_pass')
            if(pass != null){
                setPassword(pass)
            }
        } catch (err){
            alert(err)
        }
    } 
    const getUrl = async() => {
        try{
            const my_url = await AsyncStorage.getItem('@banhji_api_url')
            if(my_url != null){
                setURL(my_url)
            }
        } catch (err){
            alert(err)
        }
    } 
    const Save = async ()=> {
        try{
         
            // await AsyncStorage.setItem('@banhji_database',data.def_database)
            await AsyncStorage.setItem('@banhji_api_url',url)
            showMessage({
                message: "Success",
                description: "URL have been saved.",
                type: "success",
            })
        } catch(err){
            alert(err.message)
        }
    }
    const deleteFile = async () => {
        const doc = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        if(doc != ''){
            doc.map(async (item)=> {
                await FileSystem.deleteAsync(FileSystem.documentDirectory+item)
            })
            AsyncStorage.setItem('@read_location_sub','')
            AsyncStorage.setItem('@read_location','')
            AsyncStorage.setItem('@data_skip', '')
            showMessage({
                message: "Success",
                description: "​ទិន្នន័យរបស់អ្នកត្រូវលុបចោល។",
                type: "warning",
            })
        }else{
            showMessage({
                message: "Success",
                description: "​ទិន្នន័យរបស់អ្នកបានលុបចោលរួចហើយ។",
                type: "warning",
            })
        }
     
    }
    const confirmDeleted =  () =>(
        Alert.alert(
        "តើអ្នកចង់លុបមែនទេ?",
        "ទិន្នន័យរបស់អ្នកនឹងត្រូវលុបចោលទាំងអស់។" ,
        [
            {
            text: "ចាកចេញ",
            onPress: () => {},
            style: "មិនលុប"
            },
            { text: "លុប", onPress: () => deleteFile() }
        ],
        { cancelable: false }
    ));

    return (
        <View>
           
            <View style={{flex: 1, padding: 10}}>
                <View>
                    <Text>Database</Text>
                    <TextInput 
                        placeholder="Database"
                        placeholderTextColor="#666666"
                        style={styles.textInput2}
                        value={data.def_database}
                        autoCapitalize="none"
                        onChangeText={(val) =>textDbChange(val)}
                    />
                    <Text>URL</Text>
                    <TextInput 
                        placeholder="url"
                        placeholderTextColor="#666666"
                        style={styles.textInput2}
                        value={url}
                        autoCapitalize="none"
                        onChangeText={(val) =>textURLChange(val)}
                    />
                    <Text style={{marginTop: 10}}>Password</Text>
                    <TextInput 
                        placeholder="Password"
                        placeholderTextColor="#666666"
                        style={styles.textInput2}
                        value={password}
                        autoCapitalize="none"
                        onChangeText={(val) =>textPassChange(val)}
                    />
                    <TouchableOpacity
                      style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                      onPress={() => Save()}
                    >
                      <Text style={styles.textStyle}>រក្សារទុកURL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{backgroundColor: "#2196F3", height:35,marginVertical: 20,padding: 4,borderRadius: 6 }}
                      onPress={() => confirmDeleted()}
                    >
                      <Text style={styles.textStyleDeleted}>លុបទិន្នន័យទាំងអស់</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.centeredView}>
              <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Admin!</Text>
                    <Text>សូមបញ្ចូលលេខសំងាត់។</Text>
                    <TextInput 
                        placeholder="Password"
                        placeholderTextColor="#666666"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) =>textInputChange(val)}
                    />
                    <TouchableOpacity
                      style={{ ...styles.openButtonModal, backgroundColor: "#2196F3" }}
                      onPress={() => Ok()}
                    >
                      <Text style={styles.textStyleDeleted}>Ok</Text>
                    </TouchableOpacity>
                    
                  </View>
                </View>
              </Modal>
            </View>
        </View>
    )

}
export default Setting
const styles = StyleSheet.create({
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
        borderRadius: 4,
        height: 35,
        padding: 6,
    },
    openButtonModal: {
        marginTop: 14,
        backgroundColor: "#F194FF",
        borderRadius: 8,
        width: 130,
        height: 35,
        padding: 6,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
    },
    textStyleDeleted: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
    },
    modalText: {
        marginBottom: 8,
        color: '#ffcc00',
        fontSize: 18,
        textAlign: "center"
    },
    textInput:{
        backgroundColor: '#d4d9d7',
        width: 130,
        marginTop: 10,
        paddingLeft: 3,
        height: 40,
        borderRadius: 8

    },
    textInput2:{
        backgroundColor: '#d4d9d7',
        paddingLeft: 3,
        height: 36,
        borderRadius: 8

    }
})