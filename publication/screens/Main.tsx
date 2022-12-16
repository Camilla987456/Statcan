/** @format */

import "react-native-gesture-handler";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  BackHandler,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  Modal,
  Linking,
  Dimensions,
  Platform,
  AppState,
  Appearance,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  commonBackground,
  commonBackgroundColor,
  themeLiteral,
  commonTabBarHighlightColor,
  commonFrameBackground,
  commonForeground,
  commonForegroundColor,
  commonTabBarColor,
  commonForegroundHighlightColor,
  commonCardBackground,
} from "../normalization.js";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
//import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "../settings.js";
import i18n from "../resources.js";
import HomeScreen from "./HomeScreen";
import SettingScreen from "./SettingScreen";
import HistoryScreen from "./HistoryScreen";
import SearchScreen from "./SearchScreen";
import SettingStackScreen from "./SettingStackScreen";
import HomeTab from "./HomeTab";
import SavedItemScreen from "./SavedItemScreen";

//const Tab = createMaterialTopTabNavigator();
const Tab = createBottomTabNavigator();
export default function Main({ navigation }) {
  const [theme, setTheme] = useState(global.theme);
  const appState = useRef(AppState.currentState);
  const [count, setCount] = useState(0);
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  React.useEffect(() => {
    navigation.addListener("focus", () => {
      setTheme(global.theme);
      console.log("main get focused");
    });
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => {
      backHandler.remove();
      console.log("main removed");
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const subscription = AppState.addEventListener(
        "change",
        handleAppStateChange
      );
      console.log("subscription removed in Main");
      return () => {
        if (subscription) subscription.remove();
        console.log("subscription removed in Main");
      };
    }, [])
  );

  const handleAppStateChange = (nextAppState) => {
    // global.indicator++;global.colorScheme = Appearance.getColorScheme();setCount(global.indicator);console.log('Main state changed:',count,global.indicator);
    try {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        global.colorScheme = Appearance.getColorScheme();
        global.indicator++;
        setCount(global.indicator);
        console.log(
          "Main.......App has come to the foreground! scheme:",
          global.colorScheme,
          count
        );
      }
      appState.current = nextAppState;
    } catch (err) {
      console.log("err in Main");
      return;
    }
  };
  return (
    <Tab.Navigator
      initialRouteName={"HomeTabScreen"}
      screenOptions={{
        gestureEnabled: false,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarLabelPosition: isLandscapeMode ? "beside-icon" : "below-icon",
        tabBarActiveTintColor: commonTabBarHighlightColor(global.theme),
        tabBarInactiveTintColor: commonTabBarColor(global.theme),
        tabBarLabelStyle: {
          textAlign: "center",
          fontSize: global.device == "2" ? 20 : 14,
          textTransform: "none",
          marginBottom: Platform.OS == "ios" ? (isLandscapeMode ? 6 : 15) : 0,
          marginTop: isLandscapeMode ? (Platform.OS == "android" ? 2 : 10) : 0,
        },
        tabBarStyle: [
          {
            borderBottomWidth: 1,
            borderColor: "#CCD1D7",
            height:Platform.OS == "ios" ? (global.device == "2" ? 110 : 90) :(global.device == "2" ? 90 : 70), //Math.max(65,Dimensions.get("window").height * 0.10),
            paddingBottom: 15,
            paddingTop: 10,
          },
          {
            backgroundColor:
              themeLiteral() == "light"
                ? "white"
                : commonBackgroundColor(global.theme),
          },
        ],
      }}
    >

      <Tab.Screen
              name="HomeTab"
              component={HomeTab}
              options={{
                tabBarLabel: i18n.t("home"),
                tabBarIcon: ({ focused, color, size }) =>
                  focused ? (
                    <Ionicons
                      name="newspaper"
                      size={global.device == "2" ? 30 : 24}
                      style={{
                        marginVertical: global.device == "2" ? -5 : 0,
                        marginLeft: 2,
                        color: commonTabBarHighlightColor(global.theme),
                        fontWeight: "bold",
                        width: global.device == "2" ? 34 : 24,
                      }}
                    />
                  ) : (
                    <Ionicons
                      name="newspaper-outline"
                      size={global.device == "2" ? 30 : 24}
                      style={[
                        {
                          marginVertical: global.device == "2" ? -5 : 0,
                          marginLeft: 2,
                        },
                        commonForeground(global.theme),
                        { width: global.device == "2" ? 34 : 24 },
                      ]}
                    />
                  ),
                tabBarAccessibilityLabel: i18n.t("accessibilityForyouTab3"),
              }}
            />


      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          tabBarLabel: i18n.t("search"),
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <Ionicons
                name="search"
                size={global.device == "2" ? 30 : 24}
                style={{
                  marginVertical: global.device == "2" ? -5 : 0,
                  marginLeft: 2,
                  color: commonTabBarHighlightColor(global.theme),
                  fontWeight: "bold",
                  width: global.device == "2" ? 34 : 24,
                }}
              />
            ) : (
              <Ionicons
                name="search-outline"
                size={global.device == "2" ? 30 : 24}
                style={[
                  {
                    marginVertical: global.device == "2" ? -5 : 0,
                    marginLeft: 2,
                  },
                  commonForeground(global.theme),
                  { width: global.device == "2" ? 34 : 24 },
                ]}
              />
            ),
          tabBarAccessibilityLabel: i18n.t("accessibilitySearchTab2"),
        }}
      />

      <Tab.Screen
              name="SavedItem"
              component={SavedItemScreen}
              options={{
                tabBarLabel: i18n.t("saved"),
                tabBarIcon: ({ focused, color, size }) =>
                  focused ? (
                    <Ionicons
                      name="bookmark"
                      size={global.device == "2" ? 30 : 24}
                      style={{
                        marginVertical: global.device == "2" ? -5 : 0,
                        marginLeft: 2,
                        color: commonTabBarHighlightColor(global.theme),
                        fontWeight: "bold",
                        width: global.device == "2" ? 34 : 24,
                      }}
                    />
                  ) : (
                    <Ionicons
                      name="bookmark-outline"
                      size={global.device == "2" ? 30 : 24}
                      style={[
                        {
                          marginVertical: global.device == "2" ? -5 : 0,
                          marginLeft: 2,
                        },
                        commonForeground(global.theme),
                        { width: global.device == "2" ? 34 : 24 },
                      ]}
                    />
                  ),
                tabBarAccessibilityLabel: i18n.t("accessibilityForyouTab3"),
              }}
            />
      <Tab.Screen
        name="SettingScreen"
        component={SettingStackScreen}
        options={{
          tabBarLabel: i18n.t("settings"),
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <Ionicons
                name="settings"
                size={global.device == "2" ? 30 : 24}
                style={{
                  marginVertical: global.device == "2" ? -5 : 0,
                  marginLeft: 2,
                  color: commonTabBarHighlightColor(global.theme),
                  fontWeight: "bold",
                  width: global.device == "2" ? 34 : 24,
                }}
              />
            ) : (
              <Ionicons
                name="settings-outline"
                size={global.device == "2" ? 30 : 24}
                style={[
                  {
                    marginVertical: global.device == "2" ? -5 : 0,
                    marginLeft: 2,
                  },
                  commonForeground(global.theme),
                  { width: global.device == "2" ? 34 : 24 },
                ]}
              />
            ),
          tabBarAccessibilityLabel: i18n.t("accessibilitySettingsTab4"),
        }}
      />
    </Tab.Navigator>
  );
}
