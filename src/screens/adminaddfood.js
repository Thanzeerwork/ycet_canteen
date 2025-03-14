import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import firestore from "@react-native-firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { colors, fonts } from "../constants";
import RNFS from "react-native-fs";

const AdminAddFood = () => {
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState(""); // New state for description
  const [availability, setAvailability] = useState(true);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
        name: foodName,
        price: parseFloat(price),
        description, // Save description
        availability,
        category,
        imageBase64: fileData,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setMessage("Product uploaded successfully!");
      setFoodName("");
      setPrice("");
      setDescription(""); // Reset description
      setCategory("");
      setImage(null);
      setAvailability(true);
    } catch (error) {
      console.error("Error uploading product:", error);
      setMessage("Error uploading product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Food Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter food name"
        placeholderTextColor={colors.DEFAULT_GREEN}
        value={foodName}
        onChangeText={setFoodName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter price (e.g., 10.99)"
        placeholderTextColor={colors.DEFAULT_GREEN}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {/* Description Input Field */}
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Enter product description"
        placeholderTextColor={colors.DEFAULT_GREEN}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      

      <View style={styles.row}>
        <Text style={styles.label}>Availability:</Text>
        <TouchableOpacity
          style={[styles.button, availability ? styles.buttonActive : styles.buttonInactive]}
          onPress={() => setAvailability(true)}
        >
          <Text style={styles.buttonText}>Available</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !availability ? styles.buttonActive : styles.buttonInactive]}
          onPress={() => setAvailability(false)}
        >
          <Text style={styles.buttonText}>Unavailable</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
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

      <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Select Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.uploadButton, loading && styles.disabledButton]}
        onPress={uploadProduct}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>Upload Product</Text>
        )}
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.DEFAULT_WHITE,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: fonts.POPPINS_MEDIUM,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  descriptionInput: {
    height: 80, // Increased height for multiline input
    textAlignVertical: "top", // Ensures text starts at the top
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.DEFAULT_RED,
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.DEFAULT_GREY,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonActive: {
    backgroundColor: colors.DEFAULT_GREEN,
  },
  buttonInactive: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
  },
  imagePicker: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  imagePickerText: {
    color: colors.DEFAULT_GREEN,
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: colors.DEFAULT_GREEN,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
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
