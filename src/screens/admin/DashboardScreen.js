import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, StatusBar } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { colors } from "../../constants";
import { useFocusEffect } from '@react-navigation/native';
import moment from "moment";

const AdminDashboard = () => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [todayOrders, setTodayOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersSnapshot = await firestore().collection("orders").get();
                let totalOrdersCount = ordersSnapshot.size;
                let todayOrdersCount = 0;
                let revenue = 0;

                const today = moment().format("MMMM D, YYYY"); // Example: "March 12, 2025"

                ordersSnapshot.forEach(doc => {
                    const orderData = doc.data();
                    let orderDateStr = "";

                    if (orderData.createdAt) {
                        if (typeof orderData.createdAt === "string") {
                            // If createdAt is stored as a string, extract the date part
                            orderDateStr = orderData.createdAt.split(" at ")[0];
                        } else if (orderData.createdAt.toDate) {
                            // If it's a Firestore Timestamp, convert it to a date string
                            orderDateStr = moment(orderData.createdAt.toDate()).format("MMMM D, YYYY");
                        }
                    }

                    console.log("Order Date:", orderDateStr);
                    console.log("Today's Date:", today);

                    // Compare extracted order date with today's date
                    if (orderDateStr === today) {
                        todayOrdersCount++;
                    }

                    // Calculate total revenue
                    if (Array.isArray(orderData.items)) {
                        orderData.items.forEach(item => {
                            revenue += (item.price || 0) * (item.quantity || 0);
                        });
                    }
                });

                console.log("Total Orders:", totalOrdersCount);
                console.log("Today's Orders:", todayOrdersCount);
                console.log("Total Revenue:", revenue);

                setTotalOrders(totalOrdersCount);
                setTodayOrders(todayOrdersCount);
                setTotalRevenue(revenue);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color={colors.DEFAULT_GREEN} style={styles.loader} />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Admin Dashboard</Text>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Total Orders</Text>
                    <Text style={styles.statValue}>{totalOrders}</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Today's Orders</Text>
                    <Text style={styles.statValue}>{todayOrders}</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Total Revenue</Text>
                    <Text style={styles.statValue}>${totalRevenue.toFixed(2)}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: "column",
        gap: 15,
    },
    statCard: {
        backgroundColor: "#f5f5f5",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        alignItems: "center",
    },
    statLabel: {
        fontSize: 16,
        color: "gray",
        marginBottom: 5,
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default AdminDashboard;
