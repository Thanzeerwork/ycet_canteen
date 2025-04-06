import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = ({ route }) => {
    const navigation = useNavigation();
    const { amount, userEmail, userPhone, userName } = route.params;
    const [loading, setLoading] = useState(true);

    const RAZORPAY_URL = `https://your-server.com/razorpay-checkout?amount=${amount}&email=${userEmail}&phone=${userPhone}&name=${userName}`;

    return (
        <View style={{ flex: 1 }}>
            {loading && <ActivityIndicator size="large" color="#F37254" />}
            <WebView
                source={{ uri: RAZORPAY_URL }}
                onLoad={() => setLoading(false)}
                onNavigationStateChange={(navState) => {
                    if (navState.url.includes("payment-success")) {
                        navigation.goBack();
                        alert("Payment Successful!");
                    } else if (navState.url.includes("payment-failed")) {
                        navigation.goBack();
                        alert("Payment Failed!");
                    }
                }}
            />
        </View>
    );
};

export default PaymentScreen;
