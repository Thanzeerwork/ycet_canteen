import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, Image } from "react-native";
import { colors, fonts, images } from "../constants";
import { Display } from "../utils";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulate a short delay before navigating to the SignIn screen
    const timer = setTimeout(() => {
      navigation.replace("Signin"); // Navigate to SignIn screen
    }, 8000); // 2 seconds delay

    return () => clearTimeout(timer); // Clear timeout on component unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
       <StatusBar
              backgroundColor={colors.DEFAULT_GREEN}
              translucent
              barStyle={'dark-content'}
            />
      <Image
        source={images.PLATE}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>Ycet Canteen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.DEFAULT_GREEN,
  },
  image: {
    height: Display.setheight(30),
    width: Display.setwidth(50),
  },
  text: {
    color: colors.DEFAULT_WHITE,
    fontSize: 32,
    fontFamily: fonts.POPPINS_LIGHT,
  },
});

export default SplashScreen;
