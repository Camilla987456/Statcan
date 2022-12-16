/** @format */

// Tab View inside Navigation Drawer
// https://aboutreact.com/tab-view-inside-navigation-drawer-sidebar-with-react-navigation/

import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { Feather } from "@expo/vector-icons";
import "../settings.js";
import i18n from "../resources.js";
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
} from "../normalization.js";

import FollowingScreen from "./FollowingScreen";
import FollowingListScreen from "./FollowingListScreen";


const FollowingStackScreen = ({ navigation }) => {
  const Stack = createStackNavigator();


  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Following"
    >
      <Stack.Screen name="Following" component={FollowingScreen} />
    </Stack.Navigator>
  );
};
export default FollowingStackScreen;
