/** @format */

import React, { useEffect, useState,useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  DevSettings,
  Image,StatusBar,AppState,Appearance,
  useWindowDimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../settings.js";
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import i18n from "../resources.js";
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonForegroundDes,
  commonCardBackground,
  commonBorder,themeLiteral, commonSettingBackground
} from "../normalization.js";
import { Feather } from "@expo/vector-icons";

import Constants from 'expo-constants';


// This screen is used to set the theme of the app.
const ThemeSettingScreen = ({ navigation }) => {
  const [theme, setTheme] = useState(global.theme);
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
   const { width, height } = useWindowDimensions();
   const isLandscapeMode = width > height ? true : false;
  const [name, setName] = useState("");const [count, setCount] = useState(0);

   let index=themeLiteral()=="light"?0:1;
const [statusBarStyle, setStatusBarStyle] = useState(global.STYLES[index]);
const [statusBarColor, setStatusBarColor] = useState(Platform.OS === 'ios'?global.COLORSIOS[index]:global.COLORS[index]);
 const appState = useRef(AppState.currentState);const isFocused = useIsFocused();
  React.useEffect(
    () =>
      navigation.addListener("focus", () => {
        setZoom(global.zoom);
        setBold(global.bold);
        setName(i18n.t("colorTheme"));
        setTheme(global.theme);
        global.screen="Settings";global.SubScreen="ThemeSetting";


      }),
    []
  );

      useFocusEffect(
           React.useCallback(() => {
             const subscriptionF = AppState.addEventListener("change", handleAppStateChangeF);console.log('subscription removed in ThemeSetting');
                 return () =>{if(subscriptionF)subscriptionF.remove();console.log('subscription removed in ThemeSetting'); }
           }, [])
         );
   const handleAppStateChangeF = nextAppState => {
      console.log('ThemeSetting1 detected state change:',global.screen,'sub:',global.subScreen,'State:',appState);//if(global.screen=="Settings")navigation.navigate("Settings");
      if(global.screen=="Settings" && global.SubScreen=="ThemeSetting"){
          try{
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                 global.colorScheme = Appearance.getColorScheme();global.indicator++;setCount(global.indicator);setTheme(global.theme);
                 console.log('ThemeSetting2.......App has come to the foreground! scheme:',global.colorScheme,commonBackground(theme));
                index=themeLiteral()=="light"?0:1;setStatusBarStyle(global.STYLES[index]); setStatusBarColor(Platform.OS === 'ios'?global.COLORSIOS[index]:global.COLORS[index]);
            }
            appState.current = nextAppState;
          }catch(err){console.log('err in ThemeSetting');return;}
      }
   }

 const toggleSwitch = (t) => {

     setTheme(t);
     AsyncStorage.setItem("Theme", t.toString());
     global.theme = t;
     let index=themeLiteral()=="light"?0:1;
     setStatusBarStyle(global.STYLES[index]); setStatusBarColor(Platform.OS === 'ios'?global.COLORSIOS[index]:global.COLORS[index]);

 
               // DevSettings.reload();
     navigation.navigate("SettingScreen");
     // navigation.navigate("Main");
   //  navigation.navigate("Settings");


  };

  return (<>
       {Platform.OS == "ios" && <View style={{height: Constants.statusBarHeight,backgroundColor:statusBarColor}}><StatusBar translucent barStyle={statusBarStyle} /></View>}
       <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
        {/* This View is used to display the header of the screen. */}
        <View
          style={[
            commonBackground(theme),
            isLandscapeMode ? styles.headerLandscape : styles.header,
          ]}
        >
          <TouchableOpacity
            style={{}}
            accessibilityRole="button"
            accessible={true}
            onPress={() => navigation.navigate("Settings")}
          >
            <Feather
              name="chevron-left"
              size={global.device == "2" ? 50 : 25}
              style={[isLandscapeMode?styles.backButtonLandscape:styles.backButton, commonForegroundDes(theme)]}
            />
          </TouchableOpacity>
          <Text
            style={[
              CommonZoomStyle("medium", { zoom }),
              commonFontWeight({ bold }),
              commonForegroundDes(theme),
              isLandscapeMode ? styles.headerTextLandscape : styles.headerText
             
            ]}
            accessibilityRole="header"
            accessible={true}
          >
            {name}
          </Text>
        </View>

        {/* This View is used to display the theme options. */}
        <View style={[commonSettingBackground(theme), styles.optionsContainer]}>
          <TouchableOpacity
            accessibilityRole="button"
            accessible={true}
            onPress={() => toggleSwitch(0)}
          >
            <View style={styles.labelContainer}>
              <Text
                style={[
                  CommonZoomStyle("small", { zoom }),
                  commonForegroundDes(theme),
                  styles.label,
                ]}
              >
                {i18n.t("auto")}
              </Text>
              {theme == 0 && (
                <View style={[commonBorder(theme), styles.checkerContainer]}>
                  <Image
                    style={styles.checkMark}
                    source={require("../assets/Option_checked.png")}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessible={true}
            onPress={() => toggleSwitch(1)}
          >
            <View style={styles.lightContainer}>
              <Text
                style={[
                  CommonZoomStyle("small", { zoom }),
                  commonForegroundDes(theme),
                  styles.label,
                ]}
              >
                {i18n.t("light")}
              </Text>
              {theme == 1 && (
                <View style={[commonBorder(theme), styles.checkerContainer]}>
                  <Image
                    style={styles.checkMark}
                    source={require("../assets/Option_checked.png")}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessible={true}
            onPress={() => toggleSwitch(2)}
          >
            <View style={styles.labelContainer2}>
              <Text
                style={[
                  CommonZoomStyle("small", { zoom }),
                  commonForegroundDes(theme),
                  styles.label,
                ]}
              >
                {i18n.t("dark")}
              </Text>
              {theme == 2 && (
                <View style={[commonBorder(theme), styles.checkerContainer]}>
                  <Image
                    style={styles.checkMark}
                    source={require("../assets/Option_checked.png")}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        {Platform.OS == "android" && (
          <StatusBar
            barStyle={statusBarStyle}
            backgroundColor={statusBarColor}
          />
        )}
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  label: {
    textAlign: "center",
    marginLeft: 10,
    marginVertical: 5,
    marginBottom: 10,
  },
  labelContainer: {
    flexDirection: "row",
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    justifyContent: "space-between",
  },
  labelContainer2: {
    flexDirection: "row",
    margin: 10,
    marginTop: 5,
    marginBottom: 3,
    justifyContent: "space-between",
  },
  // Styling for the header.
  header: {
    borderWidth: 1,
    padding: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    elevation: 0,
    borderColor: "#CCD1D7",
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    marginRight: "8%",
  },
  headerLandscape: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    elevation: 0,
    borderColor: "#CCD1D7",
    marginHorizontal: -50,
    width: "113%",
    paddingLeft: 30,
    paddingRight: 50,
    padding: "-20%",
    height: Platform.OS == "android" ? "16%" : "14%",
    flexDirection: "row",
  },

  headerTextLandscape: {
    flex: 1,
    textAlign: "center",
    marginRight: "15%",
    marginTop: '0%',
  },
  backButton: { paddingHorizontal: "4%", marginTop: 10, marginBottom: 10 },
  backButtonLandscape: { paddingHorizontal: "4%", marginTop: 0, marginBottom: 10 },
  optionsContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  checkerContainer: {
    marginVertical: "1%",
    borderWidth: 1,
    marginRight: 5,
    borderRadius: commonZoomSize("large", zoom) / 10,
    width: commonZoomSize("large", zoom),
    height: commonZoomSize("large", zoom),
    borderColor: "#26374A",
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    width: Platform.OS === "android" ? "160%" : "96%",
    height: Platform.OS === "android" ? "102%" : "100%",
    resizeMode: "contain",
  },
  lightContainer: {
    flexDirection: "row",
    margin: 10,
    marginVertical: 2,
    marginTop: -5,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    justifyContent: "space-between",
  },
});
export default ThemeSettingScreen;
