import React, {useEffect, useState} from 'react'
import {View,Text, StyleSheet, Alert, TouchableOpacity,ActivityIndicator,ScrollView, Button } from 'react-native'
import * as Animatable from 'react-native-animatable';
import * as FileSystem from 'expo-file-system';
import DropDownPicker from 'react-native-dropdown-picker';
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
        main: [
             { label:'Location', value:'0' }
        ],
        sub: [
            { label:'Sub-Location', value:'0' }
        ],
        main_value: '0',
        sub_value: '0',
        name_main: '',
        name_sub: ''
    })
    // date picker
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [monthOf, setMonthOf] = useState('');
    const [show, setShow] = useState(false);
    const [hideDate, setHideDate] = useState(false)
    const [language, setLanguage] = useState('')
    const [value, setValue] = useState([])
    const [sub, setSub] = useState([
         {
          "id": 6,
          "name": "A1",
        },
         {
          "id": 7,
          "name": "A2",
        },
      ])
  
 

    const toggleOverlay = () => {
        setVisible(!visible);
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
                    var test = []
                    all_data.forEach(element => {
                        var data_ = {}
                        var data_sub = {}
                        data_['label'] = element.name,
                        data_['value'] = element.id,
                        data_sub["label"] = element.name
                        data_sub['value']  = element.id
                        data.push(data_)
                        test.push(data_sub)
                    });
                    setLocation({
                        ...location,
                        main: data
                    })
                    setValue(test)
                    console.log(test)
                } catch(err) {
                    alert(err.message)
                }
                // setVisible(false);
               
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
    const selectedItem = async (val,name) => {
        try{
        
            let find_main_location = all_location.filter(find => find.id == val)
            let sub_location = find_main_location[0].utp_locations
            if(sub_location!= ''){
                var data_sub = []
                sub_location.forEach(element => {
                    let data_sub_ = {}
                    data_sub_['label'] = element.name,
                    data_sub_['value'] = element.id,
                    data_sub.push(data_sub_)
                });
                setLocation({
                    ...location,
                    sub:  data_sub,
                    main_value: val,
                    name_main: name
                })
            }else{
               await setLocation({
                    ...location,
                    main_value: val,
                    sub: [{ label:'Sub-Location', value:'0' }],
                    name_main: name
                })
                controller.selectItem('0')
            }
        } catch(err) {
            alert(err.message)
        }
        // all_location[val]
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
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
      if(currentDate != ''){
        let str_date = currentDate.toISOString(); 
        let cut_date = str_date.slice(0, 10);
        let dat_format = cut_date.split("-");
        let new_date = dat_format[0]+"-"+dat_format[1]+"-"+ "01"
        setMonthOf(new_date)
      }
    };
  
    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };
  
    const showDatepicker = () => {
      showMode('date');
    };
    const UploadData = async ()=>{
        try{ 
            const db_name = await AsyncStorage.getItem('@banhji_database')
            let sub_location_id_ = await AsyncStorage.getItem('@read_location_sub')
            let location_id_ = await AsyncStorage.getItem('@read_location')
            var location_sub_id = JSON.parse(sub_location_id_)
            var location_id = JSON.parse(location_id_)
            // setIsUpload(true)
            // return true
            // var sub_id
            // if(location_sub_id == null){
            //     sub_id = 0
            // }else{
            //     sub_id = location_sub_id.id
            // }
            var _newdata =[]
            await all_data.results.map(item => {
                if(item.current != 0){
                    item['current'] = {
                        "month_of" : monthOf,
                        "usage" : item.current.usage
                    }
                    _newdata.push(item)
                }
               
            })
         
            var post_data = all_data
            post_data["results"] = _newdata
            post_data["count"] = _newdata.length
            setVisible(true)
            await axios({
                method: 'post',
                url:await api_url() + 'record_usage',
                headers: {
                    "Content-Type": "application/json",
                    "database" : db_name
                }, 
                data:  post_data,
                // params: {
                //     location_id: location_id.id,
                //     sub_location_id : sub_id

                // }
            }).then((res) =>{
                setVisible(false)
                setHideDate(true)
                setIsUpload(true)
                showMessage({
                    message: "Success",
                    description: "​ទិន្នន័យផ្ទុកឡើងទៅអ៊ិនធឺណិតរបស់អ្នកទទួលបានជោគជ័យ.",
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
                if(monthOf == ''){
                    alert("សូមជ្រើសរើសខែ!")
                    return
                }
                AlertUpload()
                return
            } 
                 
            const db_name = await AsyncStorage.getItem('@banhji_database')
            if(location.main_value == 0 || location.main_value === ''){
                alert("Please select location", location.main_value)
                return
            }
            var contact_data = ''
            var contact_name =  "contact"+location.main_value+".json"
            if(location.sub_value != '0'){
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
                if(location.sub_value != '0'){
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
                showMessage({
                    message: "Success",
                    description: "ទិន្នន័យរបស់អ្នកត្រូវបានផ្ទុកឡើងទៅអ៊ីនធឺណិត។",
                    type: "success",
                })
            });
            // await 
        } catch (err) {
            alert(err.message)
        }
    }
      // Our country list generator for picker
    const  countryList = (val) =>{
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
    const MainSelect = (val) =>{
        try{
            let find_main_location = all_location.filter(find => find.id == val)
            let sub_location_selected = find_main_location[0].utp_locations
            setSub(sub_location_selected)
            setValue(val)
        } catch(err){
            alert(err.message)
        }
    }
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{height: 80}}>
                    <View style={{flex: 1,flexDirection: 'row'}}>
                        <View style={{flex:1,marginRight: 5}}>
                                <Text style={{fontSize: 16}}>ប្លុក</Text>
                                <DropDownPicker
                                        items={location.main}
                                        defaultValue={location.main_value}
                                        containerStyle={{height: 40}}
                                        controller={instance => controller2 = instance}
                                        style={{backgroundColor: '#fafafa'}}
                                        itemStyle={{
                                            justifyContent: 'flex-start'
                                        }}
                                        dropDownStyle={{backgroundColor: '#fafafa'}}
                                        onChangeItem={item => selectedItem(item.value, item.label)}
                                    />
                                   
                        </View>
                        <View style={{flex:1,marginLeft: 5}}>
                                <Text style={{fontSize: 16}}>ទីតាំងរង</Text>
                                <DropDownPicker
                                    items={location.sub}
                                    defaultValue={location.sub_value}
                                    containerStyle={{height: 40}}
                                    controller={instance => controller = instance}
                                    style={{backgroundColor: '#fafafa'}}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{backgroundColor: '#fafafa'}}
                                    onChangeItem={item => setLocation({
                                        ...location,
                                        sub_value: item.value,
                                        name_sub: item.label
                                    })}
                                />
                        </View>
                    </View>
                </View>
                <View style={{height: 80}}>
                    <View style={{flex: 1,flexDirection: 'row'}}>
                        <View style={{flex:1,marginRight: 5}}>
                                <Text style={{fontSize: 16}}>ប្លុក</Text>
                                <Picker
                                    selectedValue={language}
                                    style={{height: 50, width: 100,marginBottom: 80 ,borderBottomColor:'grye',borderEndWidth: 1}}
                                    onValueChange={(itemValue, itemIndex) => MainSelect(itemValue)}>
                                    <Picker.Item label="Select Location" value="" />
                                    {countryList(value)}
                                </Picker>
                        </View>
                        <View style={{flex:1,marginLeft: 5}}>
                                <Text style={{fontSize: 16}}>ទីតាំងរង</Text>
                                <Picker
                                    selectedValue={language}
                                    style={{height: 50, width: 100,marginBottom: 80 ,borderBottomColor:'grye',borderEndWidth: 1}}
                                    onValueChange={(itemValue, itemIndex) =>
                                    setLanguage(itemValue)
                                }>
                                    <Picker.Item label="Sub-Location" value="" />
                                    {rederSubLocation(sub)}
                                </Picker>
                          
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
                        <Text style={styles.read_result}>{ readLocation.sub_read.read != '' ? readLocation.sub_read.read + 1 : readLocation.main_read.read + 1 }</Text>
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
                            <TouchableOpacity style={styles.my_btn} onPress={showDatepicker}>
                                <Text style={{textAlign:"center",color: 'white'}}>ជ្រើរើសខែ</Text>
                            </TouchableOpacity>  : null  
                    
                        : readLocation.main_read ?
                            readLocation.main_read.read+1 == count ?  
                                <TouchableOpacity style={styles.my_btn} onPress={showDatepicker}>
                                    <Text style={{textAlign:"center",color: 'white'}}>ជ្រើរើសខែ</Text>
                                </TouchableOpacity>  : <Text></Text>  
                            : null
                    : <Text></Text>
                }
             
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    />
                )}
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
 
    }
})
