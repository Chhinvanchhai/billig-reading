import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Image,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import LinearGradient from 'react-native-linear-gradient';
import {LinearGradient} from 'expo-linear-gradient'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';
import { AuthContext } from '../components/context';
import { showMessage } from "react-native-flash-message";
import {validateIsEmail } from '../utitls/Options'
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-community/async-storage';
import {  Overlay } from 'react-native-elements';

const SignInScreen = ({navigation}) => {
    
    const { signIn } = React.useContext(AuthContext);
    const [data, setData] = React.useState({
        username: '',
        password: '',
        email: '',
        errorMessage: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });
    const [visible, setVisible] = React.useState(false);
    const [url, setURL] = React.useState('http://192.168.0.28:3000/')
    const toggleOverlay = () => {
        setVisible(!visible);
    }
    const { colors } = useTheme();
    const textInputChange = (val) => {
        let valid = validateIsEmail(val)
        if(valid) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const loginHandle = async (userName, password) => {
        if(userName == '' && password == ''){
            alert("សូមបំពេញទម្រង់បែបបទ")
            return
        }
        let valid = validateIsEmail(data.username)
        if(!valid){
            setData({
                ...data,
                isValidUser: true
            });
            alert("អ៊ីមែលរបស់អ្នកមិនត្រឹមត្រូវ។")
            return
        }else{
            setData({
                ...data,
                isValidUser: false
            });
        }

        setVisible(!visible);
        setData({
            ...data,
            isValidUser: true
        });
        signIn(userName,password).then( async ()=>{
            const user = await AsyncStorage.getItem('@banhji_user')
            if(user != null){
                setVisible(false);
            }else{
                setVisible(false);
                showMessage({
                    message: "Failed",
                    description: "​ការចូលមិនជោគជ័យទេ",
                    type: "warning",
                })
            }
        })
    }
    const textURLChange = (val) => {
        setURL(val)
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

    return (
        <ScrollView>
            <View style={styles.container}>
                <StatusBar backgroundColor='#5fb3e4' barStyle="light-content"/>
                <View style={styles.header}>
                    <Image  style={{height: 60, width: 214}} 
                            source={require('../assets/billing-app.png') }
                    />
                </View>
            
                    <Animatable.View 
                    animation="fadeInUpBig"
                    style={[styles.footer, {
                        backgroundColor: colors.background
                    }]}
                >
                    <Text style={[styles.text_footer, {
                        color: colors.text
                    }]}>អ៊ីមែល</Text>
                    <View style={styles.action}>
                        <FontAwesome 
                            name="user-o"
                            color={colors.text}
                            size={20}
                        />
                        <TextInput 
                            placeholder="Your Email"
                            placeholderTextColor="#666666"
                            maxLength={40}
                            style={[styles.textInput, {
                                color: colors.text
                            }]}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}
                            onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                        />
                        {data.check_textInputChange ? 
                        <Animatable.View
                            animation="bounceIn"
                        >
                            <Feather 
                                name="check-circle"
                                color="green"
                                size={20}
                            />
                        </Animatable.View>
                        : null}
                    </View>
                    { data.isValidUser ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>អ៊ីមែលរបស់អ្នកមិនត្រឹមត្រូវ។</Text>
                    </Animatable.View>
                    }
                    

                    <Text style={[styles.text_footer, {
                        color: colors.text,
                        marginTop: 35
                    }]}>លេខសំងាត់</Text>
                    <View style={styles.action}>
                        <Feather 
                            name="lock"
                            color={colors.text}
                            size={20}
                        />
                        <TextInput 
                            placeholder="Your Password"
                            placeholderTextColor="#666666"
                            maxLength={16}
                            secureTextEntry={data.secureTextEntry ? true : false}
                            style={[styles.textInput, {
                                color: colors.text
                            }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateSecureTextEntry}
                        >
                            {data.secureTextEntry ? 
                            <Feather 
                                name="eye-off"
                                color="grey"
                                size={20}
                            />
                            :
                            <Feather 
                                name="eye"
                                color="grey"
                                size={20}
                            />
                            }
                        </TouchableOpacity>
                    </View>
                    { data.isValidPassword ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>លេខសម្ងាត់ត្រូវតែមាន4តួអក្សរឬវែងជាងនេះ។</Text>
                    </Animatable.View>
                    }
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => {loginHandle( data.username, data.password )}}
                        >
                        <LinearGradient
                            colors={['#1c3d6e', '#1c3d6e']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, {
                                color:'#fff'
                            }]}>Sign In</Text>
                        </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    {/* for save url */}
                    <Text>URL</Text>
                    <TextInput 
                        placeholder="url"
                        placeholderTextColor="#666666"
                        style={styles.textInput2}
                        value={url}
                        autoCapitalize="none"
                        onChangeText={(val) =>textURLChange(val)}
                    />
                    <TouchableOpacity
                        style={{ backgroundColor: 'green',width: 100,padding: 5 }}
                        onPress={() => Save()}
                    >
                        <Text style={{color: '#fff'}}>Save</Text>
                    </TouchableOpacity>
                </Animatable.View>
            
                <Overlay overlayStyle={{backgroundColor: 'none',elevation:0}} isVisible={visible} onBackdropPress={toggleOverlay}  fullScreen={false} >
                    <View style={styles.overlay}>
                            <View>
                                <Text style={{fontSize: 26,textAlign: 'center',marginBottom: 10,color:"#fff"}}>ផ្ទៀងផ្ទាត់ដើម្បីចូលប្រព័ន្ន</Text>
                                <ActivityIndicator  size="large" color="#1c3d6e" />
                            </View>
                    </View>
                </Overlay>
            </View>
      </ScrollView>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#5fb3e4'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        marginTop: 40,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
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
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
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
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
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
    overlay: {
        justifyContent: "center",
        alignContent: "center"   
    }
  });
