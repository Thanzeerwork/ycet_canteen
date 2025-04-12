import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, StatusBar, ScrollView, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fonts, images } from '../constants';
import { Display } from '../utils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RazorpayCheckout from 'react-native-razorpay';




import { SafeAreaView } from 'react-native-safe-area-context';
import { Separator } from '../components';


const CartScreen = () => {
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState([]);
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
                StatusBar.setBackgroundColor(colors.SECONDARY_WHITE);
                StatusBar.setBarStyle("dark-content");
            };
        }, [])
    );

    const handleCheckout = async () => {
        try {
            const user = auth().currentUser;
            if (!user) {
                console.log("User not logged in");
                return;
            }
    
            if (cartItems.length === 0) {
                console.log("Cart is empty");
                return;
            }
    
            const userId = user.uid;
            const orderData = {
                userId: userId,
                items: cartItems,
                totalAmount: totalPrice - 10, // Apply discount
                createdAt: firestore.FieldValue.serverTimestamp(), // 🔥 Change from `timestamp` to `createdAt`
                status: "pending", // You can later update to "delivered" or "completed"
            };
    
            // Add order to Firestore
            const orderRef = await firestore().collection("orders").add(orderData);
            console.log("Order placed successfully:", orderRef.id);
    
            // Clear the cart after order placement
            await firestore().collection("cart").doc(userId).update({ items: [] });
            setCartItems([]); // Update local state
    
            // Navigate to order success screen or show a message
            alert("Order placed successfully!");
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            const user = auth().currentUser;
            if (!user) {
                console.log("User not logged in");
                setCartItems([]);
                setLoading(false);
                return;
            }

            const userId = user.uid;
            const cartRef = firestore().collection('cart').doc(userId);
            const cartSnapshot = await cartRef.get();

            if (cartSnapshot.exists) {
                setCartItems(cartSnapshot.data().items);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCart();
        }, [])
    );

    const updateQuantity = async (itemId, newQuantity) => {
        try {
            const user = auth().currentUser;
            if (!user) return;

            const userId = user.uid;
            const cartRef = firestore().collection('cart').doc(userId);
            const cartSnapshot = await cartRef.get();

            if (!cartSnapshot.exists) return;

            let updatedItems = cartSnapshot.data().items.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );

            // Remove item if quantity is 0
            updatedItems = updatedItems.filter(item => item.quantity > 0);

            await cartRef.update({ items: updatedItems });
            setCartItems(updatedItems);
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    // Calculate total price dynamically
    const totalPrice = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [cartItems]);

    const renderCartItem = ({ item }) => {
        // const imageUri = `data:image/png;base64,${item.imageBase64}`;

        return (
            <View style={styles.cartItem}>
                {/* <Image source={{ uri: imageUri }} style={styles.itemImage} /> */}
                <Image source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }} style={styles.productImage} />
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>₹{item.price?.toFixed(2)}</Text>
                </View>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Text style={styles.quantityText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <View style={styles.container}>

            <SafeAreaView>

                <View style={styles.headerContainer}>
                    <Ionicons
                        name="chevron-back-outline"
                        size={30}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={styles.headerTitle}>My Cart</Text>
                </View>


                {loading ? (
                    <ActivityIndicator size="large" color="green" />
                ) : cartItems.length === 0 ? (
                    <View style={styles.emptyCartContainer}>
                        <Image
                            style={styles.emptyCartImage}
                            source={images.EMPTY_CART}
                            resizeMode="contain"
                        />
                        <Text style={styles.emptyCartText}>Cart Empty</Text>
                        <Text style={styles.emptyCartSubText}>
                            Go ahead and order some tasty food
                        </Text>
                        <TouchableOpacity style={styles.addButtonEmpty} onPress={() => navigation.goBack()}>
                            <AntDesign name="plus" color={colors.DEFAULT_WHITE} size={20} />
                            <Text style={styles.addButtonEmptyText}>Add Food</Text>
                        </TouchableOpacity>
                        <Separator height={Display.setheight(0)} />
                    </View>
                ) : (
                    <>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 120 }} // Adds space for checkout button
                            keyboardShouldPersistTaps="handled">
                            <FlatList
                                data={cartItems}
                                keyExtractor={(item) => item.id}
                                renderItem={renderCartItem}
                                scrollEnabled={false} // Prevents FlatList from conflicting with ScrollView
                            />

                            {/* Promo Code Section */}
                            <TouchableOpacity style={styles.promoContainer} onPress={() => alert("Promo code feature coming soon!")}>
                                <MaterialIcons name="star" size={20} color="#F7931E" />
                                <Text style={styles.promoText}>Add Promo Code</Text>
                                <Ionicons name="chevron-forward" size={20} color="black" />
                            </TouchableOpacity>

                            {/* Order Summary */}
                            <View style={styles.summaryContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.summaryLabel}>Item Total</Text>
                                    <Text style={styles.summaryValue}>₹{totalPrice.toFixed(2)}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.summaryLabel}>Discount</Text>
                                    <Text style={[styles.summaryValue, { color: 'red' }]}>-₹10.00</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.summaryLabel}>Delivery Fee</Text>
                                    <Text style={[styles.summaryValue, { color: 'green' }]}>Free</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.row}>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.totalValue}>₹{(totalPrice - 10).toFixed(2)}</Text>
                                </View>
                            </View>

                            {/* Delivery Section */}
                            <View style={styles.deliveryContainer}>
                                <Ionicons name="location-sharp" size={20} color="red" />
                                <View>
                                    <Text style={styles.deliveryTitle}>Pickup At: YCET Canteen</Text>
                                    <Text style={styles.deliveryAddress}></Text>
                                </View>
                                <TouchableOpacity>
                                    <Text style={styles.changeText}>Change</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>

                                    <View style={styles.rowAndCenter}>
                                        <Ionicons
                                            name="cart-outline"
                                            color={colors.DEFAULT_WHITE}
                                            size={20}
                                        />
                                        <Text style={styles.checkoutText}>Checkout</Text>
                                    </View>
                                    <Text style={styles.checkoutText}>
                                        ₹{(totalPrice - 10).toFixed(2)}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </>
                )}
            </SafeAreaView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        color: colors.DEFAULT_BLACK
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: fonts.POPPINS_MEDIUM,
        lineHeight: 20 * 1.4,
        width: Display.setwidth(72),
        textAlign: 'center',
        color: colors.DEFAULT_BLACK
    },
    cartItem: {
        backgroundColor: '#F8F8F8',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.DEFAULT_BLACK
    },
    itemPrice: {
        fontSize: 16,
        color: '#F7931E',
        marginTop: 5,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EDEDED',
        borderRadius: 8,
        paddingHorizontal: 5,
    },
    quantityButton: {
        padding: 8,
    },
    quantityText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.DEFAULT_BLACK
    },
    quantityValue: {
        fontSize: 16,
        marginHorizontal: 10,
        color: colors.DEFAULT_BLACK
    },
    promoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
    promoText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
        flex: 1,
        color: colors.DEFAULT_BLACK,
    },
    summaryContainer: {
        backgroundColor: '#fff',
        padding: 15,
        color: colors.DEFAULT_BLACK

    },
    summaryLabel: {
        color: colors.DEFAULT_BLACK
    },
    summaryValue: { color: colors.DEFAULT_BLACK },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.DEFAULT_BLACK
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F7931E',
    },
    checkoutButton: {
        flexDirection: 'row',
        width: Display.setwidth(80),
        backgroundColor: colors.DEFAULT_GREEN,
        alignSelf: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        height: Display.setheight(7),
        marginTop: 10,
    },
    checkoutText: {
        fontSize: 16,
        fontFamily: fonts.POPPINS_MEDIUM,
        lineHeight: 16 * 1.4,
        color: colors.DEFAULT_WHITE,
        marginLeft: 8,
    },
    rowAndCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
    },

    emptyCartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Display.setheight(15)
    },
    emptyCartText: {
        fontSize: 30,
        fontFamily: fonts.POPPINS_LIGHT,
        lineHeight: 30 * 1.4,
        color: colors.DEFAULT_GREEN,
    },
    emptyCartSubText: {
        fontSize: 12,
        fontFamily: fonts.POPPINS_MEDIUM,
        lineHeight: 12 * 1.4,
        color: colors.INACTIVE_GREY,
    },
    addButtonEmpty: {
        flexDirection: 'row',
        backgroundColor: colors.DEFAULT_YELLOW,
        borderRadius: 8,
        paddingHorizontal: Display.setwidth(4),
        paddingVertical: 5,
        marginTop: 10,
        justifyContent: 'space-evenly',
        elevation: 3,
        alignItems: 'center',
    },
    addButtonEmptyText: {
        fontSize: 12,
        fontFamily: fonts.POPPINS_MEDIUM,
        lineHeight: 12 * 1.4,
        color: colors.DEFAULT_WHITE,
        marginLeft: 10,
    },
    emptyCartImage: {
        height: Display.setwidth(60),
        width: Display.setwidth(60),
    },
    deliveryTitle: {
        color: colors.DEFAULT_BLACK
    },
});

export default CartScreen;
