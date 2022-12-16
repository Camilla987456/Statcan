/** @format */

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  AppState,
  Appearance,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonForegroundDes,
  commonCardBackground,
  themeLiteral,
  commonForegroundSlider,
  commonSettingBackground,
} from "../normalization.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import "../settings.js";
import i18n from "../resources.js";
import { Feather } from "@expo/vector-icons";

// This screen is used to set the style(size,bold) of the text.
const StyleSettingScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [zoom, setZoom] = useState(global.zoom);
  const [theme, setTheme] = useState(global.theme);
  const [bold, setBold] = useState(global.bold);
  const [fontLoaded, setFontLoaded] = useState(false);
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  // UseEffect hook to set the state of the screen.
  React.useEffect(
    () =>
      navigation.addListener("focus", () => {
        setZoom(global.zoom);
        setBold(global.bold);
        setTheme(global.theme);
        setName(i18n.t("textSize"));
        global.screen = "Settings";
        global.SubScreen = "StyleSettings";
        global.indicator++;
        setCount(global.indicator);
      }),
    []
  );

  useFocusEffect(
    React.useCallback(() => {
      const subscriptionF = AppState.addEventListener(
        "change",
        handleAppStateChangeF
      );
      console.log("subscription removed in StyleSettings");
      return () => {
        if (subscriptionF) subscriptionF.remove();
        console.log("subscription removed in StyleSettings");
      };
    }, [])
  );
  const handleAppStateChangeF = (nextAppState) => {
    console.log(
      "StyleSettings1 detected state change:",
      global.screen,
      "sub:",
      global.subScreen,
      "State:",
      appState
    ); //if(global.screen=="Settings")navigation.navigate("Settings");
    if (global.screen == "Settings" && global.SubScreen == "StyleSettings") {
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
            "StyleSettings2.......App has come to the foreground! scheme:",
            global.colorScheme,
            commonBackground(theme)
          );
        }
        appState.current = nextAppState;
      } catch (err) {
        console.log("err in StyleSetting");
        return;
      }
    }
  };

  const toggleSwitch = () => {
    global.bold = !global.bold;
    AsyncStorage.setItem("Bold", global.bold.toString());
    setBold((previousState) => !previousState);
    setName(i18n.t("textSize"));
    navigation.navigate("SettingScreen");
  };
  const sliderValueChange = (v) => {
    // console.log('slider:'+v);
  };
  const sliderCompleted = (v) => {
    global.zoom = v;
    setZoom(v);
    AsyncStorage.setItem("Zoom", global.zoom.toString());
    console.log("Completed:" + JSON.stringify(CommonStyles.xlargeFont));
    setName(i18n.t("textSize"));
    navigation.navigate("SettingScreen");
  };
  const sliderStart = (v) => {
    console.log("slider start:" + v);
  };


  return (
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
            commonForegroundDes(theme),
            isLandscapeMode ? styles.headerTextLandscape : styles.headerText,
          ]}
          accessibilityRole="header"
          accessible={true}
        >
          {name}
        </Text>
      </View>

      {/* This View is used to display the bold text button and the slider for the text size  */}
      <View style={[{ marginTop: 20 }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessible={true}
          onPress={toggleSwitch}
        >
          {/* This View has a switch which is used to toggle the bold text. */}
          <View
            style={[
              commonSettingBackground(theme),
              {
                padding: 9,
                flexDirection: "row",
                margin: 10,
                justifyContent: "space-between",
                borderRadius: 5,
              },
            ]}
          >
            <Text
              style={[
                CommonZoomStyle("small", { zoom }),
                commonForegroundDes(theme),
                styles.label,
              ]}
            >
              {i18n.t("boldText")}
            </Text>

            <Switch
              trackColor={{ false: "#00000026", true: "#34C759" }}
              thumbColor={bold ? "#FFFFFF" : "#FFFFFF"}
              onValueChange={toggleSwitch}
              value={bold}
              style={{
                marginTop: global.device == "2" ? "1%" : 0,
                marginBottom: global.device == "2" ? "1%" : 0,
                transform: [
                  { scaleX: Platform.OS == "android" ? 1.2 : 1.0 },
                  { scaleY: Platform.OS == "android" ? 1.2 : 1.0 },
                ],
              }}
            />
          </View>
        </TouchableOpacity>

        {/* This View has a slider which is used to change the text size. */}
        <TouchableOpacity
          accessibilityRole="button"
          accessible={true}
          onPress={toggleSwitch}
        >
          <View
            style={[
              commonSettingBackground(theme),
              {
                padding: 3,
                flexDirection: "row",
                margin: 10,

                borderRadius: 5,
              },
            ]}
          >
            <Text style={[commonForegroundSlider(theme), styles.sliderLabel]}>
              A
            </Text>
            <View style={styles.startSLider}></View>
            <View style={styles.secondSlider}></View>
            <View style={styles.thirdSlider}></View>

            <Slider
              style={{
                width: global.device == "2" ? "93%" : "84%",
                height: 40,
              }}
              value={zoom}
              minimumValue={global.device == "2" ? 0.4 : 0.5}
              maximumValue={global.device == "2" ? 1.4 : 1.5}
              minimumTrackTintColor={
                Platform.OS === "android" ? "#707070" : "#007AFC"
              }
              thumbTintColor={Platform.OS === "android" ? "#707070" : "white"}
              maximumTrackTintColor={global.theme == 2 ? "white" : "#78788065"}
              onValueChange={sliderValueChange}
              onSlidingComplete={sliderCompleted}
              onSlidingStart={sliderStart}
            />
            <View style={styles.endSLider}></View>
            <Text style={[commonForegroundSlider(theme), styles.sliderLabel2]}>
              A
            </Text>
          </View>
          <View>
            <Text style={[commonForegroundDes(theme), styles.sliderInfo]}>
              {i18n.t("sliderText")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
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
    marginTop: "1.3%",
  },
  backButton: { paddingHorizontal: "4%", marginTop: 10, marginBottom: 10 },
  btnNext: {
    width: 100,
    backgroundColor: "darkblue",
  },
  image: {
    maxWidth: 250,
    minWidth: 250,
    height: 60,
  },
  label: {
    textAlign: "left",
    marginVertical: Platform.OS === "android" ? 3 : 7,
    marginBottom: 0,
  },
  sliderLabel: {
    fontSize: 13,
    textAlign: "left",
    marginVertical: Platform.OS === "android" ? 9 : 12,
    marginBottom: 0,
    marginRight: 10,
    marginLeft: 6,
    fontWeight: "bold",
  },
  sliderLabel2: {
    fontSize: 24,
    textAlign: "left",
    marginVertical: Platform.OS === "android" ? 5 : 6,
    marginBottom: 0,
    marginLeft: Platform.OS === "android" ? 20 : 10,
    fontWeight: "bold",
  },
  startSLider: {
    width: 4,
    height: 15,
    position: "absolute",
    top: Platform.OS === "android" ? 14.5 : 15.5,
    left: Platform.OS === "android" ? 40 : 28,
    right: 0,
    backgroundColor: themeLiteral() == "light" ? "#78788065" : "white",
    borderRadius: 5,
  },
  secondSlider: {
    width: 3,
    height: 16,
    position: "absolute",
    top: Platform.OS === "android" ? 14.5 : 15,
    left: Platform.OS === "android" ? 100 : 100,
    right: 0,
    backgroundColor: themeLiteral() == "light" ? "#78788065" : "white",
    borderRadius: 5,
  },
  thirdSlider: {
    width: 3,
    height: 16,
    position: "absolute",
    top: Platform.OS === "android" ? 14.5 : 15,
    left: Platform.OS === "android" ? 250 : 250,
    right: 0,
    backgroundColor: themeLiteral() == "light" ? "#78788065" : "white",
    borderRadius: 5,
  },
  endSLider: {
    width: 4,
    height: 15,
    marginVertical: Platform.OS === "android" ? 12 : 12,
    marginLeft: Platform.OS === "android" ? -16 : -4,
    backgroundColor: themeLiteral() == "light" ? "#78788065" : "white",
    borderRadius: 5,
  },
  sliderInfo: {
    fontSize: Platform.OS == "android" ? 12 : 12,
    textAlign: "center",
  },
});
export default StyleSettingScreen;
