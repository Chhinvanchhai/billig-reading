import React, {useEffect} from 'react';
import { View, StyleSheet ,Image } from 'react-native';
import {
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../components/context';   

export function DrawerContent(props) {
    const { signOut } = React.useContext(AuthContext);
    useEffect(() => {
        getAcess()
    },[]);
    const getAcess = async() => {
        const { status } = await Camera.requestPermissionsAsync();
    }
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{marginTop: 15}}>
                            <Image
                                style={{height: 60, width: 214}} 
                                    source={require('../assets/billing-app.png')
                                }
                            />
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={() => (
                                <Image style={{height: 30,width: 30}} source={require('../assets/reading2.png')}/>
                            )}
                            label={()=>(
                                <Text style={{fontSize: 18}}>អានអំណាន</Text>
                            )}
                            focused={true}
                            activeTintColor= '#c7c6c3'
                            inactiveTintColor="#fff"
                            onPress={() => {props.navigation.navigate('Home')}}
                           
                        />
                        {/* <View style={{flex: 1,flexDirection: 'row'}}>
                            <Image style={{height: 30,width: 30}} source={require('../assets/setting.png')}/>
                        </View> */}
                    
                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('ExploreScreen')}}
                        /> */}
                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Home Class"
                            onPress={() => {props.navigation.navigate('HomeClass')}}
                        /> */}
                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="cloud-download-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Sync Data"
                            onPress={() => SyncData()}
                        /> */}
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Image style={{height: 30,width: 30}} source={require('../assets/download.png')}/>
                            )}
                            label={()=>(
                                <Text style={{fontSize: 18}}>ទាញយកទិន្ន័យពីប្លុក</Text>
                            )}
                            focused={false}
                            activeTintColor= '#c7c6c3'
                            onPress={() => {props.navigation.navigate('Synce By Location')}}
                        />
                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="cloud-upload-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Upload Data"
                            onPress={() => UploadSynce()}
                        /> */}
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Image style={{height: 30,width: 30}} source={require('../assets/report.png')}/>
                            )}
                            label={()=>(
                                <Text style={{fontSize: 18}}>របាយការណ៍អំណាន</Text>
                            )}
                            focused={false}
                            activeTintColor= '#c7c6c3'
                            onPress={() =>  props.navigation.navigate('Preview')} 
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Image style={{height: 30,width: 30}} source={require('../assets/setting.png')}/>
                            )}
                            label={()=>(
                                <Text style={{fontSize: 18}}>ការកំណត់</Text>
                            )}
                            focused={false}
                            activeTintColor= '#c7c6c3'
                            onPress={() =>  props.navigation.navigate('Setting')}
                        
                        />
                    </Drawer.Section>
                    {/* <Drawer.Section>
                        <TouchableRipple onPress={() => toggleLight()}>
                            <View style={styles.preference}>
                                { !turnLight ?   <Icon name="lightbulb-outline" size={30}  color="#000"/>  : <Icon name="lightbulb-on-outline" style={styles.light} size={30} />}
                                <View pointerEvents="none">
                                    <Switch  value={turnLight}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section> */}
                   
                    
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
         
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 24,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        // borderTopColor: '#f4f4f4',
        // borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    light: {
        color: "#ffdc5e",
    },
  });
