import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { colors, fonts } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Display } from '../utils';
import Separator from '../components/separator';
import { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const VerificationScreen = ({ route }) => {
    const { phoneNumber } = route.params; // Access the phoneNumber
    const navigation = useNavigation()
    const firstinput = useRef()
    const secondinput = useRef()
    const thirdinput = useRef()
    const fourthinput = useRef()
    const [otp, setotp] = useState({ 1: '', 2: '', 3: '', 4: '' })

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.DEFAULT_WHITE} translucent barStyle={'dark-content'} />
            <SafeAreaView>

                <View style={styles.cont1}>
                    <Ionicons name="chevron-back-outline" size={30} onPress={() => navigation.goBack()} />
                    <Text style={styles.Forgettitle}>Verification</Text>
                </View>

                <View style={styles.cont2}>
                    <Text style={styles.Forgettext}> Verification</Text>
                    <Text>Enter the OTP Code from the phone we just sent you at {''}
                        <Text style={styles.phonenumberstyle}>{phoneNumber}</Text>
                    </Text>
                    <Separator height={4} color={colors.DEFAULT_WHITE} margin={0} />
                     <Text>Did you enter the correct number?</Text>
                    <Separator height={10} color={colors.DEFAULT_WHITE} margin={0} />

                    <View style={styles.otpcontainer}>

                        <View style={styles.otpbox}>
                            <TextInput
                                style={styles.otptextstyle}
                                keyboardType="number-pad"
                                maxLength={1}
                                ref={firstinput}
                                onChangeText={(text) => {
                                    setotp({ ...otp, 1: text })
                                    text && secondinput.current.focus()
                                }}

                            />
                        </View>
                        <View style={styles.otpbox}>
                            <TextInput
                                style={styles.otptextstyle}
                                keyboardType="number-pad"
                                maxLength={1}
                                ref={secondinput}
                                onChangeText={(text) => {
                                    setotp({ ...otp, 2: text })
                                    text && thirdinput.current.focus()
                                    !text && firstinput.current.focus()
                                }} />
                        </View>
                        <View style={styles.otpbox}>
                            <TextInput
                                style={styles.otptextstyle}
                                keyboardType="number-pad"
                                maxLength={1}
                                ref={thirdinput}
                                onChangeText={(text) => {
                                    setotp({ ...otp, 3: text })
                                    text && fourthinput.current.focus()
                                    !text && secondinput.current.focus()
                                }} />
                        </View>
                        <View style={styles.otpbox}>
                            <TextInput
                                style={styles.otptextstyle}
                                keyboardType="number-pad"
                                maxLength={1}
                                ref={fourthinput}
                                onChangeText={(text) => {
                                    setotp({ ...otp, 4: text })
                                    !text && thirdinput.current.focus()
                                }}
                            />
                        </View>

                    </View>
                    <TouchableOpacity style={styles.verifybutton} onPress={() => console.log(otp)}>
                        <Text style={styles.verifytext}>Verify</Text>
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
    Forgettitle: {
        width: Display.setwidth(80),
        textAlign: 'center',
        fontSize: 20,
        fontFamily: fonts.POPPINS_MEDIUM
    },
    cont2: {
        paddingHorizontal: 20,
        marginTop: 6,
    },
    Forgettext: {
        fontSize: 35,
        fontFamily: fonts.POPPINS_LIGHT
    },
    inputcontainer: {

        paddingHorizontal: 0,
        paddingVertical: 0
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
    verifybutton: {
        backgroundColor: colors.DEFAULT_GREEN,
        borderRadius: 8,
        height: Display.setheight(7),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    verifytext: {
        fontSize: 20,
        fontFamily: fonts.POPPINS_MEDIUM,
        color: colors.DEFAULT_WHITE
    },
    phonenumberstyle: {
        color: colors.DEFAULT_YELLOW
    },
    otpcontainer: {
        marginBottom: 20,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
    },
    otpbox: {
        borderRadius: 5,
        borderColor: colors.DEFAULT_GREEN,
        borderWidth: 0.5,
        width: Display.setwidth(14),
        height: Display.setheight(6.5),
        justifyContent: 'center'

    },
    otptextstyle: {
        color: colors.DEFAULT_BLACK,
        fontSize: 25,
        padding: 0,
        textAlign: "center",
    },
});

export default VerificationScreen;