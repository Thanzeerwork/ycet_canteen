import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Switch,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { colors, fonts, Mock } from "../constants";
import CategoryMenuItem from '../components/Categorymenuitem';


const AdminHome = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");


  useFocusEffect(
            React.useCallback(() => {
                const updateStatusBar = () => {
                    StatusBar.setBackgroundColor(colors.DEFAULT_GREEN);
                    StatusBar.setBarStyle("light-content");
                };
    
                const timeout = setTimeout(updateStatusBar, 10); // Small delay to ensure proper update
    
                return () => {
                    clearTimeout(timeout); // Clear timeout if unmounting quickly
                     StatusBar.setBackgroundColor(colors.DEFAULT_WHITE);
                    StatusBar.setBarStyle("dark-content");
                };
            }, [])
        );


  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const snapshot = await firestore()
        .collection("foodProducts")
        .orderBy("createdAt", "desc")
        .get();
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // Handle search filtering
  const filteredProducts = products.filter((product) =>
    (activeCategory === "ALL" || product.category === activeCategory) &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const deleteProduct = (id) => {
    firestore().collection("foodProducts").doc(id).delete();
  };

  const toggleAvailability = async (id, currentAvailability) => {
    try {
      const newAvailability = !currentAvailability;

      // Update Firestore
      await firestore().collection("foodProducts").doc(id).update({
        availability: newAvailability,
      });

      // 🔥 Update local state so UI changes immediately
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === id ? { ...product, availability: newAvailability } : product
        )
      );

    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };


  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <StatusBar backgroundColor={colors.DEFAULT_GREEN} barStyle="light-content" />
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }}
        style={styles.productImage}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>
          {item.description.substring(0, 50)}...
        </Text>
        <Text
          style={[
            styles.productAvailability,
            { color: item.availability ? "green" : "red" },
          ]}
        >
          {item.availability ? "Available" : "Unavailable"}
        </Text>
        <Text style={styles.productPrice}>₹{item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.productActions}>
        <Switch
          value={item.availability}
          onValueChange={() => toggleAvailability(item.id, item.availability)}
          thumbColor={item.availability ? colors.DEFAULT_GREEN : colors.DEFAULT_GREY}
          
        />

      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.DEFAULT_GREEN} barStyle="light-content" />
      <SafeAreaView>
        {/* Curved Background */}
        <View style={styles.curvedContainer} />

        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={15} color={colors.DEFAULT_WHITE} />
            <Text style={styles.locationText}>Managing</Text>
            <Text style={styles.selectedLocationText}>YCET</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color={colors.DEFAULT_YELLOW} />
            <Feather name="bell" size={24} color={colors.DEFAULT_WHITE} style={{ marginLeft: 'auto' }} />
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>12</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={25} color={colors.DEFAULT_GREY} />
          <TextInput
            placeholder="Search Products..."
            placeholderTextColor={colors.DEFAULT_GREY}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Section */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScrollView}>
          {Mock.CATEGORIES.map(({ name, logo }) => (
            <CategoryMenuItem key={name} name={name} logo={logo} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator size={30} color={colors.DEFAULT_GREEN} />
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            refreshing={refreshing}
            onRefresh={fetchProducts}
            contentContainerStyle={styles.productList}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.SECONDARY_WHITE,
  },
  curvedContainer: {
    backgroundColor: colors.DEFAULT_GREEN,
    height: 1980,
    position: "absolute",
    top: -1770,
    width: 2000,
    borderRadius: 2000,
    alignSelf: "center",
    zIndex: -1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: colors.DEFAULT_WHITE,
    marginLeft: 5,
    fontSize: 13,
    fontFamily: fonts.POPPINS_MEDIUM,
  },
  selectedLocationText: {
    color: colors.DEFAULT_YELLOW,
    marginLeft: 5,
    fontSize: 14,
    fontFamily: fonts.POPPINS_MEDIUM,
  },
  categoryScrollView: {
    paddingHorizontal: 10,
    marginTop: 27,
    paddingBottom: 57,

  },
  alertBadge: {
    borderRadius: 32,
    backgroundColor: colors.DEFAULT_YELLOW,
    justifyContent: "center",
    alignItems: "center",
    height: 16,
    width: 16,
    position: "absolute",
    right: -2,
    top: -10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.DEFAULT_WHITE,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
  },
  searchInput: {
    flex: 1,
    color: colors.DEFAULT_BLACK,
  },
  productCard: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DEFAULT_BLACK
  },
  productDescription: {
    color: colors.DEFAULT_BLACK
  },
  productPrice: {
    fontSize: 16,
    color: colors.DEFAULT_GREEN,
  },
  productActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  productList: {
    marginTop: 0,
    padding: 5,
    paddingBottom: 30,
  },
});

export default AdminHome;
