import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { colors, fonts } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Display } from '../utils';
import Separator from '../components/separator';
import Togglebutton from '../components/Togglebutton';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'; // Import Firebase Authentication
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';



const Signinscreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ispasswordshow, setpasswordshow] = useState(false);
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState(''); // ❗ Error message state

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1010563649090-fhfgeshinaet2ajl2ouc3dcnenrmhqb4.apps.googleusercontent.com', // From Firebase
      offlineAccess: true,
    });
  }, []);
  

  const handleSignIn = async () => {
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
  
    try {
      // Sign in using Firebase Authentication
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      console.log('User signed in successfully:', user.email);
  
      // Check if the user is an admin
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      const userData = userDoc.data();
      console.log(userData)
    
      // Display success message
      Alert.alert('Success', `Welcome back, ${user.email}!`, [
        {
          text: 'Continue',
        },
      ]);
    } catch (error) {
      //console.error(error);
      setErrorMessage('The password or Gmail is incorrect'); // ❗ Display error message above email input
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  
      const { idToken } = await GoogleSignin.signIn();
  
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
  
      console.log('Google Sign-In success:', userCredential.user.email);
      Alert.alert('Success', `Welcome back, ${userCredential.user.email}!`);
      
    } catch (error) {
      // Log the full error for debugging
      console.log('Google Sign-In Error:', JSON.stringify(error, null, 2));
  
      // Safe error handling
      const errorMsg =
        error?.code
          ? `Error code: ${error.code}\n${error.message}`
          : 'Something went wrong during Google sign-in.';
  
      Alert.alert('Google Sign-In Failed', errorMsg);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.DEFAULT_WHITE}
        translucent
        barStyle={'dark-content'}
      />
      <SafeAreaView>
        <View style={styles.cont1}>
          <Ionicons
            name="chevron-back-outline"
            size={30}
            onPress={() => navigation.navigate('Welcome')}
          />
          <Text style={styles.signintitle}>Sign in</Text>
        </View>

        <View style={styles.cont2}>
          <Text style={styles.welcometext}>Welcome to</Text>
          <Text style={{color:colors.DEFAULT_BLACK}}>
            Enter your Email address and password to sign in. Enjoy your Food!
          </Text>
        </View>

        <Separator height={5} color={colors.DEFAULT_WHITE} margin={0} />

        <View style={styles.inputcontainer}>
           {/* ❗ Display Error Message */}
           {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <View style={styles.inputsubcontainer}>
            <Feather name="mail" size={30} color={colors.DEFAULT_GREY} />
            <TextInput
              placeholder="Enter email"
              placeholderTextColor={colors.DEFAULT_GREY}
              style={styles.inputtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Separator height={3} color={colors.DEFAULT_WHITE} margin={0} />

          <View style={styles.inputsubcontainer}>
            <Feather name="lock" size={30} color={colors.DEFAULT_GREY} />
            <TextInput
              placeholder="Enter password"
              placeholderTextColor={colors.DEFAULT_GREY}
              style={styles.inputtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!ispasswordshow}
              autoCapitalize="none"
            />
            <Feather
              name={ispasswordshow ? 'eye' : 'eye-off'}
              size={25}
              color={colors.DEFAULT_GREY}
              onPress={() => setpasswordshow(!ispasswordshow)}
              style={{ marginRight: 10 }}
            />
          </View>

          <View style={styles.forgotpasswordcontainer}>
            <View style={styles.toggleandremember}>
              <Togglebutton
                offColor={colors.DEFAULT_GREY}
                onColor={colors.DEFAULT_GREEN}
                size={35}
              />
              <Text style={styles.remembermestyle}>Remember Me</Text>
            </View>
            <Text
              style={styles.forgotpasswordtext}
              onPress={() => navigation.navigate('Forgetpassword')}
            >
              Forgot Password?
            </Text>
          </View>

          <TouchableOpacity style={styles.signinbutton} onPress={handleSignIn}>
            <Text style={styles.signintext}>Sign in</Text>
          </TouchableOpacity>

          <View style={styles.signupcontainer}>
            <Text style={{color:colors.DEFAULT_BLACK}}>Don't have an account?</Text>
            <Text
              style={{ color: colors.DEFAULT_GREEN }}
              onPress={() => navigation.navigate('Signup')}
            >
              Sign Up
            </Text>
          </View>

          <Separator height={2.8} color={colors.DEFAULT_WHITE} />

          <Text style={styles.orstyle}>OR</Text>

          <Separator height={2.8} color={colors.DEFAULT_WHITE} />

          <TouchableOpacity style={styles.fbcontainer}>
            <View style={styles.sociallogo}>
              <Ionicons
                name="logo-facebook"
                color={colors.DEFAULT_WHITE}
                size={30}
              />
            </View>
            <Text style={styles.fbtext}>Connect with Facebook</Text>
          </TouchableOpacity>

          <Separator height={3.5} color={colors.DEFAULT_WHITE} />

          <TouchableOpacity style={styles.googlecontainer} onPress={handleGoogleSignIn}>
            <View style={styles.sociallogo}>
              <Ionicons name="logo-google" color={colors.DEFAULT_WHITE} size={30} />
            </View>
            <Text style={styles.googletext}>Connect with Google</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};



 

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
    fontFamily:fonts.POPPINS_MEDIUM,
    color:colors.DEFAULT_BLACK
  },

  welcometext: {
    fontSize: 35,
    fontFamily: fonts.POPPINS_LIGHT,
    color:colors.DEFAULT_BLACK
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
  forgotpasswordcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  remembermestyle: {
    color: colors.DEFAULT_GREY,
  },
  forgotpasswordtext: {
    color: colors.DEFAULT_GREEN,
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
    justifyContent:'center',
    

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
   errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
    fontFamily: fonts.POPPINS_MEDIUM,
  },

});

export default Signinscreen;