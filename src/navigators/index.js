import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import auth from "@react-native-firebase/auth";
import SplashScreen from "../screens/splashscreen";
import welcomescreen from "../screens/welcomescreen";
import Signinscreen from "../screens/Signinscreen";
import Signupscreen from "../screens/Signupscreen";
import Forgetpasswordscreen from "../screens/Forgetpasswordscreen";
import Registerphone from "../screens/Registerphone";
import VerificationScreen from "../screens/VerificationScreen";
import AdminHome from "../screens/adminhome";
import Adminaddfood from "../screens/adminaddfood";
import AdminHomeTabs from "./AdminBottomTabs"
import HomeTabs from './BottomTabs';
import ProductDetails from "../screens/ProductDetails";
import ManageProfileScreen from "../screens/ManageProfile";
import CartScreen from "../screens/CartScreen";
import PaymentMethodScreen from "../screens/PaymentScree";




const Stack = createStackNavigator();

const Navigators = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Display the splash screen for 2 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    // Listen for authentication state changes
    const subscriber = auth().onAuthStateChanged((authenticatedUser) => {
      setUser(authenticatedUser);
      setInitializing(false); // Firebase auth has completed
    });

    return () => {
      clearTimeout(splashTimer); // Clear splash timer
      subscriber(); // Unsubscribe on component unmount
    };
  }, []);

  if (initializing || showSplash) {
    // Show SplashScreen while initializing or during the delay
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // If user is signed in, show authenticated routes
          <>
            {user.email === "admin@gmail.com" ? (
              <>
                
                <Stack.Screen name="Adminhome" component={AdminHomeTabs} />
                <Stack.Screen name="Adminaddfood" component={Adminaddfood} />


              </>
            ) : (
              <>
                <Stack.Screen name="HomeTabs" component={HomeTabs} />
                <Stack.Screen name="ProductDetails" component={ProductDetails}/>
                <Stack.Screen name="ManageProfile" component={ManageProfileScreen} />
                <Stack.Screen name="CartScreen" component={CartScreen} />
                <Stack.Screen name="PaymentScreen" component={PaymentMethodScreen} />
              </>
            )}
          </>
        ) : (
          // If user is not signed in, show onboarding/sign-in/sign-up screens
          <>
            <Stack.Screen name="Welcome" component={welcomescreen} />
            <Stack.Screen name="Signin" component={Signinscreen} />
            <Stack.Screen name="Signup" component={Signupscreen} />
            <Stack.Screen name="Registerphone" component={Registerphone} />
            <Stack.Screen name="Forgetpassword" component={Forgetpasswordscreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigators;
