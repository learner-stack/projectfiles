import React, {Component, useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Alert
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {Picker} from '@react-native-picker/picker';
import {windowHeight, windowWidth} from '../utils/Dimensions';
import { EvilIcons } from '@expo/vector-icons'; 
import Loader from '../components/Loader';

class LoginScreen extends Component{


  constructor(props){
    super(props);
    this.state={
        Email:'',
        Password:'',
        dataSource:[],
        PickerValueHolder : '',
        emailError:'',
        invalidError:'',
        message:'',
    }
    this.Login = this.Login.bind(this)
  }
  
  
  componentDidMount() {
   
      return fetch('http://192.168.43.114:8000/api/roles/')
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            dataSource: responseJson
          }, function() {
            // In this block you can do something with new state.
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }

    Login = () =>{
      const currentContext = this;
      this.message = null;
      const member_id = this.state.PickerValueHolder;

      fetch('http://192.168.43.114:8000/api/login/'+member_id,{
                method:'POST',
                body:JSON.stringify({        
                    "email" : this.state.Email,
                    "password" : this.state.Password,
            }),
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json; charset=UTF-8'
                }
            })
            .then(function(response){
                response.json()
                .then(function(resp){
                    if(resp.role === "admin"){
                      //Navigation route for admin dashboard. . . .
                      alert("Admin");
                    }
                    else if(resp.role === "employee"){
                      alert("Employee");
                    }
                    else{
                      alert("Invalid Email and Password");
                    }
                
                })
            })
       
      
    }

 
  render()
  {
  return (
    <KeyboardAvoidingView enabled>
    <ImageBackground source={require('../assets/background.jpeg')} style={styles.image}>  
    <ScrollView contentContainerStyle={styles.container}>
    
      <Image
        source={require('../assets/rn-social-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>My App</Text>
      <View style={styles.inputContainer}>
        <View style={styles.iconStyle}>
            <EvilIcons name="check" size={25} color="black" />
        </View>
        <Picker style={styles.DropdownContainer}
            selectedValue={this.state.PickerValueHolder}
 
            onValueChange={(itemValue, itemIndex) => this.setState({PickerValueHolder: itemValue})} >
 
            {this.state.dataSource.map((item, key)=>(
            <Picker.Item style={styles.input} label={item.role_name} value={item.id} key={key} />)
            )}
    
          </Picker>
    </View>
      
      <FormInput
       
        onChangeText={(Email)=>this.setState({Email})}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        returnKeyType="next"
        autoCapitalize="none"
        blurOnSubmit={false}
        autoCorrect={false}
      />

      <FormInput
        
        onChangeText={(Password)=>this.setState({Password})}
        placeholderText="Password"
        iconType="lock"
        blurOnSubmit={false}
        secureTextEntry={true}
        returnKeyType="next"
      />

      <FormButton
        buttonTitle="Sign In"
        onPress={()=>this.Login()}
      />

      <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>
    
    </ScrollView>
    </ImageBackground>
    </KeyboardAvoidingView>
  );
}
}


export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
   // fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#C70039',
  //  fontFamily: 'Lato-Regular',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  invalidError:{
    color: 'red',
    marginTop:5,
    width:"100%",
    textAlign:"center",
    fontSize: 20,
  //  fontFamily: 'Lato-Regular'
  },
  backgroundImage:{
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.3,
    flex: 1,
    resizeMode: 'cover',
},
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  DropdownContainer: {
    marginTop: 12,
    marginBottom: 13,
    width: '100%',
    height: windowHeight / 15,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
  //  fontFamily: 'Lato-Regular',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    width: 50,
  },

  errorTextStyle: {
    color: 'red',
    //flex:0.3,
   // marginLeft:0,
  // width:"100%",
   //textAlign:"left",
    fontSize: 15,
    //fontFamily: 'Lato-Regular'
  },
});
