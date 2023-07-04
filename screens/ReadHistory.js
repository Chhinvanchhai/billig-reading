import React, {useEffect} from 'react'
import {View,Text, StyleSheet , VirtualizedList} from 'react-native'
import * as Animatable from 'react-native-animatable';
import * as FileSystem from 'expo-file-system';

const ReadHistory = ({ route, navigation }) => {
    useEffect(()=> {
        History()
        // localData()
    },[] )
    const [readHistory, SetReadHistory] = React.useState([
        {
            "date": "",
            "id": "",
            "name": "",
            "read": "",
        }
    ])
    const History = async () => {
        const doc = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        var history_isExist_= false
        doc.forEach(item => {
            if(item == 'read_history.json'){
                 history_isExist_ = true
                 return true;
            }
        })
        // setIsExist(history_isExist_)
        if(history_isExist_){
            var get_save_hostory_load = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'read_history.json');
            if(get_save_hostory_load != null){
                SetReadHistory(JSON.parse(get_save_hostory_load))
            }
        }
    }

    const getItem = (data, index) => {
        var data_ = data[index]
        data_['key'] = index.toString()
        return data_
    }
      
    const getItemCount = (data) => {
     return data.length;
    }
    
    const Item = ({ item })=> {
    return (
        <View>
            <View style={{height: 20,marginTop:10}}>
                <Text style={{fontSize: 16, flex: 1}}>ថ្ងៃខែ: {item.date}</Text>
            </View>
            <View style={styles.row_border}>
                <View style={{flex: 1 ,flexDirection: 'row' ,marginVertical: 3}}>
                    <Text style={{fontSize: 16,flex: 1}}>ប្លុក-ទីតាំងរង: </Text>
                    <Text style={styles.read_result}>{item.name}</Text>
                </View>
            </View>
        </View>
   
     );
    }
    return (
        <View style={styles.container}>

            <VirtualizedList
                    data={readHistory}
                    initialNumToRender={5}
                    renderItem={({ item })  => <Item item={item} />}
                    keyExtractor={item => item.key}
                    getItemCount={getItemCount}
                    getItem={getItem}
                />
        </View>
    )
}
export default ReadHistory

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
        marginTop: 10,
        color: 'white',
        height: 40,
        marginVertical: 10,
        marginHorizontal: 10
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
    }
})
