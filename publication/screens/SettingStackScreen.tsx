/** @format */

// Tab View inside Navigation Drawer
// https://aboutreact.com/tab-view-inside-navigation-drawer-sidebar-with-react-navigation/

import React, { useEffect, useState,useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
//import {useNavigation} from '!@react-navigation/native';
import {
  Button,
  View,
  Text,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,AppState,Appearance,
} from "react-native";
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
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
import RadioButton from "expo-radio-button";

import SettingScreen from "./SettingScreen";
import LanguageSettingScreen from "./LanguageSetting";
import StyleSettingScreen from "./StyleSetting";
import ThemeSettingScreen from "./ThemeSetting";
import NotificationSettingScreen from "./NotificationSetting";
import SubjectsFollowingSettingScreen from "./SubjectsFollowingSetting";
import HelpSettingScreen from "./HelpSetting";
//import SubmitQuestionSettingScreen from "./SubmitQuestionSetting";

import AboutAppSettingScreen from "./AboutAppSetting";
import BrowserSettingScreen from "./BrowserSetting";
import PrivacySettingScreen from "./PrivacySetting";
import TermConditionSettingScreen from "./TermConditionSetting";
import SocialMediaSettingScreen from "./SocialMediaSetting";

function LogoTitle() {
  return <Feather name="chevron-right" size={24} />;
}
const SettingStackScreen = ({ navigation }) => {
  const Stack = createStackNavigator();
  const [theme, setTheme] = useState(global.theme);
 const appState = useRef(AppState.currentState);const isFocused = useIsFocused();
React.useEffect(
    () =>{
      navigation.addListener("blur", () => {
        navigation.reset({index: 0,routes: [{ name: 'Settings' }],});
      });
       navigation.addListener("focus", () => {global.screen="SettingStack";});
      },
    []
  );
useFocusEffect(
        React.useCallback(() => {
          const subscriptionF = AppState.addEventListener("change", handleAppStateChangeF);console.log('subscription removed in SettingStack');
              return () =>{if(subscriptionF)subscriptionF.remove();console.log('subscription removed in SettingStack'); }
        }, [])
      );
const handleAppStateChangeF = nextAppState => {
   console.log('SettingStack detected state change:',global.screen);//if(global.screen=="Settings")navigation.navigate("Settings");
    if(global.screen.includes("SettingStack")){
       try{
          if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                      global.colorScheme = Appearance.getColorScheme();setTheme(global.theme);
                      console.log('SettingStack.......App has come to the foreground! scheme:',global.colorScheme);
          }
          appState.current = nextAppState;
       }catch(err){console.log('err in SettingStack');return;}
    }
}


  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Settings"
    >
      <Stack.Screen name="Settings" component={SettingScreen} />
      <Stack.Screen name="LanguageSetting" component={LanguageSettingScreen} />
      <Stack.Screen name="StyleSetting" component={StyleSettingScreen} />
      <Stack.Screen name="ThemeSetting" component={ThemeSettingScreen} />
      <Stack.Screen
        name="NotificationSetting"
        component={NotificationSettingScreen}
      />
      <Stack.Screen
        name="SubjectsSetting"
        component={SubjectsFollowingSettingScreen}
      />
      <Stack.Screen name="HelpSetting" component={HelpSettingScreen} />
      <Stack.Screen
        name="SocialMediaSetting"
        component={SocialMediaSettingScreen}
      />
      <Stack.Screen
        name="TermConditionSetting"
        component={TermConditionSettingScreen}
      />
      <Stack.Screen name="AboutAppSetting" component={AboutAppSettingScreen} />
      <Stack.Screen name="BrowserSetting" component={BrowserSettingScreen} />
      <Stack.Screen name="PrivacySetting" component={PrivacySettingScreen} />
    </Stack.Navigator>
  );
};
export default SettingStackScreen;
