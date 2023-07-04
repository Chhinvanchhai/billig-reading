import React  from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView,Alert, Modal, Image ,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as FileSystem from 'expo-file-system';
import { SyncContext } from '../components/Sync';
import { showMessage } from "react-native-flash-message";
import getDateNow from '../utitls/GetDateNow'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';

export default class Home extends React.Component{
  static contextType = SyncContext;
  constructor(props) {
    super(props)
    this.state = { 
      flashMode: Camera.Constants.FlashMode.off,
      turnLight: false,
      read: 0,
      textValue: '',
      isOk : false,
      isValidInput: false,
      isOk2: false,
      isEqual: false,
      round: false,
      isDone: false,
      skip_num_record: 0,
      watch: '0',
      modalVisible: false,
      verify: 0,
      area: '',
      all_data: [
        {
          "number": "",
          "utp_meter_id": "",
          "order": '',
          "contact_name": "",
          "contact_id": "",
          "utp_location_id": "",
          "utp_location_name": "",
          "sub_location_id": "",
          "sub_location_number": "",
          "usage": {
              "month_of": "",
              "usage": ""
          }
        }
      ]
    }
    this.alertFunct = this.alertFunct.bind(this)
    this.scrollView_ = React.createRef()
  }
  componentDidMount(){
    this.getData()
    // this.getNumRead()
  }
  toggleLight(){
    // setTurnLight(!this.state.turnLight)
    if(!this.state.turnLight){
        this.setState({
          flashMode:Camera.Constants.FlashMode.torch,
          turnLight: true
        })
    }else{
      this.setState({
        flashMode:Camera.Constants.FlashMode.off,
        turnLight: false

      })
    }
}
  getData = async () => {
    try{
      
      let read_location_ = await AsyncStorage.getItem('@read_location')
      let read_location_sub_ = await AsyncStorage.getItem('@read_location_sub')
      let read_location = JSON.parse(read_location_)
      let read_location_sub = JSON.parse(read_location_sub_)
      if(read_location_sub != null && read_location_sub !== 0){
        if( read_location != null){
          var file_name_sub = "contact"+read_location.id+"sub_"+read_location_sub.id+".json"
          let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name_sub);
          let datas = JSON.parse(queue)
          if(datas.results != ''){
            // Check Skip number
            var skip_num_init = 0
            datas.results.map(item => {
              if(item.current == 0){
                skip_num_init++
              }
            })
            
            this.setState({
              watch: datas.results.length,
              all_data: datas.results,
              read: read_location_sub.read,
              area: read_location_sub.name,
              skip_num_record: skip_num_init
            })
          }
        }
      }else{
        if( read_location != null){
          var file_name = "contact"+read_location.id+".json"
          let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
          let datas = JSON.parse(queue)
          if(datas.results != ''){
            var skip_num_init = 0
            datas.results.map(item => {
              if(item.current == 0){
                skip_num_init++
              }
            })
            AsyncStorage.setItem('@data_skip', skip_num_init.toString())
            this.setState({
              watch: datas.results.length,
              all_data: datas.results,
              read: read_location.read,
              area: read_location.name,
              skip_num_record: skip_num_init
            })
          }
        }
      }
      if(read_location == null && read_location_sub == null){
        this.setState({
          watch: 0,
          all_data: [
            {
              "number": "",
              "utp_meter_id": "",
              "order": '',
              "contact_name": "",
              "contact_id": "",
              "utp_location_id": "",
              "utp_location_name": "",
              "sub_location_id": "",
              "sub_location_number": "",
              "usage": {
                  "month_of": "",
                  "usage": ""
              }
            }
          ],
          read: 0,
          area: '',
          skip_num_record: 0
        })
      }
    } catch(err){
      alert(err.message)
    }
    
 
  }
  Reload = () => {
    this.getData()
  }
  textInputChange = (val) => {
    var num = val.replace(/[^0-9]/g, '')
    var check = val - this.state.all_data[this.state.read].usage.usage
  
  
    this.setState({
      textValue : num,
      isValidInput: false,
      verify: check
    })
    if(val < 10){
      this.scrollView_.scrollToEnd()
    }
   
  }

  OkClck(){
      if(!this.state.isEqual){
        this.setState({
          isOk: true,
          round: true
        })
      }else{
        this.setState({
          isOk2: true,
          round: false
        })
      }
  }
  Cancel(){
      return
  }
  alertFunct =  (equal) =>
      Alert.alert(
        "Warning!",
        !equal ? "អំណានថ្មីបានធំជាងអំណានចាស់ ។​ តើវាជាកុងទ័រវិលជំុមែនដែរឬទេ?" : "អំណានថ្មីអំណានចាស់ស្មើគ្នា។​ តើអ្នកពិតជាចង់​ធ្វើការកែប្រែមែនដែរឬទេ?" ,
        [
          {
            text: "Cancel",
            onPress: () => this.Cancel(),
            style: "cancel"
          },
          { text: "OK", onPress: () => this.OkClck() }
        ],
        { cancelable: false }
    );
    alertDone =  () =>
      Alert.alert(
        "អំណានរបស់អ្នកបានអានអស់ហើយ!",
        "ផ្ទុកទិន្នន័យរបស់អ្នកទៅលើអ៊ីនធឺណិត។",
        [
          { text: "Go Sync", onPress: () => this.GoToSynce() }
        ],
        { cancelable: false }
    );
    GoToSynce(){
      this.setState((prevState,props)=>({
          isDone: !prevState.isDone
      }))
      this.props.navigation.navigate('Synce By Location')
    }
    doClear(){
      let textInput = this.refs["textInput"];
      textInput.clear();
    }

    Update = async(id,skip) =>{
      try {
          if(this.state.watch == '0'){
            return
          }
          if(this.state.isDone){
            this.alertDone()
            return
          }
          if(skip != 1){
            if(this.state.textValue == ''){
              this.setState({
                  isValidInput: true
              })
              return
            }
            if(this.state.textValue == this.state.all_data[this.state.read].usage.usage){
                if(!this.state.isOk2){
                  this.alertFunct(true)
                  this.setState({
                    isEqual: true
                  })
                  return
                }
            }
            if(this.state.textValue < this.state.all_data[this.state.read].usage.usage){
              if(!this.state.isOk){
                this.alertFunct(false)
                this.setState({
                  isEqual: false
                })
                return
              }
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
       
          const items = await datas.results.find(item => item.contact_id == id )
          const index = datas.results.findIndex(item => item.contact_id == id )
          // Check Skip number
      
          switch(skip){
            case 1: 
              items["current"] = 0
              break
            default: 
              items["current"] = {
                "month_of" :  '',
                "usage" : this.state.textValue
              }
              items["date"] = getDateNow()
          }
          switch(this.state.round){
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
          }
          /* 
            inscreament index for read
          */
          var  read_location_update = {}
          var val =""
          if(read_location_sub != null) {
            val = read_location_sub.read
            val = parseInt(val) + 1
            if(val == this.state.watch){
              val = val -1
              this.setState((prevState,props)=>({
                isDone: !prevState.isDone
              }))
            }
            if(this.state.watch == 1){
              val = 0
            }
            read_location_update = {
              ...read_location_sub,
              read: val
            }
            await AsyncStorage.setItem('@read_location_sub', JSON.stringify(read_location_update))
          }else{
            val = read_location.read
            val = parseInt(val) + 1
            if(val == this.state.watch){
              val = val -1
              this.setState((prevState,props)=>({
                isDone: !prevState.isDone
              }))
            }
            
            if(this.state.watch == 1){
              val = 0
            }

            read_location_update = {
              ...read_location,
              read: val
            }
            await AsyncStorage.setItem('@read_location', JSON.stringify(read_location_update))
          }
          var skip_num = 0
          if(datas.results != ''){
            datas.results.map(item => {
              if(item.current == 0){
                skip_num++
              }
            })
          }
          AsyncStorage.setItem('@data_skip', skip_num.toString())
          this.setState({
            read: val,
            skip_num_record: skip_num,
            textValue : "",
            isOk: false,
            isOk2: true,
            round: false
          })
          if(skip == 1){
            showMessage({
              message: "ជោគជ័យ",
              description: "អ្នកបានគេរំលងការអាន!",
              type: "info",
            })
          }else{
            showMessage({
              message: "ជោគជ័យ",
              description: "ទិន្នន័យរបស់អ្នកត្រូវបានធ្វើបច្ចុប្បន្នភាព។",
              type: "success",
            })
          }
          this.getData()
          //  Done Read
          if(read_location_sub != null) {
            if(read_location_sub.read == this.state.watch-1){
              this.alertDone()
            }
          }else{
            if(read_location != null){
              if(read_location.read == this.state.watch-1){
                this.alertDone()
              }
            }
          }
        } catch (err) {
          alert(err.message)
      }
     
  }
  Skip(){
    Alert.alert(
      "Warning!",
      "តើអ្នកពិតជាចង់រំលងមែនទេ។​",
      [
        {
          text: "ចាកចេញ",
          onPress: () => {},
          style: "cancel"
        },
        { text: "យល់ព្រម", onPress: () => this.oKSkip() }
      ],
      { cancelable: false }
    );
   
  }
  oKSkip(){
    this.Update(this.state.all_data[this.state.read].contact_id,1)
  }
    render() {
      return (
 
        <SafeAreaView style={styles.container}>
          {/* <StatusBar backgroundColor='#fff' barStyle="light-content"/> */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}} ref={scrollView_ => this.scrollView_ = scrollView_}>
            <View style={{height: 60}}>
              <View style={styles.header}>
                  <Icon onPress={() => this.props.navigation.openDrawer()} style={{flex:1}} name="format-list-bulleted" size={36} color="#babdb9"/>
                  <Text style={{textAlign:"center", flex: 2,fontSize: 24,fontWeight:"bold"}}>អានអំណាន</Text>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                      <TouchableOpacity  onPress={() => this.Reload()}>
                          <View style={{ justifyContent: 'center',alignItems: 'center'}}>
                            <Image style={{width: 30,height: 30}} source={require('../assets/refresh.png')} />
                          </View>
                      </TouchableOpacity>
                      <TouchableOpacity  onPress={() => this.toggleLight()}>
                          <View>
                            { !this.state.turnLight ?   <Icon name="lightbulb-outline" size={30} style={{textAlign: 'right'}} color="#000"/>  : <Icon name="lightbulb-on-outline" style={styles.light} size={30} />}
                          </View>
                      </TouchableOpacity>
                  </View>
              </View>
            </View>
            <View>
              <Text style={{fontSize: 18, color: "#5fb3e4"}}>ស្ថានីយទឹកស្អាត</Text>
            </View>
            <View style={{height: 220}}>
              <View style={{flex: 1, flexDirection: "row",marginTop: 16}}>
                <View style={{height: 180, flex: 1,marginRight: 6, ...styles.shawdow}}>
                    <View style={styles.card1}>
                      <TouchableOpacity  onPress={()=> this.props.navigation.navigate('បានអាន')}>
                        <View style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                          <Image style={{width: 40,height: 40}} source={require('../assets/meters.png')} />
                        </View>
                        <Text style={{textAlign: 'center',fontSize: 18, color: 'grey'}}>បានអាន</Text>
                        <Text style={{textAlign: 'center',fontSize: 24,fontWeight: 'bold',color: '#1c3d6e'}}>{this.state.watch-1 == this.state.read ? this.state.read+1 - this.state.skip_num_record : this.state.read - this.state.skip_num_record }</Text>
                      </TouchableOpacity>
                    </View>
                </View>
                <View style={{height: 180,flex: 1,marginLeft: 6}}>
                  <View style={styles.card1}>
                    <View>
                      <View style={{ justifyContent: 'center',alignItems: 'center',}}>
                        <Image style={{width: 40,height: 40}} source={require('../assets/meters.png')} />
                      </View>
                      <Text style={{textAlign: 'center',fontSize: 18, color: 'grey'}}>សរុប</Text>
                      <Text style={{textAlign: 'center',fontSize: 24,fontWeight: 'bold',color:'#5fb3e4'}}>{this.state.watch}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ backgroundColor: '#f0f4f8',borderRadius:8 ,paddingVertical: 14}}>
                    <Text style={{paddingLeft: 16, fontSize: 18, fontWeight: 'bold'}}>{this.state.area}</Text>
              <View style={{height: 30, marginVertical: 5}}>
                <View style={styles.detial}>
                  <Text style={styles.font_text}>អតិថិជន: </Text>
                  <Text style={styles.font_text1}>{this.state.all_data[this.state.read].contact_name}</Text>
                </View>
              </View>
              <View style={{height: 30, marginVertical: 5}}>
                <View style={styles.detial}>
                  <Text style={styles.font_text}>នាឡិកា: </Text>
                  <Text style={styles.font_text1}>
                    {this.state.all_data[this.state.read].number }
                  </Text>
                </View>
              </View>
              <View style={{height: 30, marginVertical: 5}}>
                <View style={styles.detial_old}> 
                  <Text style={styles.font_text2}>អំណានចាស់: </Text>
                    <Text style={styles.font_text1}>{this.state.all_data[this.state.read].usage.usage}</Text>
                </View>
              </View>
            </View>
            <View style={{flex: 1,flexDirection: 'row',marginTop:22}}>
              <View style={{ backgroundColor: '#f0f4f8',marginRight: 6,borderRadius:8 ,flex: 1,height: 100}}>
                  <Text style={{fontSize: 18,marginLeft: 10,fontWeight: 'bold'}}>អំណានថ្មី</Text>
                  <View style={styles.action}>
                      <TextInput 
                          keyboardType = 'numeric'
                          placeholderTextColor="#666666"
                          style={styles.textInput}
                          ref="textInput"
                          controlled={true}
                          maxLength={10}
                          value={this.state.textValue}
                          autoCapitalize="none"
                          onChangeText={(val) => this.textInputChange(val)}
                      />
                  </View>
                  { !this.state.isValidInput ? null : 
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>បញ្ចូលលេខអំណានថ្មី។</Text>
                  </Animatable.View>
                }
              </View>
              <View style={{flex:1,marginLeft: 5}}>
                <View style={{ backgroundColor: '#f0f4f8',borderRadius:8,height:100 }}>
                  <Text style={{fontSize: 18,marginLeft: 10,fontWeight: 'bold'}}>ផ្ទៀងផ្ទាត់</Text>
                  <View style={{flex: 1,justifyContent: 'center',alignContent: 'center'}}>
                    {
                      this.state.verify < 0 ?
                        <Text style={{fontSize: 18,marginLeft: 10,fontWeight: 'bold',textAlign: 'center',color: 'red'}}>{this.state.verify}</Text>
                      :
                        <Text style={{fontSize: 18,marginLeft: 10,fontWeight: 'bold',textAlign: 'center',color:'#000'}}>{this.state.verify}</Text>
                    }
        
                  </View>
                </View>
              </View>

            </View>
          
            {/* Action */}
            <View style={{flex: 1,flexDirection: 'row',marginTop:16}}>
              <View style={{flex:1}}>
                <TouchableOpacity style={styles.my_btn} onPress={() => this.Update(this.state.all_data[this.state.read].contact_id)}>
                  <Text style={{textAlign:"center",color: '#fff',fontSize: 18,fontWeight: 'bold'}}>កត់ត្រា</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex:1}}>
                <TouchableOpacity style={styles.my_btn2} onPress={() => this.Skip()}>
                  <Text style={{textAlign:"center",color: '#fff',fontSize: 18, fontWeight: 'bold'}}>រំលង</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
       
            </View>
            <View style={styles.centeredView}>
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Warning!</Text>
                    {
                        !this.state.isEqual ?
                        <Text>អំណានថ្មីបានធំជាងអំណានចាស់។​ តើអ្នកពិតជាចង់​ធ្វើការកែប្រែមែនដែរឬទេ?</Text>
                        : 
                        <Text>អំណានថ្មីអំណានចាស់ស្មើគ្នា។​ តើអ្នកពិតជាចង់​ធ្វើការកែប្រែមែនដែរឬទេ?</Text>
                    }
                    <TouchableOpacity
                      style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                      onPress={() => this.OkClck() }
                    >
                      
                      <Text style={styles.textStyle}>Ok</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            {
                this.state.turnLight ? <Camera   flashMode={this.state.flashMode} ></Camera>  :  null
            }
          </ScrollView>
        </SafeAreaView>
      );
    }
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16
  },
  card1:{
    flex:1,
    justifyContent: "center",
    alignContent: "center",
    borderRadius:8,
    backgroundColor: '#f0f4f8',

  },
  text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 30
  },
  text_footer: {
      color: '#05375a',
      fontSize: 18
  },
  action: {
      flexDirection: 'row',
      marginTop: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingHorizontal: 10,
      paddingBottom: 5
  },
  actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5
  },
  textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 16,
      height: 40,
      backgroundColor: "#fff",
      fontSize: 18,
      marginVertical: 0,
      borderRadius: 10

  },
  errorMsg: {
      color: '#ffcc00',
      marginLeft: 12,
      paddingBottom: 6,
      fontSize: 14,
  },
  button: {
      alignItems: 'center',
      marginTop: 50
  },
  signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
  },
  textSign: {
      fontSize: 18,
      fontWeight: 'bold'
  },
  detial: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  detial_old: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#5fb3e4',
    paddingLeft: 16,
    paddingRight: 16,
    paddingHorizontal: 10
  },
  my_btn:{
    backgroundColor: '#5fb3e4',
    borderRadius: 10,
    color: 'white',
    marginRight: 6,
    height: 60,
    marginVertical: 10,
    padding: 14,
  },
  my_btn2:{
    backgroundColor: '#1c3d6e',
    borderRadius: 10,
    color: 'white',
    padding: 14,
    marginLeft: 6,
    height: 60,
    marginVertical: 10
  },
  my_btn3:{
    backgroundColor: '#0a1c2b',
    borderRadius: 10,
    color: '#fff',
    padding: 4,
    height: 50,
    marginTop: 10
  },
  font_text: {
    fontSize: 18,
    color: 'grey'
  },
  font_text2: {
    fontSize: 18,
    color: '#fff'
  },
  font_text1: {
    fontSize: 18,
  },
  box_abs:{
    position: 'absolute',
    right: 5,
    bottom: 10
  },
  my_btn_round:{
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 4,
    backgroundColor: '#163287',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
  btnSkip: {
    marginHorizontal: 12,
    marginBottom: 40
  },
  header: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10
  },
  shawdow:{
    backgroundColor: 'black',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation: 5,
  },
  light: {
    color: "#ffdc5e",
    textAlign: 'right'
  },
});
