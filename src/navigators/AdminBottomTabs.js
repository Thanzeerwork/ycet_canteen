import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants';
import DashboardScreen from '../screens/admin/DashboardScreen';
import OrdersScreen from '../screens/admin/OrdersScreen';
import ProductsScreen from '../screens/admin/ProductsScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import AdminHome from '../screens/adminhome';
import AccountScreen from '../screens/AccountScreen';
import AdminAccountScreen from '../screens/admin/AdminProfileScreen';
import AdminAddFood from '../screens/adminaddfood';
import AdminDashboard from '../screens/admin/DashboardScreen';
import Managefood from '../screens/admin/Managefood';

const AdminBottomTabs = createBottomTabNavigator();

export default () => (
  <AdminBottomTabs.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: 60,
        backgroundColor: colors.DEFAULT_WHITE,
        borderTopWidth: 0,
      },
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.DEFAULT_GREEN,
      tabBarInactiveTintColor: colors.INACTIVE_GREY,
    }}
  >
    <AdminBottomTabs.Screen
      name="AdminHome"
      component={AdminHome}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="grid-outline" size={24} color={color} />
        ),
      }}
    />
        <AdminBottomTabs.Screen
      name="AdminAddFood"
      component={AdminAddFood}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="add-circle-outline" size={24} color={color} />
        ),
      }}
    />
    <AdminBottomTabs.Screen
      name="AdminDashboard"
      component={AdminDashboard}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="cube-outline" size={24} color={color} />
        ),
      }}
    />
    <AdminBottomTabs.Screen
      name="Managefood"
      component={Managefood}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="list-outline" size={24} color={color} />
        ),
      }}
    />
    <AdminBottomTabs.Screen
      name="Profile"
      component={AdminAccountScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="person-circle-outline" size={24} color={color} />
        ),
      }}
    />
  </AdminBottomTabs.Navigator>
);
