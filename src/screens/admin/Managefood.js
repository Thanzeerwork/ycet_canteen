import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Switch,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation, createStaticNavigation } from "@react-navigation/native";
import { colors } from "../../constants";
import Separator from "../../components/separator";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';


const Managefood = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  


  const fetchProducts = () => {
    setRefreshing(true);
    firestore()
      .collection("foodProducts")
      .orderBy("createdAt", "desc")
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error("Error fetching products: ", error);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("foodProducts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const deleteProduct = (id) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await firestore().collection("foodProducts").doc(id).delete();
          },
        },
      ]
    );
  };

  const updatePrice = async (id, newPrice) => {
    await firestore().collection("foodProducts").doc(id).update({
      price: parseFloat(newPrice),
    });
  };

  const updateDescription = async (id, newDescription) => {
    await firestore().collection("foodProducts").doc(id).update({
      description: newDescription
    });
  };

  const toggleAvailability = async (id, currentAvailability) => {
    await firestore().collection("foodProducts").doc(id).update({
      availability: !currentAvailability,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      {item.imageBase64 ? (
        <View>
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }}
            style={styles.productImage}
          />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteProduct(item.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => deleteProduct(item.id)}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>Category: {item.category}</Text>
        <Text style={styles.productPrice}>Price: ₹{item.price}</Text>
        <Text style={styles.productAvailability}>
          Availability: {item.availability ? "Available" : "Unavailable"}
        </Text>
        <TextInput
          style={styles.priceInput}
          placeholder="Change Price"
          placeholderTextColor={colors.DEFAULT_GREEN}
          keyboardType="numeric"
          onSubmitEditing={(e) => updatePrice(item.id, e.nativeEvent.text)}
        />
        <TextInput
          style={styles.priceInput}
          placeholder="Change Description"
          placeholderTextColor={colors.DEFAULT_GREEN}
          keyboardType="default"
          onSubmitEditing={(e) => updateDescription(item.id, e.nativeEvent.text)}
        />

      </View>
      <Switch
        value={item.availability}
        onValueChange={() => toggleAvailability(item.id, item.availability)}
        thumbColor={item.availability ? "#28a745" : "#dc3545"}
        trackColor={{ true: "#81c784", false: "#e57373" }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Separator height={1} color={colors.DEFAULT_WHITE} />
      <View style={styles.header}>

        <Text style={styles.headerTitle}>Manage Food Products</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Adminaddfood")}
        >
          <Text style={styles.addButtonText}>Add Food</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing} // Bind pull-to-refresh state
        onRefresh={fetchProducts} // Bind pull-to-refresh handler
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 20,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productCategory: {
    fontSize: 14,
    color: "#666",
  },
  productPrice: {
    fontSize: 14,
    color: "#333",
  },
  productAvailability: {
    fontSize: 14,
    color: "#333",
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    width: "50%",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 4,
    borderRadius: 5,
    marginLeft: 1,
    marginRight: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#28a745",
    padding: 4,
    borderRadius: 5,
    marginLeft: 1,
    marginRight: 10,

  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  refreshtext: {
    textAlign: 'center',
    // borderWidth:1,
    // borderColor:colors.DEFAULT_RED,
    paddingTop: 10
  },
  drawerButton: {
    padding: 10,
  },
  drawerButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default Managefood;