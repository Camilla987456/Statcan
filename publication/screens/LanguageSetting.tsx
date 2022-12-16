/** @format */

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  AppState,
  Appearance,
  AccessibilityInfo,
  useWindowDimensions
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../settings.js";
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
  commonBorder,
  commonSettingBackground,
} from "../normalization.js";
import { Feather } from "@expo/vector-icons";


// This screen is used to select the language of the app.
const LanguageSettingScreen = ({ navigation }) => {
  const [isFrench, setIsFrench] = useState(i18n.isFrench);
  const [name, setName] = useState("");
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [theme, setTheme] = useState(global.theme);

  const [count, setCount] = useState(0);
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();

  React.useEffect(
    () =>
      navigation.addListener("focus", () => {
        setZoom(global.zoom);
        indicator = global.indicator;
        setCount(global.indicator);
        setBold(global.bold);
        global.screen = "Settings";
        global.SubScreen = "LanguageSettings";
        setName(i18n.t("language"));
        setTheme(global.theme);
      }),
    []
  );

  useFocusEffect(
    React.useCallback(() => {
      const subscriptionF = AppState.addEventListener(
        "change",
        handleAppStateChangeF
      );
      console.log("subscription removed in LanguageSettings");
      return () => {
        if (subscriptionF) subscriptionF.remove();
        console.log("subscription removed in LanguageSettings");
      };
    }, [])
  );
  const handleAppStateChangeF = (nextAppState) => {
    console.log(
      "LanguageSettings1 detected state change:",
      global.screen,
      "sub:",
      global.subScreen,
      "State:",
      appState
    ); //if(global.screen=="Settings")navigation.navigate("Settings");
    if (global.screen == "Settings" && global.SubScreen == "LanguageSettings") {
      try {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          global.colorScheme = Appearance.getColorScheme();
          global.indicator++;
          setCount(global.indicator);
          setTheme(global.theme);
          console.log(
            "LanguageSettings2.......App has come to the foreground! scheme:",
            global.colorScheme,
            commonBackground(theme)
          );
        }
        appState.current = nextAppState;
      } catch (err) {
        console.log("err in LanguageSetting");
        return;
      }
    }
  };

  // This function is called to set the language of the app.
  const toggleSwitch = () => {
    setIsFrench((previousState) => !previousState);
    i18n.toogle();
    setName(i18n.t("language"));
    AsyncStorage.setItem("Culture", i18n.locale);
    navigation.navigate("SettingScreen");
  };
  AccessibilityInfo.isScreenReaderEnabled().then((screenReaderEnabled) => {
    setScreenReaderEnabled(screenReaderEnabled);
  });
  AccessibilityInfo.isScreenReaderEnabled().then((screenReaderEnabled) => {
    setScreenReaderEnabled(screenReaderEnabled);
  });

  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
      {/* This View is used to display the header of the screen. */}
      <View style={[commonBackground(theme), isLandscapeMode? styles.headerLandscape:styles.header]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessible={true}
          onPress={() => navigation.navigate("Settings")}
          accessibilityLabel={i18n.t("goBack")}
        >
          <Feather
            name="chevron-left"
            size={global.device == "2" ? 50 : 25}
            style={[styles.backButton, commonForegroundDes(theme)]}
          />
        </TouchableOpacity>
        <Text
          style={[
            CommonZoomStyle("medium", { zoom }),
            commonFontWeight({ bold }),
            isLandscapeMode? styles.headerTextLandscape:styles.headerText,
            commonForegroundDes(theme),
          ]}
          accessibilityRole="header"
          accessible={true}
        >
          {name}
        </Text>
      </View>

      {/* This View is used to display the language of the app. */}
      <View style={[commonSettingBackground(theme), styles.languageContainer]}>
        {/* English Button */}
        <TouchableOpacity
          accessibilityRole="button"
          accessible={true}
          accessibilityState={{
            [isFocused ? "checked" : "unchecked"]: !isFrench,
          }}
          onPress={toggleSwitch}
        >
          <View style={styles.englishContainer}>
            <Text
              style={[
                CommonZoomStyle("small", { zoom }),
                commonForegroundDes(theme),
                styles.label,
              ]}
            >
              {i18n.t("english")}
            </Text>

            {!isFrench && (
              <View style={[commonBorder(theme), styles.checkerContainer]}>
                <Image
                  style={styles.checkMark}
                  source={require("../assets/Option_checked.png")}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Francais Button */}
        <TouchableOpacity
          accessibilityRole="button"
          accessible={true}
          accessibilityState={{
            [isFocused ? "checked" : "unchecked"]: isFrench,
          }}
          onPress={toggleSwitch}
        >
          <View style={styles.frContainer}>
            <Text
              style={[
                CommonZoomStyle("small", { zoom }),
                commonForegroundDes(theme),
                styles.label,
              ]}
            >
              {i18n.t("french")}
            </Text>

            {isFrench && (
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
    </SafeAreaView>
  );
};

// Styles for the screen.
const styles = StyleSheet.create({
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
  headerText: {
    flex: 1,
    textAlign: "center",
    marginRight: "15%",
  },
  headerTextLandscape: {
    flex: 1,
    textAlign: "center",
    marginRight: "15%",
    marginTop:'1.3%'
  },
  backButton: { paddingHorizontal: "4%", marginTop: 10, marginBottom: 10 },

  // Styling for the language selection container.
  languageContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  englishContainer: {
    flexDirection: "row",
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    justifyContent: "space-between",
  },

  label: {
    textAlign: "center",
    marginLeft: 10,
    marginVertical: 5,
    marginBottom: 10,
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

  frContainer: {
    flexDirection: "row",
    margin: 10,
    marginVertical: 2,
    marginTop: -5,
    borderBottomWidth: 0,
    justifyContent: "space-between",
  },
});
// Export the screen.
export default LanguageSettingScreen;
