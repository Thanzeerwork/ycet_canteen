import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Display } from '../utils';
import Separator from '../components/separator';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';

import { useState } from 'react';



const Registerphone = () => {
    const navigation = useNavigation()
    const [phoneNumber, setphoneNumber] = useState()
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.DEFAULT_WHITE} translucent barStyle={'dark-content'} />
            <SafeAreaView>
                <View style={styles.cont1}>
                    <Ionicons name="chevron-back-outline" size={30} onPress={() => navigation.navigate("Signup")} />
                    <Text style={styles.titletext}>Register phone</Text>
                </View>
                <View style={styles.maincontainer}>
                    <Separator height={8} color={colors.DEFAULT_WHITE} margin={0} />

                    <Text style={styles.contenttext}>Enter Your Registered Phone Number to Login</Text>

                    <Separator height={8} color={colors.DEFAULT_WHITE} margin={0} />

                    <View style={styles.inputcontainer}>

                        <Text style={styles.countrycode}>+91</Text>
                        <TextInput
                            style={styles.phonenumber}
                            keyboardType='number-pad'
                            placeholder='Enter your Phone number'
                            placeholderTextColor={colors.LIGHT_GREY2}
                            onChangeText={(text) => setphoneNumber('+91' + text)}
                        />

                    </View>
                    <Separator height={8} color={colors.DEFAULT_WHITE} margin={0} />

                    <TouchableOpacity
                        style={styles.signinbutton}
                        onPress={() => { console.log(phoneNumber), navigation.navigate('Verification',{phoneNumber}) }
                        }>
                        <Text style={styles.signintext}>Register</Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
            <View style={styles.countrydropdown}></View>
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
    titletext: {
        width: Display.setwidth(80),
        textAlign: 'center',
        fontSize: 20,
        fontFamily: fonts.POPPINS_MEDIUM
    },
    maincontainer: {
        marginHorizontal: 20,

        height: Display.setheight(100),

    },
    contenttext: {
        fontFamily: fonts.POPPINS_MEDIUM,
        fontSize: 20,

    },
    inputcontainer: {
        backgroundColor: colors.DEFAULT_RED,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 15,
        height: Display.setheight(10),
        backgroundColor: colors.LIGHT_GREY
    },


    countrycode: {
        padding: 25
    },
    phonenumber: {
        color: colors.DEFAULT_BLACK,
        borderBottomWidth: 2, // Thickness of the underline
        borderBottomColor: colors.DEFAULT_GREY
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

});

export default Registerphone;