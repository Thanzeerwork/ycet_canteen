import React, { useState, useCallback } from 'react';
import { 
    View, Text, StyleSheet, Image, TouchableOpacity, Alert, 
    ActivityIndicator, StatusBar, ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { Separator } from '../components';
import { Display } from '../utils';
import { colors, fonts, images } from '../constants';

const ProductDetails = ({ route }) => {
    const { product } = route.params;
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [selectedSubMenu, setSelectedSubMenu] = useState('Details');
    const [itemCount, setItemCount] = useState(1);

    const setStyle = isActive => isActive
        ? styles.subMenuButtonText
        : { ...styles.subMenuButtonText, color: colors.DEFAULT_GREY };

    const increaseItemCount = () => setItemCount(prev => prev + 1);
    const decreaseItemCount = () => setItemCount(prev => (prev > 1 ? prev - 1 : 1));

    // Function to Add Product to Cart
    const addToCart = useCallback(async () => {
        try {
            setLoading(true);

            const user = auth().currentUser;
            if (!user) {
                Alert.alert("Error", "You must be logged in to add items to the cart.");
                return;
            }

            const userId = user.uid;
            const cartRef = firestore().collection('cart').doc(userId);
            const cartSnapshot = await cartRef.get();

            if (cartSnapshot.exists) {
                let cartData = cartSnapshot.data();
                let updatedItems = [...cartData.items];

                const existingItemIndex = updatedItems.findIndex(item => item.id === product.id);
                if (existingItemIndex !== -1) {
                    updatedItems[existingItemIndex].quantity += itemCount;
                } else {
                    updatedItems.push({ ...product, quantity: itemCount });
                }

                await cartRef.update({ items: updatedItems });
            } else {
                await cartRef.set({ userId, items: [{ ...product, quantity: itemCount }] });
            }

            Alert.alert("Success", "Item added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            Alert.alert("Error", "Could not add item to cart.");
        } finally {
            setLoading(false);
        }
    }, [product, itemCount]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${product.imageBase64}` }} />

            <ScrollView>
                <Separator height={Display.setwidth(10)}  color='transparent'/>

                <View style={styles.mainContainer}>
                    <View style={styles.titleHeaderContainer}>
                        <Text style={styles.titleText}>{product.name}</Text>
                        <Text style={styles.priceText}>₹{product.price?.toFixed(2)}</Text>
                    </View>

                    <View style={styles.subHeaderContainer}>
                        <View style={styles.rowAndCenter}>
                            <FontAwesome name="star" size={20} color={colors.DEFAULT_YELLOW} />
                            <Text style={styles.ratingText}>4.2</Text>
                            <Text style={styles.reviewsText}>(255)</Text>
                        </View>
                        <View style={styles.rowAndCenter}>
                            <Image style={styles.iconImage} source={images.DELIVERY_TIME} />
                            <Text style={styles.deliveryText}>20 min</Text>
                        </View>
                        <View style={styles.rowAndCenter}>
                            <Image style={styles.iconImage} source={images.DELIVERY_CHARGE} />
                            <Text style={styles.deliveryText}>Free Packing</Text>
                        </View>
                    </View>

                    <View style={styles.subMenuContainer}>
                        {['Details', 'Reviews'].map(menu => (
                            <TouchableOpacity key={menu} style={styles.subMenuButtonContainer} onPress={() => setSelectedSubMenu(menu)}>
                                <Text style={setStyle(selectedSubMenu === menu)}>{menu}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.detailsContainer}>
                        {product?.description && (
                            <>
                                <Text style={styles.detailHeader}>Description</Text>
                                <Text style={styles.detailContent}>{product.description}</Text>
                            </>
                        )}
                        {product?.ingredients && (
                            <>
                                <Text style={styles.detailHeader}>Ingredients</Text>
                                <Text style={styles.detailContent}>{product.ingredients}</Text>
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonsContainer}>
                <View style={styles.itemAddContainer}>
                    <AntDesign name="minus" color={colors.DEFAULT_YELLOW} size={18} onPress={decreaseItemCount} />
                    <Text style={styles.itemCountText}>{itemCount}</Text>
                    <AntDesign name="plus" color={colors.DEFAULT_YELLOW} size={18} onPress={increaseItemCount} />
                </View>

                <TouchableOpacity style={styles.addToCartButton} onPress={addToCart} disabled={loading}>
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.addToCartText}>Add to Cart</Text>}
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('CartScreen')} activeOpacity={0.8}>
                <Text style={styles.cartButtonText}>Go to Cart</Text>
            </TouchableOpacity>
            
        </View>
    );
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    // },
    // backButton: {
    //     position: 'absolute',
    //     top: 40,
    //     left: 15,
    //     zIndex: 2,
    //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
    //     padding: 10,
    //     borderRadius: 20,
    // },
    // productImage: {
    //     width: '100%',
    //     height: 250,
    //     resizeMode: 'cover',
    // },
    // detailsContainer: {
    //     padding: 20,
    // },
    // productName: {
    //     fontSize: 24,
    //     fontWeight: 'bold',
    //     marginBottom: 10,
    // },
    // productPrice: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    //     color: 'green',
    //     marginBottom: 10,
    // },
    // productAvailability: {
    //     fontSize: 16,
    //     color: 'gray',
    //     marginBottom: 10,
    // },
    // productDescription: {
    //     fontSize: 16,
    //     color: '#555',
    //     marginBottom: 20,
    // },
    // addToCartButton: {
    //     backgroundColor: '#28a745',
    //     padding: 15,
    //     borderRadius: 8,
    //     alignItems: 'center',
    // },
    // addToCartText: {
    //     color: 'white',
    //     fontSize: 18,
    //     fontWeight: 'bold',
    // },
    container: {
        flex: 1,
        backgroundColor: colors.DEFAULT_WHITE,
    },
    image: {
        position: 'absolute',
        height: Display.setwidth(100),
        width: Display.setwidth(100),
        top: 0,
    },
    mainContainer: {
        backgroundColor: colors.DEFAULT_WHITE,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    titleHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 10,
    },
    titleText: {
        fontSize: 23,
        lineHeight: 23 * 1.4,
        fontFamily: fonts.POPPINS_SEMI_BOLD,
        color: colors.DEFAULT_BLACK,
    },
    priceText: {
        fontSize: 23,
        lineHeight: 23 * 1.4,
        fontFamily: fonts.POPPINS_SEMI_BOLD,
        color: colors.DEFAULT_YELLOW,
    },
    subHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 15,
    },
    rowAndCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 13,
        lineHeight: 13 * 1.4,
        fontFamily: fonts.POPPINS_BOLD,
        color: colors.DEFAULT_BLACK,
        marginLeft: 5,
    },
    reviewsText: {
        fontSize: 13,
        lineHeight: 13 * 1.4,
        fontFamily: fonts.POPPINS_MEDIUM,
        color: colors.DEFAULT_BLACK,
        marginLeft: 5,
    },
    iconImage: {
        height: 20,
        width: 20,
    },
    deliveryText: {
        fontSize: 12,
        lineHeight: 12 * 1.4,
        fontFamily: fonts.POPPINS_MEDIUM,
        color: colors.DEFAULT_BLACK,
        marginLeft: 3,
    },
    subMenuContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        paddingHorizontal: 20,
        marginTop: 20,
        borderColor: colors.DEFAULT_GREY,
        justifyContent: 'space-evenly',
    },
    subMenuButtonContainer: {
        paddingVertical: 15,
        width: Display.setwidth(30),
        alignItems: 'center',
    },
    subMenuButtonText: {
        fontSize: 13,
        lineHeight: 13 * 1.4,
        fontFamily: fonts.POPPINS_SEMI_BOLD,
        color: colors.DEFAULT_BLACK,
    },
    detailsContainer: {
        paddingHorizontal: 20,
    },
    detailHeader: {
        fontSize: 15,
        lineHeight: 15 * 1.4,
        fontFamily: fonts.POPPINS_SEMI_BOLD,
        color: colors.DEFAULT_BLACK,
        marginTop: 10,
        marginBottom: 2,
    },
    detailContent: {
        fontSize: 12,
        lineHeight: 12 * 1.4,
        fontFamily: fonts.POPPINS_SEMI_BOLD,
        color: colors.INACTIVE_GREY,
        textAlign: 'justify',
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        paddingHorizontal: Display.setwidth(5),
        justifyContent: 'space-between',
        backgroundColor: colors.DEFAULT_WHITE,
        width: Display.setwidth(100),
        paddingVertical: Display.setwidth(2.5),
    },
    itemAddContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.LIGHT_GREY2,
        height: Display.setheight(6),
        width: Display.setwidth(30),
        justifyContent: 'center',
        borderRadius: 8,
    },
    itemCountText: {
        color: colors.DEFAULT_BLACK,
        fontSize: 14,
        lineHeight: 14 * 1.4,
        fontFamily: fonts.POPPINS_SEMI_BOLD,
        marginHorizontal: 8,
    },
    buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.DEFAULT_WHITE, paddingVertical: 10 ,paddingHorizontal:10},
    cartButton: { backgroundColor: colors.DEFAULT_GREEN, padding: 15, borderRadius: 8,margin:10 },
    cartButtonText: { color: colors.DEFAULT_WHITE, fontSize: 14, fontFamily: fonts.POPPINS_MEDIUM ,textAlign:'center'},
    addToCartButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center' },
    addToCartText: { color: 'white', fontSize: 18, fontWeight: 'bold' }

});

export default ProductDetails;
