import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { colors, fonts } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Display } from '../utils';
import Separator from '../components/separator';
import { useState } from 'react';
import Togglebutton from '../components/Togglebutton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';





const Signupscreen = ({ navigation }) => {
  const [isPasswordShow, setPasswordShow] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }
  
    try {
      // Check if the username is already taken
      const existingUsernameSnapshot = await firestore()
        .collection('users')
        .where('username', '==', username)
        .get();
  
      if (!existingUsernameSnapshot.empty) {
        setError('Username is already taken. Please choose a different username.');
        return;
      }
  
      // Check if the email is already registered
      const existingEmailSnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();
  
      if (!existingEmailSnapshot.empty) {
        setError('Email is already in use. Please use a different email.');
        return;
      }
  
      // Create user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      // Save user data to Firestore
      await firestore().collection('users').doc(user.uid).set({
        username,
        email,
        password,
        role:"user"
      });
  
      console.log('User created successfully:', username);
      navigation.navigate('Signin'); // Navigate to home screen after signup
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.DEFAULT_WHITE} translucent barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.cont1}>
          <Ionicons name="chevron-back-outline" size={30} onPress={() => navigation.goBack()} />
          <Text style={styles.signintitle}>Sign Up</Text>
        </View>

        <View style={styles.cont2}>
          <Text style={styles.welcometext}>Create Account</Text>
          <Text>Enter your name, email, and password to sign up.</Text>
          <Text style={styles.haveaccount} onPress={() => navigation.navigate('Signin')}>
            Already have an account?
          </Text>
        </View>

        <Separator height={2} color={colors.DEFAULT_WHITE} margin={0}/>

        <View style={styles.inputcontainer}>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Username Field */}
          <View style={styles.inputsubcontainer}>
            <Feather name="user" size={30} color={colors.DEFAULT_GREY} />
            <TextInput
              placeholder="Enter Username"
              placeholderTextColor={colors.DEFAULT_GREY}
              style={styles.inputtext}
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <Separator height={3} color={colors.DEFAULT_WHITE} margin={0} />

          {/* Email Field */}
          <View style={styles.inputsubcontainer}>
            <Feather name="mail" size={30} color={colors.DEFAULT_GREY} />
            <TextInput
              placeholder="Enter Email"
              placeholderTextColor={colors.DEFAULT_GREY}
              style={styles.inputtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <Separator height={3} color={colors.DEFAULT_WHITE} margin={0} />

          {/* Password Field */}
          <View style={styles.inputsubcontainer}>
            <Feather name="lock" size={30} color={colors.DEFAULT_GREY} />
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor={colors.DEFAULT_GREY}
              style={styles.inputtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordShow}
            />
            <Feather
              name={isPasswordShow ? 'eye' : 'eye-off'}
              size={25}
              color={colors.DEFAULT_GREY}
              onPress={() => setPasswordShow(!isPasswordShow)}
              style={{ marginRight: 10 }}
            />
          </View>

          {/* Signup Button */}
          <TouchableOpacity style={styles.signinbutton} onPress={handleSignUp}>
            <Text style={styles.signintext}>Create Account</Text>
          </TouchableOpacity>

          <Separator height={3} color={colors.DEFAULT_WHITE} />

          <Text style={styles.orstyle}>OR</Text>

          <Separator height={3} color={colors.DEFAULT_WHITE} />

          {/* Facebook Button */}
          <TouchableOpacity style={styles.fbcontainer}>
            <View style={styles.sociallogo}>
              <Ionicons name="logo-facebook" color={colors.DEFAULT_WHITE} size={30} />
            </View>
            <Text style={styles.fbtext}>Connect with Facebook</Text>
          </TouchableOpacity>

          <Separator height={3} color={colors.DEFAULT_WHITE} />

          {/* Google Button */}
          <TouchableOpacity style={styles.googlecontainer}>
            <View style={styles.sociallogo}>
              <Ionicons name="logo-google" color={colors.DEFAULT_WHITE} size={30} />
            </View>
            <Text style={styles.googletext}>Connect with Google</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.DEFAULT_WHITE,
    flex: 1,
  },
  cont1: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Display.setheight(7),
    width: Display.setwidth(100),
    paddingHorizontal: 10
  },
  signintitle: {
    width: Display.setwidth(80),
    textAlign: 'center',
    fontSize: 20,
    fontFamily: fonts.POPPINS_MEDIUM
  },

  welcometext: {
    fontSize: 35,
    fontFamily: fonts.POPPINS_LIGHT
  },
  cont2: {
    paddingHorizontal: 20,
    marginTop: 6,
  },
  inputcontainer: {

    paddingHorizontal: 18,
    paddingVertical: 20
  },
  inputsubcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.LIGHT_GREY,
    height: Display.setheight(8.2),
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.LIGHT_GREY2
  },
  inputtext: {
    color: colors.DEFAULT_BLACK,
    flex: 1,
    textAlignVertical: 'center'
  },
  
  signinbutton: {
    backgroundColor: colors.DEFAULT_GREEN,
    borderRadius: 8,
    height: Display.setheight(7),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signintext: {
    fontSize: 20,
    fontFamily: fonts.POPPINS_MEDIUM,
    color: colors.DEFAULT_WHITE
  },
  signupcontainer: {
    
    marginTop:20,
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'center'

  },
  orstyle:{
    color:colors.DEFAULT_GREY,
    textAlign:'center'
  },
  fbcontainer:{
   backgroundColor:colors.FABEBOOK_BLUE,
   justifyContent: 'center',
   alignItems: 'center',
   height:Display.setheight(7),
   borderRadius:8,
   flexDirection:'row'
  },
  fbtext:{
     color:colors.DEFAULT_WHITE,
     
    },
  googlecontainer:{
    backgroundColor:colors.GOOGLE_BLUE,
   justifyContent: 'center',
   alignItems: 'center',
   height:Display.setheight(7),
   borderRadius:8,
   flexDirection:'row',
   
  },
  googletext:{
    color:colors.DEFAULT_WHITE,
   },
   sociallogo:{
    position:'absolute',
    left:25
   },
   toggleandremember:{
    flexDirection:'row',
    alignItems:'center'
   },
   haveaccount:{
    color:colors.DEFAULT_GREEN
   },
   error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },

});

export default Signupscreen;