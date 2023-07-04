import React, {useEffect, useState} from 'react';
import * as FileSystem from 'expo-file-system';
import {  Overlay } from 'react-native-elements';
import axios from 'react-native-axios';
import { View, StyleSheet ,ActivityIndicator,Text , Alert} from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";
// import NetInfo from '@react-native-community/netinfo';
const SyncContext = React.createContext();
const  SyncProvider = (props) => { 
    const toggleOverlay = () => {
        setVisible(!visible);
    };
    const [visible, setVisible] = React.useState(false);
    const  SyncData = async () => {
  
        AlertDonwloadSync()
    }
    const  UploadSynce =  () => {
        AlertUploadSynce()
    }
    const AlertUploadSynce =  () =>(
        Alert.alert(
        "Warning!!!",
        "តើអ្នកប្រាកដទេថាអ្នកចង់បញ្ចូលទិន្នន័យទៅអ៊ីនធឺណិត។​ ទិន្នន័យទាំងអស់នៅលើអ៊ីនធឺណិតនឹងធ្វើបច្ចុប្បន្នភាពពីទិន្នន័យផ្ទុកឡើងរបស់អ្នក។​ " ,
        [
            {
            text: "Cancel",
            onPress: () => Cancel(),
            style: "cancel"
            },
            { text: "OK", onPress: () => OkUploadSync() }
        ],
        { cancelable: false }
    ));
    const AlertDonwloadSync =  () =>(
        Alert.alert(
        "Warning!!!",
        "តើអ្នកប្រាកដទេថាអ្នកចង់បញ្ចូលទិន្នន័យទៅអ៊ីនធឺណិត។​ ទិន្នន័យទាំងអស់នៅលើអ៊ីនធឺណិតនឹងធ្វើបច្ចុប្បន្នភាពពីទិន្នន័យផ្ទុកឡើងរបស់អ្នក។​ " ,
        [
            {
            text: "Cancel",
            onPress: () => Cancel(),
            style: "cancel"
            },
            { text: "OK", onPress: () => OkDonwSynce() }
        ],
        { cancelable: false }
    ));
    const Cancel =() =>{
        return
    }
    const OkUploadSync = async () =>{
        try{
          
        } catch (err) {
            alert(err.message)
        }
        
    }

    const OkDonwSynce = async() => {
        saveLocation()
        return
    }
    const saveLocation = async() => {
        try{
            var location = ''
            setVisible(true);
            // await axios.get(`http://192.168.0.50:3000/location`,)
            // // await axios.get(`http://192.168.1.204:4000/api/sql/meter`)
            // .then(res => {
            //     location = res.data
            //     setVisible(false);
            // }).catch(err =>{
            //     setVisible(false);
            //     alert(err.message)
            // })
            await axios({
                method: 'get',
                url:'http://192.168.0.50:3000/location',
                headers: {
                    "Content-Type": "application/json",
                    "database" : "db_1496997052"
                }, 
                params: {

                }
            }).then((res) =>{
                setVisible(false);
                showMessage({
                    message: "Success",
                    description: "Your data have been uploaded.",
                    type: "success",
                  })
            });
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + `location.json`, JSON.stringify(location));
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <SyncContext.Provider
            value={{
                SyncData,
                UploadSynce
            }}
        >
            {props.children}
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}  fullScreen={true} >
                <View style={styles.overlay}>
                    <Text>Syncing Data!</Text>
                    <ActivityIndicator  size="large" color="#00ff00" />
                </View>
            </Overlay>
        </SyncContext.Provider>
    )
}
const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 300,
        zIndex: 100,
        left: 130
    },
    box_overly:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.2)'
    }
});

export {SyncProvider,SyncContext};
