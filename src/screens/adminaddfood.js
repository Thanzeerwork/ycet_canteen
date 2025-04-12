import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import firestore from "@react-native-firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { colors, fonts } from "../constants";
import RNFS from "react-native-fs";
import { useFocusEffect } from "@react-navigation/native";

const AdminAddFood = () => {
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState(true);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useFocusEffect(
          React.useCallback(() => {
              const updateStatusBar = () => {
                  StatusBar.setBackgroundColor(colors.DEFAULT_WHITE);
                  StatusBar.setBarStyle("light-content");
              };
  
              const timeout = setTimeout(updateStatusBar, 50); // Small delay to ensure proper update
  
              return () => {
                  clearTimeout(timeout); // Clear timeout if unmounting quickly
                   
                  StatusBar.setBarStyle("dark-content");
              };
          }, [])
      );
  const selectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const uploadProduct = async () => {
    if (!foodName || !price || !description || !image || !category) {
      setMessage("Please fill all fields and select an image.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const filePath = image.uri.replace("file://", "");
      const fileData = await RNFS.readFile(filePath, "base64");

      await firestore().collection("foodProducts").add({
        name: foodName.trim(),
        price: parseFloat(price),
        description: description.trim(),
        availability,
        category,
        imageBase64: fileData,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setMessage("Γ£à Product uploaded successfully!");
      setFoodName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setImage(null);
      setAvailability(true);
    } catch (error) {
      console.error("Error uploading product:", error);
      setMessage("Γ¥î Error uploading product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.title}>Add Food Product</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Enter food name"
          placeholderTextColor={colors.DEFAULT_GREY}
          value={foodName}
          onChangeText={setFoodName}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter price (e.g., 10.99)"
          placeholderTextColor={colors.DEFAULT_GREY}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter product description"
          placeholderTextColor={colors.DEFAULT_GREY}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Availability Toggle */}
        <View style={styles.row}>
          <Text style={styles.label}>Availability:</Text>
          <TouchableOpacity
            style={[styles.toggleButton, availability ? styles.active : styles.inactive]}
            onPress={() => setAvailability(true)}
          >
            <Text style={styles.buttonText}>Available</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !availability ? styles.active : styles.inactive]}
            onPress={() => setAvailability(false)}
          >
            <Text style={styles.buttonText}>Unavailable</Text>
          </TouchableOpacity>
        </View>

        {/* Category Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Category:</Text>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Beverages" value="Beverages" />
            <Picker.Item label="Snacks" value="Snacks" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Desserts" value="Desserts" />
            <Picker.Item label="Icecreams" value="Icecreams" />
          </Picker>
        </View>

        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>≡ƒô╖ Select Image</Text>
          )}
        </TouchableOpacity>

        {/* Upload Button */}
        <TouchableOpacity
          style={[styles.uploadButton, loading && styles.disabledButton]}
          onPress={uploadProduct}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadButtonText}>Upload Product</Text>}
        </TouchableOpacity>

        {/* Status Message */}
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.DEFAULT_WHITE,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: fonts.POPPINS_BOLD,
    marginBottom: 20,
    textAlign: "center",
    color: colors.DEFAULT_GREEN,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    color:colors.DEFAULT_BLACK,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: "top",
    color:colors.DEFAULT_BLACK
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.DEFAULT_GREEN,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  active: {
    backgroundColor: colors.DEFAULT_GREEN,
  },
  inactive: {
    backgroundColor: "#ddd",
  },
  buttonText: {
    color: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    
  },
  picker:{
color:colors.DEFAULT_GREEN
  },
  imagePicker: {
    height: 150,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  imagePickerText: {
    color: "#888",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  uploadButton: {
    backgroundColor: colors.DEFAULT_GREEN,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  message: {
    marginTop: 15,
    textAlign: "center",
    color: "#333",
  },
});

export default AdminAddFood;
