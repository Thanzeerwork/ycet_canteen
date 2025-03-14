import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TextInput,
    ScrollView,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryMenuItem from '../components/Categorymenuitem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Separator } from '../components';
import firestore from '@react-native-firebase/firestore';
import { colors, fonts, Mock } from '../constants';
import { RefreshControl } from 'react-native';

const Homenew = ({ navigation }) => {
    const [activeCategory, setActiveCategory] = useState("ALL");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

    // Function to fetch products from Firestore
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const snapshot = await firestore().collection("foodProducts").get();
            const productList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productList);
            setFilteredProducts(productList);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh products when screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchProducts();
        }, [])
    );
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
        const filtered = products.filter((product) => {
            const matchesCategory = activeCategory === "ALL" || product.category === activeCategory;
            const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
            return matchesCategory && matchesSearch;
        });
        setFilteredProducts(filtered);
    }, [activeCategory, searchQuery, products]);

    const renderProductItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { product: item })}>
            <View style={styles.productCard}>
                <Image source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }} style={styles.productImage} />
                <View style={styles.productDetails}>
                    <Text style={styles.productName}>{item.name || "No Name"}</Text>
                    <Text style={styles.productDescription}>
                        {item.description?.substring(0, 50) || "No description available"}...
                    </Text>
                    
                    <Text
                        style={[styles.productAvailability, { color: item.availability ? "green" : "red" }]}
                    >
                        {item.availability ? "Available" : "Unavailable"}
                    </Text>
                    <Text style={styles.productPrice}>₹{item.price?.toFixed(2)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.DEFAULT_GREEN} translucent barStyle="light-content" />
            <SafeAreaView>
                <View style={styles.curvedcontainer} />
                <View style={styles.headerContainer}>
                    <View style={styles.locationContainer}>
                        <Ionicons
                            name="location-outline"
                            size={15}
                            color={colors.DEFAULT_WHITE}
                        />
                        <Text style={styles.locationText}>Delivered to</Text>
                        <Text style={styles.selectedLocationText}>YCET</Text>
                        <MaterialIcons
                            name="keyboard-arrow-down"
                            size={16}
                            color={colors.DEFAULT_YELLOW}
                        />
                        <Feather
                            name="bell"
                            size={24}
                            color={colors.DEFAULT_WHITE}
                            style={{ position: 'absolute', right:2 }}
                        />
                        <View style={styles.alertBadge}>
                            <Text style={styles.alertBadgeText}>12</Text>
                        </View>
                    </View>

                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={25} color={colors.DEFAULT_GREY} />
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor={colors.DEFAULT_GREY}
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Feather name="sliders" size={20} color={colors.DEFAULT_YELLOW} />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScrollView}>
                    {Mock.CATEGORIES.map(({ name, logo }) => (
                        <CategoryMenuItem
                            key={name}
                            name={name}
                            logo={logo}
                            activeCategory={activeCategory}
                            setActiveCategory={setActiveCategory}
                        />
                    ))}
                </ScrollView>

                <Separator height={6} color="transparent" />

                {loading ? (
                    <View>
                        <Separator height={6} color="transparent" />
                        <ActivityIndicator size={30} color={colors.DEFAULT_GREEN} />
                    </View>
                ) : (

                    <FlatList
                        data={filteredProducts}
                        renderItem={renderProductItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.productList}
                        refreshing={refreshing} // Bind pull-to-refresh state
                        onRefresh={fetchProducts} // Bind pull-to-refresh handler
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={fetchProducts} colors={[colors.DEFAULT_GREEN]} />
                        }

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
        justifyContent: 'space-evenly',
      },    
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 20,
      },
      locationText: {
        color: colors.DEFAULT_WHITE,
        marginLeft: 5,
        fontSize: 13,
        lineHeight: 13 * 1.4,
        fontFamily: fonts.POPPINS_MEDIUM,
      },
      selectedLocationText: {
        color: colors.DEFAULT_YELLOW,
        marginLeft: 5,
        fontSize: 14,
        lineHeight: 14 * 1.4,
        fontFamily: fonts.POPPINS_MEDIUM,
      },
      alertBadge: {
        borderRadius: 32,
        backgroundColor: colors.DEFAULT_YELLOW,
        justifyContent: 'center',
        alignItems: 'center',
        height: 16,
        width: 16,
        position: 'absolute',
        right: -2,
        top: -10,
      },
      alertBadgeText: {
        color: colors.DEFAULT_WHITE,
        fontSize: 10,
        lineHeight: 10 * 1.4,
        fontFamily: fonts.POPPINS_BOLD,
      },
    searchContainer: {
        backgroundColor: colors.DEFAULT_WHITE,
        height: 45,
        borderRadius: 8,
        marginHorizontal: 20,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        color: colors.DEFAULT_BLACK,
    },
    categoryScrollView: {
        paddingHorizontal: 10,
        marginTop: 15,
    },
    productCard: {
        flexDirection: "row",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    productDescription: {
        fontSize: 14,
        color: "#555",
    },
    productPrice: {
        fontSize: 16,
        color: colors.DEFAULT_GREEN,
        paddingLeft:200,
    },
    productAvailability: {
        marginTop: 5,
        fontSize:14
    },
    productList: {
     margin:0,
     padding:0,
    },
});

export default Homenew;
