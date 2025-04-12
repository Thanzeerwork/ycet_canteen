import firestore from "@react-native-firebase/firestore";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, StatusBar, RefreshControl } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants";

const ReorderScreen = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState("Pre-Orders");
    const [orders, setOrders] = useState([]);
    const [refreshing, setRefreshing] = useState(false); // 🔄 State for refreshing

    useFocusEffect(
        React.useCallback(() => {
            const updateStatusBar = () => {
                StatusBar.setBackgroundColor(colors.DEFAULT_WHITE);
                StatusBar.setBarStyle("light-content");
            };

            const timeout = setTimeout(updateStatusBar, 10); // Small delay to ensure proper update

            return () => {
                clearTimeout(timeout); // Clear timeout if unmounting quickly
                StatusBar.setBackgroundColor(colors.SECONDARY_WHITE);
                StatusBar.setBarStyle("dark-content");
            };
        }, [])
    );

    // Fetch Orders from Firestore
    const fetchOrders = async () => {
        try {
            const ordersCollection = await firestore().collection("orders").get();
            let allOrders = [];

            ordersCollection.docs.forEach((doc) => {
                const data = doc.data();
                if (data.items && Array.isArray(data.items)) {
                    allOrders = [...allOrders, ...data.items]; // Flatten items from all documents
                }
            });

            setOrders(allOrders);
        } catch (error) {
            console.error("Error fetching orders: ", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // 🔄 Handle Pull-to-Refresh
    const handleRefresh = async () => {
        setRefreshing(true); // Show refresh indicator
        await fetchOrders(); // Reload orders from Firestore
        setRefreshing(false); // Hide refresh indicator
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemcontent}>
            <View style={styles.orderContainer}>

                {/* Product Image */}
                {item.imageBase64 ? (
                    <Image source={{ uri: `data:image/png;base64,${item.imageBase64}` }} style={styles.image} />
                ) : (
                    <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.image} />
                )}

                {/* Order Details */}
                <View style={styles.orderDetails}>
                    <Text style={styles.orderName}>{item.name}</Text>
                    <Text style={styles.orderDate}>Category: {item.category}</Text>
                </View>

                {/* Price */}
                <Text style={styles.orderPrice}>${item.price.toFixed(2)}</Text>
            </View>

            {/* Buttons Section */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.reorderButton}>
                    <Text style={styles.buttonText}>Reorder</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.getHelpButton}>
                    <Text style={styles.buttonText}>Get Help</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <SafeAreaView>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Orders</Text>
                    <Feather name="bell" size={24} color="black" />
                </View>

                {/* Tab Section */}
                <View style={styles.tabs}>
                    {["Pre-Orders", "Oncoming", "History"].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setSelectedTab(tab)}
                            style={[
                                styles.tabItem,
                                selectedTab === tab && styles.activeTabItem,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === tab && styles.activeTabText,
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Orders List with Refresh Control */}
                <FlatList
                    data={orders}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                    contentContainerStyle={styles.listContainer}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: { fontSize: 18, fontWeight: "bold"},

    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 10,
    },
    tabItem: { paddingVertical: 5 },
    activeTabItem: { borderBottomWidth: 2, borderBottomColor: "green" },
    tabText: { fontSize: 16, color: "gray" },
    activeTabText: { color: "black", fontWeight: "bold" },

    listContainer: { paddingHorizontal: 20, paddingVertical: 10 },

    /*** 🛠️ Fixed Order Item Styling ***/
    orderContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        justifyContent: 'space-between'
    },
    itemcontent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 10, 
    },

    content: {
        flex: 1, 
        flexDirection: "column",
        justifyContent: "space-between",
    },

    orderDetails: {
        flexDirection: "column",
        justifyContent: "flex-start",
        color:colors.DEFAULT_BLACK,
    },
    orderName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 2,
        color:colors.DEFAULT_BLACK,
    },
    orderDate: {
        fontSize: 14,
        color: "gray",
    },
    orderPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "green",
        marginTop: 5,
    },

    /*** Buttons Section ***/
    buttonContainer: {
        flexDirection: "row",
        margin: 10
    },
    reorderButton: {
        flex: 1,
        backgroundColor: colors.DEFAULT_GREEN,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: "center",
        marginRight: 5,
    },
    getHelpButton: {
        flex: 1,
        backgroundColor: "#D3D3D3",
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: "center",
        marginLeft: 5,
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});

export default ReorderScreen;
