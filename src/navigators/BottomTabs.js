import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Display} from '../utils';
import { colors } from '../constants';
import Homenew from '../screens/Home';
import CartScreen from '../screens/CartScreen';
import AccountScreen from '../screens/AccountScreen';
import ReorderScreen from '../screens/ReorderScreen';

const BottomTabs = createBottomTabNavigator();


export default () => (
  <BottomTabs.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: Display.setheight(8),
        backgroundColor: colors.DEFAULT_WHITE,
        borderTopWidth: 0,
      },
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.DEFAULT_GREEN,
      tabBarInactiveTintColor: colors.INACTIVE_GREY,
      
    }}
    op>
    <BottomTabs.Screen
      name="Home"
      component={Homenew}
      options={{
        tabBarIcon: ({color}) => (
          <Ionicons name="home-outline" size={23} color={color} />
        ),
      }}
    />
     <BottomTabs.Screen
      name="Bookmark"
      component={ReorderScreen}
      options={{
        tabBarIcon: ({color}) => (
          <Ionicons name="bookmark-outline" size={23} color={color} />
        ),
      }}
    />
    <BottomTabs.Screen
      name="Cart"
      component={CartScreen}
      options={{
        tabBarIcon: ({color}) => (
          <Ionicons name="cart-outline" size={23} color={color} />
        ),
      }}
    />
    <BottomTabs.Screen
      name="Account"
      component={AccountScreen}
      options={{
        tabBarIcon: ({color}) => (
          <Ionicons name="person-outline" size={23} color={color} />
        ),
      }}
    />

  </BottomTabs.Navigator>
);