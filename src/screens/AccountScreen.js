import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, images } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Display } from '../utils';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ToggleButton } from '../components';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const AccountScreen = ({ navigation }) => {
    const [userData, setUserData] = useState({ username: '', email: '' });

    useFocusEffect(
        React.useCallback(() => {
            const updateStatusBar = () => {
                StatusBar.setBackgroundColor(colors.DEFAULT_GREEN);
                StatusBar.setBarStyle("light-content");
            };

            const timeout = setTimeout(updateStatusBar, 50); // Small delay to ensure proper update

            return () => {
                clearTimeout(timeout); // Clear timeout if unmounting quickly
                StatusBar.setBackgroundColor(colors.DEFAULT_GREEN);
                StatusBar.setBarStyle("dark-content");
            };
        }, [])
    );


    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth().currentUser; // Get the current user
            if (user) {
                try {
                    const userDoc = await firestore().collection('users').doc(user.uid).get();
                    if (userDoc.exists) {
                        setUserData(userDoc.data()); // Set name and email from Firestore
                    } else {
                        console.log('No user data found in Firestore.');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <View style={styles.container}>
            <SafeAreaView>

                <View style={styles.curvedcontainer} />


                <View style={styles.headerContainer}>
                    <Ionicons name="chevron-back-outline" size={25} color={colors.DEFAULT_WHITE} onPress={() => navigation.goBack()} />
                    <Text style={styles.headerText}>Profile</Text>
                    <View>
                        <Feather name="bell" size={20} color={colors.DEFAULT_WHITE} />
                        <View style={styles.alertBadge}>
                            <Text style={styles.alertBadgeText}>12</Text>
                        </View>
                    </View>
                </View>

                {/*profile container*/}
                <View style={styles.profileHeaderContainer}>
                    <View style={styles.profileImageContainer}>
                        <Image style={styles.profileImage} source={images.AVATAR} />
                    </View>
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.nameText}>{userData.username || 'Loading...'}</Text>
                        <Text style={styles.emailText}>{userData.email || 'Loading...'}</Text>
                    </View>
                </View>

                {/* menu Container */}
                <View style={styles.menuContainer}>

                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.2}>
                        <View style={styles.menuIcon}>
                            <MaterialCommunityIcons
                                name="truck-fast-outline"
                                size={18}
                                color={colors.DEFAULT_GREEN}
                            />
                        </View>
                        <Text style={styles.menuText}>My All {'\n'}Orders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.2} onPress={() => alert("Promo code feature coming soon!")}>
                        <View style={{ ...styles.menuIcon, backgroundColor: colors.LIGHT_RED }}>
                            <MaterialCommunityIcons
                                name="gift-outline"
                                size={18}
                                color={colors.SECONDARY_RED}
                            />
                        </View>
                        <Text style={styles.menuText}>Offers {'&\n'} Promos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.2}>
                        <View
                            style={{ ...styles.menuIcon, backgroundColor: colors.LIGHT_YELLOW }}>
                            <Ionicons
                                name="location-outline"
                                size={18}
                                color={colors.DEFAULT_YELLOW}
                            />
                        </View>
                        <Text style={styles.menuText}>Delivery {'\n'}Addresses</Text>
                    </TouchableOpacity>

                </View>
                {/*main container*/}
                <View style={styles.mainContainer}>
                    <Text style={styles.sectionHeaderText}>My Account</Text>

                    <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}  onPress={() => navigation.navigate("ManageProfile")}>
                        <View style={styles.sectionTextContainer}>
                            <Ionicons
                                name="person-outline"
                                size={18}
                                color={colors.DEFAULT_GREEN}
                            />
                            <Text style={styles.sectionText}>Manage Profile</Text>
                        </View>
                        <Feather
                            name="chevron-right"
                            color={colors.INACTIVE_GREY}
                            size={20}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8} onPress={() => navigation.navigate("PaymentScreen")}>
                        <View style={styles.sectionTextContainer}>
                            <Ionicons
                                name="card-outline"
                                size={18}
                                color={colors.DEFAULT_GREEN}
                            />
                            <Text style={styles.sectionText}>Payment</Text>
                        </View>
                        <Feather
                            name="chevron-right"
                            color={colors.INACTIVE_GREY}
                            size={20}
                        />
                    </TouchableOpacity>

                    <Text style={styles.sectionHeaderText}>Notification</Text>
                    <View style={styles.sectionContainer} activeOpacity={0.8}>
                        <View style={styles.sectionTextContainer}>
                            <Feather name="bell" size={18} color={colors.DEFAULT_GREEN} />
                            <Text style={styles.sectionText}>Notification</Text>
                        </View>
                        <ToggleButton size={40} onColor={colors.DEFAULT_GREEN} offColor={colors.DEFAULT_GREY}/>
                    </View>
                    <View style={styles.sectionContainer} activeOpacity={0.8}>
                        <View style={styles.sectionTextContainer}>
                            <Feather name="bell" size={18} color={colors.DEFAULT_GREEN} />
                            <Text style={styles.sectionText}>Promos & Offers Notification</Text>
                        </View>
                        <ToggleButton size={40} onColor={colors.DEFAULT_GREEN} offColor={colors.DEFAULT_GREY}/>
                    </View>

                    <Text style={styles.sectionHeaderText}>More</Text>
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity
                            style={styles.sectionContainer}
                            activeOpacity={0.8}
                            onPress={() => {
                                Alert.alert(
                                    "Confirm Logout",
                                    "Are you sure you want to logout?",
                                    [
                                        {
                                            text: "Cancel",
                                            style: "cancel",
                                            
                                        },
                                        {
                                            text: "Logout",
                                            onPress: async () => {
                                                try {
                                                    await auth().signOut();
                                                } catch (error) {
                                                    console.error('Logout Error:', error);
                                                }
                                            },
                                            style: "destructive",
                                            
                                        }
                                    ]
                                );
                            }}
                        >
                            <View style={styles.sectionTextContainer}>
                                <MaterialCommunityIcons
                                    name="logout"
                                    size={18}
                                    color={colors.DEFAULT_GREEN}
                                />
                                <Text style={styles.sectionText}>Logout</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>



            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.SECONDARY_WHITE,
    },
    curvedcontainer: {
        backgroundColor: colors.DEFAULT_GREEN,
        height: 2000,
        position: 'absolute',
        top: -1 * (2000 - 230),
        width: 2000,
        borderRadius: 2000,
        alignSelf: 'center',
        zIndex: -1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingTop: 5,
    },
    headerText: {
        fontSize: 20,
        fontFamily: fonts.POPPINS_MEDIUM,
        lineHeight: 20 * 1.4,
        color: colors.DEFAULT_WHITE,
    },
    alertBadge: {
        backgroundColor: colors.DEFAULT_YELLOW,
        position: 'absolute',
        height: 16,
        width: 16,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        right: -2,
        top: -10,
    },
    alertBadgeText: {
        fontSize: 10,
        fontFamily: fonts.POPPINS_BOLD,
        lineHeight: 10 * 1.4,
        color: colors.DEFAULT_WHITE,
    },
    profileHeaderContainer: {
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    profileImageContainer: {
        backgroundColor: colors.DEFAULT_WHITE,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
        elevation: 3,
    },
    profileImage: {
        width: Display.setwidth(15),
        height: Display.setwidth(16),
        borderRadius: 32,
    },
    profileTextContainer: {
        marginLeft: 10,
    },
    nameText: {
        fontSize: 14,
        fontFamily: fonts.POPPINS_REGULAR,
        lineHeight: 14 * 1.4,
        color: colors.DEFAULT_WHITE,
    },
    emailText: {
        fontSize: 10,
        fontFamily: fonts.POPPINS_REGULAR,
        lineHeight: 10 * 1.4,
        color: colors.DEFAULT_WHITE,
    },
    menuContainer: {
        backgroundColor: colors.DEFAULT_WHITE,
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 20,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    menuItem: {
        flex: 1,
        alignItems: 'center',
    },
    menuIcon: {
        backgroundColor: colors.LIGHT_GREEN,
        height: Display.setwidth(8),
        width: Display.setwidth(8),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 32,
    },
    menuText: {
        fontSize: 12,
        fontFamily: fonts.POPPINS_SEMI_BOLD,
        lineHeight: 12 * 1.4,
        color: colors.DEFAULT_BLACK,
        textAlign: 'center',
        marginTop: 5,
    },
    mainContainer: {
        marginHorizontal: 20,
        marginTop: 10,
        backgroundColor: colors.DEFAULT_WHITE,
        elevation: 3,
        paddingHorizontal: 20,
        borderRadius: 10,
        paddingBottom: 20,
    },
    sectionHeaderText: {
        fontSize: 14,
        fontFamily: fonts.POPPINS_SEMI_BOLD,
        lineHeight: 14 * 1.4,
        color: colors.DEFAULT_BLACK,
        marginTop: 25,
    },
    sectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    sectionTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionText: {
        fontSize: 13,
        fontFamily: fonts.POPPINS_REGULAR,
        lineHeight: 13 * 1.4,
        color: colors.INACTIVE_GREY,
        marginLeft: 10,
    },
});

export default AccountScreen;
