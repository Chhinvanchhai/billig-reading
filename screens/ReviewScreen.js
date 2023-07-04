import React, {useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList,TouchableOpacity, ActivityIndicator,Modal } from 'react-native';
import { useTheme } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import { useGrobals } from '../components/GrobalState'
import AsyncStorage from '@react-native-community/async-storage'; 

const ReviewScreen = ({navigation}) => {
    useEffect(() => {
      getData()
    },[]);
    const [visible, setVisible] = React.useState(false)
    const [modalVisible, setModalVisible] = React.useState(false);
    const { colors } = useTheme();
    const [read, setRead] = React.useState('0')
    const [data, setData] = React.useState({
      new_read: '',
      password: '',
      email: '',
      language: 'ធម្មតា',
      search: '',
      errorMessage: '',
      check_textInputChange: false,
      secureTextEntry: true,
      isValidInput: true,
      isValidPassword: true,
      watch: '0',
      all_data: [
        {
          "number": "0",
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
          },
          "current": {
            "month_of": "",
            "usage": ""
          }
        }
      ]
    });

    const getData = async () => {
      let read_location_ = await AsyncStorage.getItem('@read_location')
      let read_location_sub_ = await AsyncStorage.getItem('@read_location_sub')
      let read_location = JSON.parse(read_location_)
      let read_location_sub = JSON.parse(read_location_sub_)

      if(read_location_sub != null && read_location_sub !== 0){
        if( read_location != null){
          var file_name_sub = "contact"+read_location.id+"sub_"+read_location_sub.id+".json"
          let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name_sub);
          let datas = JSON.parse(queue)
          setData({
            ...data,
            watch: datas.results.length,
            all_data: datas.results
          })
        }
      }else{
        if(read_location != null){
          var file_name = "contact"+read_location.id+".json"
          let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
          let datas = JSON.parse(queue)
          setData({
            ...data,
            watch: datas.results.length,
            all_data: datas.results
          })
        }
      }
    }
    const textInputChange = (val) => {
      setData({
        ...data,
        search : val,
      })
    }

    const Item = ({ item }) => (
      // <TouchableOpacity  onPress={() =>navigation.navigate('Update',[item])}>
      <TouchableOpacity>
        <View style={styles.table}>
          <Text style={{flex: 1,color: colors.text}}>{item.number}</Text>
          <Text style={{flex: 2,color: colors.text}}>{item.contact_name}</Text>
          <Text style={{flex: 1,color: colors.text}}>{item.usage.usage}</Text>
          <Text style={{flex: 1,color: colors.text}}>{item.current ? item.current.usage : '' }</Text>
        </View>
      </TouchableOpacity>
    )
    const renderItem = ({ item }) => (
      <Item 
        item={item}
        />
    );
    const Search = async () => {
        if(data.search ==''){
            getData()
        }
        const search = await data.all_data.filter(find => find.contact_name == data.search)
        // const search = await local_data["_W"].data.filter(find => find.contact_name == data.search)
        if(search){
            setData({
                all_data: search
            })
        }else{
            setData({
                all_data:  [
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
                      },
                      "current": {
                        "month_of": "",
                        "usage": ""
                      }
                    }
                  ]
            })
        }
    }
    return (
      <View style={styles.container}>
            <View style={{marginTop:10,height:30}}>
                <View style={{flex: 1, justifyContent: 'space-between',flexDirection: 'row'}}>
                    <TextInput 
                            placeholder="ស្វែងរកឈ្មោះ"
                            placeholderTextColor="#666666"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}
                    />
                    <TouchableOpacity style={{width: 70, marginLeft:4, backgroundColor: '#0eb3aa', padding:5}} onPress={()=> Search()}>
                        <Text>ស្វែងរក</Text>
                    </TouchableOpacity>
                </View>
             
            </View>
            <View style={{height:20}}>
                <View style={{flex: 1, justifyContent: 'space-around',flexDirection: 'row'}}>
                    <Text>សរុប​​: {data.all_data.length}</Text>
                </View>
            </View>
            <View style={{height:20}}>
                <View style={{flex: 1, justifyContent: 'space-around',flexDirection: 'row'}}>
                    <Text style={{flex: 1}}>លេខកុងទ័រ</Text>
                    <Text style={{flex: 2}}>ឈ្មោះ</Text>
                    <Text style={{flex: 1}}>អំណានចាស់</Text>
                    <Text style={{flex: 1}}>អំណានថ្មី</Text>
                </View>
            </View>
            <FlatList
                data={data.all_data}
                renderItem={renderItem}
                keyExtractor={(item) => item.number}
                initialNumToRender= {5}
            />
   
      </View>
    );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    marginHorizontal: 10
  },
  card1:{
    flex:1,
    flexDirection: 'row',
    justifyContent: "space-between",
    backgroundColor: 'green',
    paddingVertical: 14,
    paddingHorizontal: 8

  },
  overlay: {
    // position: "absolute",
    // top: 300,
    // zIndex: 100,
    // left: 130
  },
  box_overly:{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.2)'
  },
  text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 30
  },
  textInput: {
      flex: 1,
      paddingLeft: 10,
      height: 30,
      marginVertical: 0,
      backgroundColor: '#bcc2be',

  },
  table: {
    flex: 1, 
    justifyContent: 'space-around',
    flexDirection: 'row',
    borderBottomColor: '#808080',
    paddingVertical: 6,
    textAlign: 'left',
    borderBottomWidth: 1
  }
});
