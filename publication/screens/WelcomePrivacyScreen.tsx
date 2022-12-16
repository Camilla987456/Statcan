/** @format */

import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  CheckBox,
  Image,
  TouchableOpacity,
  ActivityIndicator,
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
  commonCardBackground,
  commonForegroundDes,
} from "../normalization.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import "../settings.js";
import i18n from "../resources.js";
import { Feather } from "@expo/vector-icons";
const banner = require("../assets/img_canadamdpi.png");

const WelcomePrivacyScreen = ({ route, navigation }) => {
  const { url, title } = route.params;
  console.log("title:" + title + "  url:============" + url);
  const [name, setName] = useState("");
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const [theme, setTheme] = useState(global.theme);
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [count, setCount] = useState(0);
  const webviewRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();

  const js =
    title == "privacyPolicy" || title == "contactus"
      ? `(function () {
                     var d1 = document.getElementsByTagName("header"); if (d1.length > 0) d1[0].style.display = "none";
                     var d2 = document.getElementById("wb-cont"); if (d2 != null) d2.style.display = "none";
                     var d3 = document.querySelectorAll("div.row.pagedetails"); if (d3.length > 0) d3[0].style.display = "none";
                     var d4 = document.querySelectorAll("div.pull-right.mrgn-lft-sm"); if (d4.length > 0) d4[0].style.display = "none";
                     var d5 = document.getElementById("wb-info"); if (d5 != null) d5.style.display = "none";
                     var d6 = document.getElementById("lz_overlay_chat"); if (d6 != null) d6.style.display = "none";
                     var d7 = document.getElementById("lz_overlay_wm"); if (d7 != null) d7.style.display = "none!important";
                     var d8 = document.getElementById("lz_overlay_preview"); if (d8 != null) d8.style.display = "none";
                     var d9 = document.querySelectorAll("div.row.mrgn-tp-md"); if (d9.length > 0) d9[0].style.display = "none";
                     var d10 = document.querySelectorAll("div.mrgn-bttm-md.text-right");if(d10.length>0)d10[0].style.display = "none";
                 })();`
      : "";
  const [jscode, setJscode] = useState(js);

  const backButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.goBack();
    setCanGoBack(!canGoBack);
  };
  const frontButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.goForward();
    setCanGoForward(!canGoForward);
  };
  React.useEffect(
    () =>
      navigation.addListener("focus", () => {
        setZoom(global.zoom);
        setBold(global.bold);
        setName(i18n.t(title));
        setTheme(global.theme);
        setJscode(js);
        global.screen = "BrowserSetting";
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
      console.log("subscription removed in BrowserSetting");
      return () => {
        if (subscriptionF) subscriptionF.remove();
        console.log("subscription removed in BrowserSetting");
      };
    }, [])
  );
  const handleAppStateChangeF = (nextAppState) => {
    console.log(
      "BrowserSetting1 detected state change:",
      global.screen,
      "sub:",
      global.subScreen,
      "State:",
      appState
    ); //if(global.screen=="Settings")navigation.navigate("Settings");
    if (global.screen == "BrowserSetting") {
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
            "BrowserSetting2.......App has come to the foreground! scheme:",
            global.colorScheme,
            commonBackground(theme)
          );
        }
        appState.current = nextAppState;
      } catch (err) {
        console.log("err in PrivacySetting");
        return;
      }
    }
  };

  const displaySpinner = () => {
    return (
      <View>
        <ActivityIndicator
          size="large"
          style={{ position: "absolute", top: "50%", left: "50%", zIndex: 20 }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
      <View
        style={[
          commonCardBackground(theme),
          isLandscapeMode ? styles.headerLandscape : styles.header,
        ]}
      >
        <TouchableOpacity
          style={{}}
          accessibilityRole="button"
          accessible={true}
          onPress={() => navigation.navigate("Welcome")}
          accessibilityLabel={i18n.t("goBack")}
        >
          <Feather
            name="x"
            size={global.device == "2" ? 50 : 18}
            style={[
              commonForegroundDes(theme),
              { paddingHorizontal: "4%", marginTop: 10, marginBottom: 10 },
            ]}
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
      <View
        style={{
          flex: 1,
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
        }}
      >
        <WebView
          source={{ uri: url }}
          style={{ marginTop: 0 }}
          renderLoading={() => {
            return displaySpinner();
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          injectedJavaScript={jscode}
          showsVerticalScrollIndicator={false}
          onMessage={(event) => {
            var msg = event.nativeEvent.data;
          }}
          ref={webviewRef}
          onNavigationStateChange={(navState) => {
            console.log(
              "current url on navigation state change:" + navState.url
            );
            setCanGoBack(navState.canGoBack);
            setCanGoForward(navState.canGoForward);
            setCurrentUrl(navState.url);
          }}
        />
        <View style={styles.tabBarContainer}>
          <TouchableOpacity
            accessibilityRole="button"
            accessible={true}
            disabled={!canGoBack}
            onPress={backButtonHandler}
          >
            {canGoBack ? (
              <Feather
                name="chevron-left"
                size={global.device == "2" ? 50 : 24}
                color="black"
              />
            ) : (
              <Feather
                name="chevron-left"
                size={global.device == "2" ? 50 : 24}
                color="gray"
              />
            )}
          </TouchableOpacity>
          <View style={styles.tabBarContainer2}>
            <TouchableOpacity
              accessibilityRole="button"
              accessible={true}
              disabled={!canGoForward}
              onPress={frontButtonHandler}
            >
              {canGoForward ? (
                <Feather
                  name="chevron-right"
                  size={global.device == "2" ? 50 : 24}
                  color="black"
                />
              ) : (
                <Feather
                  name="chevron-right"
                  size={global.device == "2" ? 50 : 24}
                  color="gray"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
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
  headerText: {
    flex: 1,
    textAlign: "center",
    marginRight: "15%",
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
    marginTop: "1.3%",
  },
  backButton: { paddingHorizontal: "4%", marginTop: 10, marginBottom: 10 },
  tabBarContainer: {
    padding: 7,
    flexDirection: "row",
    paddingHorizontal: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#26374A",
  },
  tabBarContainer2: {
    padding: 0,
    paddingHorizontal: 25,
  },
});

export default WelcomePrivacyScreen;
