import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { colors, fonts } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Display } from '../utils';
import Separator from '../components/separator';

const Forgetpasswordscreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.DEFAULT_WHITE} translucent barStyle={'dark-content'} />
            <SafeAreaView>

                <View style={styles.cont1}>
                    <Ionicons name="chevron-back-outline" size={30} onPress={() => navigation.goBack()} />
                    <Text style={styles.Forgettitle}>Forget Password</Text>
                </View>

                <View style={styles.cont2}>
                    <Text style={styles.Forgettext}>Forget Password</Text>
                    <Text>Please enter your email.So we can help you recover your password</Text>
                    <Separator height={15} color={colors.DEFAULT_WHITE} margin={0} />

                    <View style={styles.inputcontainer}>
                        <View style={styles.inputsubcontainer}>
                            <Feather name="user" size={30} color={colors.DEFAULT_GREY} />
                            <TextInput placeholder="Enter Email" placeholderTextColor={colors.DEFAULT_GREY} style={styles.inputtext} />
                        </View>
                        <Separator height={5} color={colors.DEFAULT_WHITE} margin={0} />
                        <TouchableOpacity style={styles.resetbutton}>
                            <Text style={styles.resettext}>Reset Password</Text>
                        </TouchableOpacity>
                    </View>
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
    resetbutton: {
        backgroundColor: colors.DEFAULT_GREEN,
        borderRadius: 8,
        height: Display.setheight(7),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      resettext: {
        fontSize: 20,
        fontFamily: fonts.POPPINS_MEDIUM,
        color: colors.DEFAULT_WHITE
      },
});

export default Forgetpasswordscreen;