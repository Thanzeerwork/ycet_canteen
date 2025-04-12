import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants';

const ProductsScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Products from Firestore
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('products')
            .onSnapshot(snapshot => {
                const productList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts(productList);
                setLoading(false);
            });

        return () => unsubscribe();
    }, []);

    // Delete Product
    const deleteProduct = async (id) => {
        Alert.alert(
            "Delete Product",
            "Are you sure you want to delete this product?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        await firestore().collection('products').doc(id).delete();
                    },
                    style: "destructive",
                },
            ]
        );
    };

    // Render a Single Product Item
    const renderProduct = ({ item }) => (
        <View style={styles.productItem}>
            <View>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation.navigate('EditProduct', { product: item })}>
                    <Ionicons name="create-outline" size={22} color={colors.PRIMARY_BLUE} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            
            <Text style={styles.header}>Manage Products</Text>

            {loading ? (
                <ActivityIndicator size="large" color={colors.DEFAULT_GREEN} />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={renderProduct}
                />
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        marginBottom: 10,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: colors.DEFAULT_GREEN,
    },
    actions: {
        flexDirection: 'row',
        gap: 15,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: colors.DEFAULT_GREEN,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
});

export default ProductsScreen;
