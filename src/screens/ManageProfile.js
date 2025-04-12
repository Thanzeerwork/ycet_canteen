import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { launchImageLibrary } from "react-native-image-picker";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, images } from "../constants";

const ManageProfileScreen = ({navigation}) => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore based on logged-in user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth().currentUser; // Get logged-in user
        if (currentUser) {
          const userId = currentUser.uid;
          const userDoc = await firestore().collection("users").doc(userId).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setName(data.username);
            setEmail(data.email);
            setPhone(data.phone);
            setLocation(data.location);
            setLanguage(data.language);
            setGender(data.gender);
            setProfileImage(data.profileImage);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Open image picker
  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && response.assets) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color={colors.DEFAULT_GREEN} style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.DEFAULT_WHITE} barStyle="light-content" />
      {/* Top Bar */}
      <SafeAreaView>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <View style={styles.profileContainer}>
        {/* <Image
          source={profileImage ? { uri: profileImage } : require("./assets/default-profile.png")}
          style={styles.profileImage}
        /> */}
        <Image style={styles.profileImage} source={images.AVATAR}  />
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Icon name="camera" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View style={styles.profileDetails}>
        {renderField("user", name, setName)}
        {renderField("lock", "Password", () => {})}
        {renderField("mail", email, setEmail)}
        {renderField("phone", phone, setPhone)}
        {renderField("user-check", gender, setGender)}
      </View>
      </SafeAreaView>
    </View>
  );
};

// Reusable Field Component
const renderField = (icon, value, onChange) => (
  <View style={styles.fieldContainer}>
    <Icon name={icon} size={20} color="#777" style={styles.fieldIcon} />
    <TextInput style={styles.fieldInput} value={value} onChangeText={onChange} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  saveText: { fontSize: 16, color: colors.DEFAULT_GREEN, fontWeight: "bold" },
  profileContainer: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  editIcon: { position: "absolute", bottom: 5, right: 10, backgroundColor:colors.DEFAULT_GREEN, padding: 8, borderRadius: 20 },
  profileDetails: { backgroundColor: "white", padding: 15, borderRadius: 10, shadowColor: "#000", elevation: 3 },
  fieldContainer: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  fieldIcon: { marginRight: 15 },
  fieldInput: { flex: 1, fontSize: 16, color: "#333" },
});

export default ManageProfileScreen;
