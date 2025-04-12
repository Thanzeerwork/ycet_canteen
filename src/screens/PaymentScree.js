import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView,StatusBar} from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from '@react-navigation/native';
import { colors } from "../constants";

export default function PaymentMethodScreen({navigation}) {
  const [selectedMethod, setSelectedMethod] = useState("Credit Card");

  const paymentMethods = [
    { id: "PayPal", label: "PayPal", description: "Faster & safer way to send money", icon: "logo-paypal" },
    { id: "Credit Card", label: "Credit Card", description: "Pay with MasterCard, Visa", icon: "card-outline" },
    { id: "Bitcoin", label: "Bitcoin Wallet", description: "Send the amount in our Bitcoin wallet", icon: "logo-bitcoin" },
    { id: "Upi", label: "UPI Payment", description: "Send the amount using your Payment App", icon: "link-sharp" }
  ];

  useFocusEffect(
          React.useCallback(() => {
              const updateStatusBar = () => {
                  StatusBar.setBackgroundColor(colors.DEFAULT_WHITE);
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

  return (
    <View style={styles.container}>
<SafeAreaView>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity  onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add A Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Choose payment method to add</Text>

      {/* Payment Options */}
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[styles.paymentOption, selectedMethod === method.id && styles.selectedOption]}
          onPress={() => setSelectedMethod(method.id)}
        >
          <Icon name={method.icon} size={24} color="#555" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.paymentTitle}>{method.label}</Text>
            <Text style={styles.paymentDescription}>{method.description}</Text>
          </View>
          {selectedMethod === method.id && <Icon name="checkmark-circle" size={24} color="#FF9800" />}
        </TouchableOpacity>
      ))}

      {/* Next Button */}
      <Button mode="contained" style={styles.nextButton} onPress={() => alert("Next clicked!")}>
        Next
      </Button>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20,paddingVertical:25 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 15 },
  headerTitle: { fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center",color:colors.DEFAULT_BLACK },
  subtitle: { fontSize: 16, color: "#777", marginVertical: 10 },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  selectedOption: { backgroundColor: "#E3F2FD", borderWidth: 1, borderColor: "#64B5F6" },
  icon: { marginRight: 10 },
  textContainer: { flex: 1 },
  paymentTitle: { fontSize: 16, fontWeight: "bold",color:colors.DEFAULT_BLACK},
  paymentDescription: { fontSize: 14, color: "#777" },
  nextButton: { marginTop: 20, backgroundColor: "#00796B", paddingVertical: 10, borderRadius: 5 },
});

