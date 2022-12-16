/** @format */

import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  BackHandler,
  Alert,
  LogBox,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
  useFocusEffect,
  useIsFocused,
  LinkingOptions,
  useLinkTo,
} from "@react-navigation/native";
import { useScreenOrientation } from "./Hooks/useScreenOrientation";
import * as Linking from "expo-linking";
import { createStackNavigator } from "@react-navigation/stack";
import i18n from "./resources.js";
import { commonSize } from "./normalize";
import "./settings.js";
import HomeScreen from "./screens/HomeScreen.js";
import MainScreen from "./screens/Main";
import TermAndConditionScreen from "./screens/TermAndConditionScreen";
import WelcomePrivacyScreen from "./screens/WelcomePrivacyScreen";
import TermAndConditionWarningScreen from "./screens/TermAndConditionWarningScreen";
import LanguageScreen from "./screens/Language";
import HomeTab from "./screens/HomeTab";
import WelcomeScreen from "./screens/WelcomeScreen";
import LoadingScreen from "./screens/LoadingScreen";
import BrowseScreen from "./screens/BrowseScreen";
import BrowseSearchScreen from "./screens/BrowseSearchScreen";
import DisplayArticleWebViewScreen from "./screens/DisplayArticleWebViewScreen";
import ContactUs from "./screens/ContactUs";
import NotificationListScreen from "./screens/NotificationListScreen";
import SubjectInterestScreen from "./screens/SubjectInterest";
import FollowingStackScreen from "./screens/FollowingStackScreen";
import WelcomeTermsScreen from "./screens/WelcomeTermsScreen";
import FollowingListScreen from "./screens/FollowingListScreen";
import GroupingTestScreen from "./screens/GroupingTestScreen";
import SavedItemScreen from "./screens/SavedItemScreen";
import FollowingScreen from "./screens/FollowingScreen";
import { Tab } from "react-native-elements";
const Stack = createStackNavigator();
LogBox.ignoreLogs([`Can't perform a React state update`]);
console.ignoredYellowBox = [`Can't perform a React state update`];
const prefix = Linking.makeUrl("/");
const linking: LinkingOptions = {
  prefixes: [
    prefix,
    "stc://",
    "https://www.statcan.gc.ca/o1/en/api/plus",
    "https://www.statcan.gc.ca/o1/fr/api/plus",
    "https://www.statcan.gc.ca",
  ],
  config: {
    screens: {
      DisplayArticle: "article/:id",
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Publications: "publications",
            },
          },
        },
      },
    },
  },
};

export default function App({ navigation }) {
  /* A custom hook that is used to lock the screen orientation to all. */
  // useScreenOrientation(3);

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  // React.useLayoutEffect(() => {
  // ScreenOrientation.unlockAsync();
  // }, []);
  const isLoadingComplete = LoadingScreen();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          screenOptions={{ headerShown: false, gestureEnabled: false }}
          initialRouteName={
            global.init == 0
              ? "Language"
              : global.init == 1
              ? "Welcome"
              : global.init == 2
              ? "TermAndCondition"
              : "Main"
          }
        >
          <Stack.Screen name="Language" component={LanguageScreen} />
          <Stack.Screen
            name="WelcomePrivacy"
            component={WelcomePrivacyScreen}
          />
          <Stack.Screen name="WelcomeTerms" component={WelcomeTermsScreen} />
          <Stack.Screen
            name="TermAndCondition"
            component={TermAndConditionScreen}
          />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="ContactUs" component={ContactUs} />
          <Stack.Screen name="Browse" component={BrowseScreen} />
          <Stack.Screen name="BrowseSearch" component={BrowseSearchScreen} />
          <Stack.Screen name="FollowingList" component={FollowingListScreen} />
          <Stack.Screen name="GroupingTest" component={GroupingTestScreen} />
          <Stack.Screen
            name="DisplayArticle"
            component={DisplayArticleWebViewScreen}
            options={{ gestureEnabled: true }}
          />
          <Stack.Screen
            name="NotificationList"
            component={NotificationListScreen}
          />
          <Stack.Screen name="Interest" component={SubjectInterestScreen} />
          {/* <Stack.Screen name="FollowingScreen" component={FollowingScreen}/> */}
          <Stack.Screen name="HomeTabScreen" component={HomeTab} />
          <Stack.Screen name="SavedItem" component={SavedItemScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
