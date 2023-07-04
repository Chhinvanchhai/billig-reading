import React, {useEffect, useState} from 'react'
import {View,Text, StyleSheet, Alert, TouchableOpacity,ActivityIndicator,ScrollView, Animated, Modal } from 'react-native'
import * as Animatable from 'react-native-animatable';
import * as FileSystem from 'expo-file-system';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import axios from 'react-native-axios';
import {  Overlay } from 'react-native-elements';
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {api_url} from '../utitls/Options'
import getDateNow from '../utitls/GetDateNow'
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
const year_now = new Date().getFullYear()
const SynceByLocation = ({ route, navigation }) => {
    useEffect(()=> {
        getLocation()
        checkNetwork()
        getReadLocationFunc()
        History()
        // localData()
    },[] )
    var controller;
    var controller2;
    const [visible, setVisible] = React.useState(false);
    const [count, setCount] = React.useState(0)
    const [isExist, setIsExist] = React.useState(false)
    const [isUpload, setIsUpload] = React.useState(false)
    const [all_data, setAllData] = React.useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [selectYear, setSelectYear] = useState(year_now)
    const [selectMonth, setSelectMonth] = useState(0)

    const [readHistory, SetReadHistory] = React.useState([
        {
            "date": "",
            "id": "",
            "name": "",
            "read": "",
        },
        {
            "date": "",
            "id": "",
            "name": "",
            "read": "",
        },
        {
            "date": "",
            "id": "",
            "name": "",
            "read": "",
        }
    ])
    const [all_location, SetAll_location] = React.useState([{      
            "abbr": "",
            "id": "",    
            "name": "",
        }])
    const [readLocation, setReadLocation ] = React.useState({
        sub_read: {
            "id": "",
            "name": "",
            "read": "",
        },
        main_read: {
            "id": "",
            "name": "",
            "read": "",
        }
    })
    const [location, setLocation] = React.useState({
        main: [],
        sub: [],
        main_value: '',
        sub_value: '',
        name_main: '',
        name_sub: ''
    })
    // date picker
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [monthOf, setMonthOf] = useState('');
    const [show, setShow] = useState(false);
    const [hideDate, setHideDate] = useState(false)
    const [skip , setSkip] = useState(0)

    const toggleOverlay = () => {
        setVisible(!visible);
    }
    const monthClick = (val) => {
        setModalVisible(!modalVisible);
        setSelectMonth(val)
    }
    const getReadLocationFunc = async ()=>{
        try{
            let sub_location_  = await AsyncStorage.getItem('@read_location_sub')
            let read_location_ = await AsyncStorage.getItem('@read_location')
            let sub_location = JSON.parse(sub_location_)
            let read_location = JSON.parse(read_location_)
            if(sub_location != null){
                setReadLocation({
                    main_read: read_location,
                    sub_read:  sub_location,
                })
            }else{
                if(read_location != null){
                    setReadLocation({
                        ...readLocation,
                        main_read: read_location
                    })
                }
            }
            if(sub_location != null && sub_location !== 0){
                if( read_location != null){
                  let file_name_sub = "contact"+read_location.id+"sub_"+sub_location.id+".json"
                  let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name_sub);
                  let datas = JSON.parse(queue)
                  setCount(datas.count)
                  setAllData(datas)
                }
              }else{
                if( read_location != null){
                  let file_name = "contact"+read_location.id+".json"
                  let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
                  let datas = JSON.parse(queue)
                  setCount(datas.count)
                  setAllData(datas)
                }
              }
        }catch(err){
            alert(err.message)
        }
    }
    const getLocation = async () => {
        try{
            const db_name = await AsyncStorage.getItem('@banhji_database')
            await axios({
                method: 'get',
                url: await api_url() +'location',
                headers: {
                    "Content-Type": "application/json",
                    "database" : db_name
                }
            }).then((res) =>{
                try{
                    var all_data = res.data.results
                    SetAll_location(res.data.results)
                    var data = []
                    all_data.forEach(element => {
                        let data_ = {}
                        data_["label"] = element.name
                        data_['value']  = element.id
                        data.push(data_)
                    });
                    setLocation({
                        ...location,
                        main: data
                    })
                } catch(err) {
                    alert(err.message)
                }
            });
        } catch (err) {
            alert(err.message)
        }
      
    }
    const checkNetwork = () => {
        NetInfo.fetch().then(state => {
            // console.log('Connection type', state.type);
            // console.log('Is connected?', state.isConnected);
            if(!state.isConnected){
                Alert.alert(
                    "Warning!!!",
                    "​ឧបករណ៍របស់អ្នកមិនមានភ្ជាប់អ៊ីនធឺណិតទេ! សូមភ្ជាប់អ៊ីនធឺណិត" ,
                    [
                        {
                        text: "ចាកចេញ",
                        onPress: () => {},
                        style: "cancel"
                        },
                        { text: "OK", onPress: () => {} }
                    ],
                    { cancelable: false }
                )
            }
          });
    }
    const History = async () => {
        const doc = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        var history_isExist_= false
        doc.forEach(item => {
            if(item == 'read_history.json'){
                 history_isExist_ = true
                 return true;
            }
        })
        setIsExist(history_isExist_)
        if(history_isExist_){
            var get_save_hostory_load = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'read_history.json');
            if(get_save_hostory_load != null){
                SetReadHistory(JSON.parse(get_save_hostory_load))
            }
        }
        let read_skip = await AsyncStorage.getItem('@data_skip')
        setSkip(read_skip)
    }
    const AlertWarning =  () =>(
        Alert.alert(
        "Warning!!!",
        "អ្នកមិនទាន់បានអានអស់ទេ។​ សូមធ្វើការអានអោយអស់សិនមុនពេលទាញយកមកថ្មី។​ " ,
        [
            { text: "OK", onPress: () => {} }
        ],
        { cancelable: false }
    ));
    const AlertUpload =  () =>(
        Alert.alert(
        "Warning!!!",
        "មុនពេលដែលអ្នកធ្វើការទានយក សូមចុចលើពាក្យ Upload ជាមុនសិន។​ " ,
        [
            {
            text: "ចាកចេញ",
            onPress: () => {},
            style: "cancel"
            },
            { text: "Upload", onPress: () => UploadData() }
        ],
        { cancelable: false }
    ));
    const UploadData = async (month_of)=>{
        try{ 
            const db_name = await AsyncStorage.getItem('@banhji_database')
            const user_ = await AsyncStorage.getItem('@banhji_user')
            var user = JSON.parse(user_)
            var _newdata =[]
            await all_data.results.map(item => {
                if(item.current != 0 && item.current != undefined){
                    item['current'] = {
                        "month_of" : month_of,
                        "usage" : item.current.usage
                    }
                    // item['date'] = '2020-12-01'
                    _newdata.push(item)
                }
               
            })
         
            var post_data = all_data
            post_data["results"] = _newdata
            post_data["count"] = _newdata.length
            setVisible(true)
            await axios({
                method: 'post',
                url: await api_url() + 'record_usage',
                headers: {
                    "Content-Type": "application/json",
                    "database" : db_name
                }, 
                data:  post_data,
                params: {
                    user_id: user[0].id,
                }
            }).then((res) =>{
                setVisible(false)
                setHideDate(true)
                setIsUpload(true)
                var my_message = `ទិន្នន័យផ្ទុកឡើងទៅអ៊ិនធឺណិតរបស់អ្នកទទួលបានជោគជ័យ. ចំនួន​ ${res.data.count}`
                showMessage({
                    message: "Success",
                    description: my_message,
                    type: "success",
                })
            }). catch(err => {
                setVisible(false)
                setHideDate(false)
                setIsUpload(false)
                Alert.alert(
                    "Failed!",
                    "​ទិន្នន័យផ្ទុកឡើងទៅអ៊ិនធឺណិតរបស់អ្នកមិនជោគជ័យទេ. " + err.message ,
                    [
                        { text: "OK", onPress: () => {} }
                    ],
                    { cancelable: false }
                )
            })
        } catch(err){
            alert(err.message)
        }
    }
    const getSyncData = async () => {
        // await FileSystem.deleteAsync(FileSystem.documentDirectory+"read_history.json")
        // // const doc = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        // // console.log(doc)
        // AlertUpload()
        // return
        // const user_ = await AsyncStorage.getItem('@banhji_user')
        // var user = JSON.parse(user_)
        // console.log(user[0].id)
        // return
 
        try{
            var read_ = ''
            if(readLocation.sub_read.read != ''){
                read_ = readLocation.sub_read.read
            }else{
                read_ = readLocation.main_read.read
            }
            if(read_ + 1 < count){
                AlertWarning()
                return
            }
            if(read_ + 1 == count && !isUpload){
                if(selectMonth == 0){
                    alert("សូមជ្រើសរើសខែ!")
                    return
                }else{
                    let month_of = selectYear+'-'+selectMonth+'-01'
                    setMonthOf(month_of)
                    Alert.alert(
                        "បញ្ចូលទិន្នន័យ?",
                        "អ្នកបានជ្រើសរើសខែ ​"+month_of+" ។មុនពេលដែលអ្នកធ្វើការទានយក សូមចុចលើពាក្យ <<បញ្ចូលទិន្នន័យ>> ជាមុនសិន។​ " ,
                        [
                            {
                            text: "ចាកចេញ",
                            onPress: () => {},
                            style: "ចាកចេញ"
                            },
                            { text: "បញ្ចូលទិន្នន័យ", onPress: () => UploadData(month_of) }
                        ],
                        { cancelable: false }
                    )
                    return
                   
                }
                // AlertUpload()
                // return
            } 
                 
            const db_name = await AsyncStorage.getItem('@banhji_database')
            if(location.main_value == 0 || location.main_value === ''){
                alert("សូមជ្រើសរើសប្លុក", location.main_value)
                return
            }
            var contact_data = ''
            var contact_name =  "contact"+location.main_value+".json"
            if(location.sub_value != ''){
                contact_name =  "contact"+location.main_value+"sub_"+location.sub_value+".json"
            }
            setVisible(true);
            await axios({
                method: 'get',
                url: await api_url()+'contact',
                headers: {
                    "Content-Type": "application/json",
                    "database" : db_name
                }, 
                params: {
                    location_id: location.main_value,
                    sub_location_id: location.sub_value
                }
            }).then( async(res) =>{
                contact_data = res.data
                /* 
                    Save read history 
                */
               const get_read = await AsyncStorage.getItem('@read_location')
               const get_read_sub = await AsyncStorage.getItem('@read_location_sub')
               if(get_read != null || get_read_sub != null){
                    var read_data_save =  {}
                    if(get_read_sub != null){
                        read_data_save = JSON.parse(get_read_sub)
                        read_data_save["location"] = get_read
                        read_data_save["date"] = getDateNow()
                    }else{
                        if(get_read != null){
                            read_data_save = JSON.parse(get_read)
                        }
                        read_data_save["date"] = getDateNow()
                    }
                    var get_save_hostory = ''
                    if(isExist){
                        get_save_hostory = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'read_history.json');
                    }
                    var save_hostory = ''
                    if(get_save_hostory != ''){
                        save_hostory  = JSON.parse(get_save_hostory)
                        save_hostory.unshift(read_data_save)
                    }else{
                        save_hostory = []
                        save_hostory.push(read_data_save) 
                    }
                    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'read_history.json',JSON.stringify(save_hostory));
               }
                /* 
                   if have sub location
                   and update new read
                */
                if(location.sub_value != '' ){
                    let read_info_sub = {
                        id: location.sub_value,
                        name: location.name_sub,
                        read:0
                    }
                    AsyncStorage.setItem('@read_location_sub',JSON.stringify(read_info_sub))
                }else{
                    AsyncStorage.setItem('@read_location_sub','')
                }
                let read_info_main = {
                    id: location.main_value,
                    name: location.name_main,
                    read: 0
                }
                AsyncStorage.setItem('@read_location',JSON.stringify(read_info_main))
                FileSystem.writeAsStringAsync(FileSystem.documentDirectory + contact_name , JSON.stringify(contact_data));
                //  Set read history
                setVisible(false);
                if(res.data.count == 0){
                    showMessage({
                        message: "គ្មានទិន្នន័យ",
                        description: "មិនមានទិន្នន័យនៅក្នុងប្លុកនេះទេ។",
                        type: "warning",
                    })
                }else{
                    showMessage({
                        message: "Success",
                        description: "ការទាញយកទិន្នន័យទទួលបានជោគជ័យ។",
                        type: "success",
                    })
                }
            });
            // await 
        } catch (err) {
            alert(err.message)
        }
    }
      // Our country list generator for picker
    const  rederlistLocation = (val) =>{
        return( 
            val.map((item,i) => { 
              return( <Picker.Item label={item.label} key={i} value={item.value}  />)} )
        );
    }
    const  rederSubLocation = (val) =>{
        return( 
            val.map((item,i) => { 
              return( <Picker.Item label={item.name} key={i} value={item.id}  />)} )
        );
    }
    const MainSelect = (val,name) =>{
        try{
            if(val != ''){
                var find_main_location = all_location.filter(find => find.id == val)
                var sub_location_selected = find_main_location[0].utp_locations
                if(find_main_location!= ''){
                    setLocation({
                        ...location,
                        sub:  sub_location_selected,
                        main_value: val,
                        name_main: find_main_location[0].name
                    })
                }
            }else{
                setLocation({
                    ...location,
                    sub:  [],
                    main_value: '',
                    name_main: ''
                })
            }
      
        } catch(err){
            alert(err.message)
        }
    }
    const selectedSublocation = (val) =>{
        try{
            var sub_loc_name = location.sub.filter(find => find.id == val)
            setLocation({
                ...location,
                sub_value: val,
                name_sub: sub_loc_name[0].name
            })
        }catch (err){
            alert(err.message)
        }
    }
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{height: 80}}>
                    <View style={{flex: 1,flexDirection: 'row'}}>
                        <View style={{flex:1,marginRight: 5}}>
                                <Text style={{fontSize: 18}}>ប្លុក</Text>
                                <View style={{ borderWidth: 1, borderColor: '#d1d0cd',marginTop:6, borderRadius: 4 }}>
                                    <Picker
                                        selectedValue={location.main_value}
                                        style={{height: 35 ,borderBottomColor:'grye',borderEndWidth: 1}}
                                        onValueChange={(itemValue) => MainSelect(itemValue)}>
                                        <Picker.Item label="ជ្រើសរើស..." value="" />
                                        {rederlistLocation(location.main)}
                                    </Picker>
                                </View>

                        </View>
                        <View style={{flex:1,marginLeft: 5}}>
                                <Text style={{fontSize: 18}}>ទីតាំងរង</Text>
                                <View style={{ borderWidth: 1, borderColor: '#d1d0cd',marginTop:6, borderRadius: 4 }}>
                                    <Picker
                                        selectedValue={location.sub_value}
                                        style={{height: 35 ,borderBottomColor:'grye',borderEndWidth: 1}}
                                        onValueChange={(itemValue, itemIndex) => selectedSublocation(itemValue)
                                    }>
                                        <Picker.Item label="ជ្រើសរើស..." value="" />
                                        {rederSubLocation(location.sub)}
                                    </Picker>
                                </View>
                          
                        </View>
                    </View>
                </View>
                <View style={{height: 30}}>
                    <Text style={{fontSize: 20, flex: 1}}>ព័ត៍នៃការអាន</Text>
                </View>
                <View style={styles.row_border}>
                    <View style={{flex: 1 ,flexDirection: 'row' ,marginVertical: 3}}>
                        <Text style={{fontSize: 16,flex: 1}}>កំពង់អាននៅប្លុក: </Text>
                        <Text style={styles.read_result}>{readLocation.main_read.name}</Text>
                </View>
                </View>
                <View style={styles.row_border}>
                    <View style={{flex: 1 ,flexDirection: 'row',marginVertical: 3}}>
                        <Text  style={{fontSize: 16,flex: 1}}>ទីតាំងរង:</Text>
                        <Text  style={styles.read_result}>{ readLocation.sub_read ?  readLocation.sub_read.name : ''}</Text>
                </View>
                </View>
                <View style={styles.row_border}>
                    <View style={{flex: 1 ,flexDirection: 'row',marginVertical: 3}}>
                        <Text  style={{fontSize: 16,flex: 1}}>ទិន្នន័យសរុប:</Text>
                        <Text  style={styles.read_result}>{ count }</Text>
                </View>
                </View>
                <View style={styles.row_border}>
                    <View style={{flex: 1 ,flexDirection: 'row',marginVertical: 3}}>
                        <Text  style={{fontSize: 16,flex: 1}}>​បានអាន:</Text>
                        <Text style={styles.read_result}>
                            { readLocation.sub_read.read != '' 
                                ?  
                                readLocation.sub_read.read  == count -1    ?  readLocation.sub_read.read +1- skip   : readLocation.sub_read.read  - skip 
                                :   
                                readLocation.main_read.read == count -1   ? readLocation.main_read.read +1 - skip     : readLocation.main_read.read  - skip 
                            }
                        </Text>
                </View>
                </View>
                {/* Read history  */}
                <View style={{height: 50}}>
                    <Text style={{fontSize: 20, flex: 1, marginTop: 20}}>ប្រវត្តិនៃការអាន</Text>
                </View>
                <View>
                    <View style={{height: 20,marginTop:10}}>
                        <Text style={{fontSize: 16, flex: 1}}>ថ្ងៃខែ: {readHistory[0].date}</Text>
                    </View>
                    <View style={styles.row_border}>
                        <View style={{flex: 1 ,flexDirection: 'row' ,marginVertical: 3}}>
                            <Text style={{fontSize: 16,flex: 1}}>ប្លុក-ទីតាំងរង: </Text>
                            <Text style={styles.read_result}>{readHistory[0].name}</Text>
                    </View>
                    </View>
                </View>
                <View>
                    <View style={{height: 20,marginTop:10}}>
                        <Text style={{fontSize: 16, flex: 1}}>ថ្ងៃខែ: {readHistory[1] ? readHistory[1].date: ''}</Text>
                    </View>
                    <View style={styles.row_border}>
                        <View style={{flex: 1 ,flexDirection: 'row' ,marginVertical: 3}}>
                            <Text style={{fontSize: 16,flex: 1}}>ប្លុក-ទីតាំងរង: </Text>
                            <Text style={styles.read_result}>{readHistory[1] ? readHistory[1].name : '' }</Text>
                    </View>
                    </View>
                </View>
                <View>
                    <View style={{height: 20,marginTop:10}}>
                        <Text style={{fontSize: 16, flex: 1}}>ថ្ងៃខែ: {readHistory[2] ? readHistory[2].date : '' }</Text>
                    </View>
                    <View style={styles.row_border}>
                        <View style={{flex: 1 ,flexDirection: 'row' ,marginVertical: 3}}>
                            <Text style={{fontSize: 16,flex: 1}}>ប្លុក-ទីតាំងរង: </Text>
                            <Text style={styles.read_result}>{readHistory[2] ? readHistory[2].name : '' }</Text>
                    </View>
                    </View>
                </View>
                {
                    isExist ? 
                    <TouchableOpacity style={{height: 30}} onPress={() => navigation.navigate('History') }>
                        <Text style={{textAlign:"right",color:"#000", fontSize: 16,paddingTop: 6}}>មើលទាំងអស់   <FontAwesome name="angle-double-right" size={18} /> </Text>
                    </TouchableOpacity>
                    : 
                    <Text></Text>
                }
                {
                   !hideDate ? 
                        readLocation.sub_read.read ?  
                        readLocation.sub_read.read+1 == count ?  
                            <TouchableOpacity style={styles.my_btn}   onPress={() =>  setModalVisible(true) } >
                                <Text style={{textAlign:"center",color: 'white'}}>ជ្រើរើសខែ</Text>
                            </TouchableOpacity>  : null  
                    
                        : readLocation.main_read ?
                            readLocation.main_read.read+1 == count ?  
                                <TouchableOpacity style={styles.my_btn}  onPress={() => { setModalVisible(true) }}>
                                    <Text style={{textAlign:"center",color: 'white'}}>ជ្រើរើសខែ</Text>
                                </TouchableOpacity>  : <Text></Text>  
                            : null
                    : <Text></Text>
                }
             
                <TouchableOpacity style={styles.my_btn} onPress={() => getSyncData()}>
                        <Text style={{textAlign:"center",color: 'white'}}>ទាញយកនិងផ្ទុកឡើង</Text>
                </TouchableOpacity>
 
                <Overlay isVisible={visible} onBackdropPress={toggleOverlay}  fullScreen={true} >
                        <View style={styles.overlay}>
                                <View>
                                    <Text style={{fontSize: 20,textAlign: 'center',marginBottom: 10}}>Syncing Data!</Text>
                                    <ActivityIndicator  size="large" color="#00ff00" />
                                </View>
                        </View>
                </Overlay>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                    >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                        <Text style={styles.modalText}>ជ្រើសរើសខែ</Text>
                        <View style={{height: 50 ,width: 200}}>  
                            <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between',alignContent:'space-between'}}> 
                                <TouchableOpacity style={{width:40,height: 40}} onPress={()=> setSelectYear(selectYear-1)}>
                                    <FontAwesome style={{textAlign:'center'}}  name="angle-left"  size={34}/>
                                </TouchableOpacity>
                                <View>
                                    <Text style={{fontSize: 24}}>{selectYear}</Text>
                                </View>
                                <TouchableOpacity style={{width:40,height: 40}}  onPress={()=> setSelectYear(selectYear+1)}>
                                    <FontAwesome style={{textAlign:'center'}}  name="angle-right"  size={34}/>
                                </TouchableOpacity>
                            </View> 
                        </View>
                    
                        <View style={{height: 170, width: 200}}>
                                <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between',alignContent:'space-between'}}>
                                    <TouchableOpacity onPress={()=>{ monthClick('01')}} style={{width:30,height: 30}}>
                                        <Text style={{fontSize: 18,textAlign:'center'}}>1</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{ monthClick('02')}} style={{width:30,height: 30}}>
                                        <Text style={{fontSize: 18,textAlign:'center'}}>2</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{ monthClick('03')}} style={{width:30,height: 30}}>
                                        <Text style={{fontSize: 18,textAlign:'center'}}>3</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{ monthClick('04')}} style={{width:30,height: 30}}>
                                        <Text style={{fontSize: 18, textAlign:'center'}}>4</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between',alignContent:'space-between'}}>
                                    <TouchableOpacity onPress={()=>{ monthClick('05')}} style={{width:30,height: 30}}>
                                        <Text style={{fontSize: 18, textAlign:'center'}}>5</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{ monthClick('06')}} style={{width:30,height: 30}}>
                                        <Text style={{fontSize: 18, textAlign:'center'}}>6</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{ monthClick('07')}} style={{width:30,height: 30}}>
                                        <Text style={{fontSize: 18, textAlign:'center'}}>7</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{ monthClick('08')}} style={{width:30,height: 30}}>
                                        <Text style={{fontSize: 18, textAlign:'center'}}>8</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between',alignContent:'space-between'}}>
                                    <TouchableOpacity onPress={()=>{ monthClick('09')}} style={{width:30,height: 30}}>
                                        <Text style={{fontSize: 18, textAlign:'center'}}>9</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{ monthClick('10')}} style={{width:30,height: 30}}>
                                        <Text style={{fontSize: 18, textAlign:'center'}}>10</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{ monthClick('11')}} style={{width:30,height: 30}}>
                                        <Text style={{fontSize: 18, textAlign:'center'}}>11</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{ monthClick('12')}} style={{width:30,height: 30}}>
                                        <Text style={{fontSize: 18, textAlign:'center'}}>12</Text>
                                    </TouchableOpacity>
                                </View>
                        </View>
                        </View>
                    </View>
                    </Modal>
            </ScrollView>
        </View>
    )
}
export default SynceByLocation

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
    my_btn:{
        padding: 10,
        backgroundColor: '#1f3863',
        borderRadius: 10,
        color: 'white',
        height: 40,
        marginVertical: 10,
    },
    row_border:{
        height: 30, 
        borderBottomColor:'#d1d0cd',
        borderBottomWidth: 1
    },
    read_result: {
        fontSize: 16,
         marginRight: 10,
         fontWeight:'bold'
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center"   
 
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
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
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        fontSize: 22,
        textAlign: "center"
      }
})
