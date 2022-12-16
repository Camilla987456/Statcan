/** @format */

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Platform,
  AppState,
  Appearance,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonFrameBackground,
  commonBorder,
  commonForegroundDes,
  commonCardBackground,
  commonSettingBackground,
} from "../normalization.js";
import { Divider } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../settings.js";
import i18n from "../resources.js";
import { Feather, Ionicons } from "@expo/vector-icons";

// This is the screen that allows the user to change the social media settings
const SocialMediaSettingScreen = ({ navigation }) => {
  const [isFrench, setIsFrench] = useState(i18n.isFrench);
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [theme, setTheme] = useState(global.theme);
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  // This function is called when the screen is loaded
  React.useEffect(
    () =>
      navigation.addListener("focus", () => {
        setZoom(global.zoom);
        setBold(global.bold);
        setTheme(global.theme);
        setName(i18n.t("socialmedia"));
        global.indicator++;
        global.screen = "Settings";
        global.SubScreen = "SocialMediaSetting";
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
      console.log("subscription removed in SocialMediaSetting");
      return () => {
        if (subscriptionF) subscriptionF.remove();
        console.log("subscription removed in SocialMediaSetting");
      };
    }, [])
  );
  const handleAppStateChangeF = (nextAppState) => {
    console.log(
      "SocialMediaSetting1 detected state change:",
      global.screen,
      "sub:",
      global.subScreen,
      "State:",
      appState
    ); //if(global.screen=="Settings")navigation.navigate("Settings");
    if (
      global.screen == "Settings" &&
      global.SubScreen == "SocialMediaSetting"
    ) {
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
            "SocialMediaSetting2.......App has come to the foreground! scheme:",
            global.colorScheme,
            commonBackground(theme)
          );
        }
        appState.current = nextAppState;
      } catch (err) {
        console.log("err in SocialMedia");
        return;
      }
    }
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
            style={[commonForegroundDes(theme), styles.backButton]}
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
      <ScrollView>
        <View>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
              styles.introMsg,
            ]}
          >
            {i18n.t("socialMediaMsg")}
          </Text>
        </View>
        <View
          style={[
            styles.groupContainer,
            commonSettingBackground(theme),
            commonBorder(theme),
            { marginTop: "4%", marginHorizontal: "4%" },
          ]}
        >
          <TouchableOpacity
            style={styles.touchableBtn}
            accessibilityRole="button"
            accessible={true}
            onPress={() => {
              Linking.openURL(i18n.t("facebookLink"));
            }}
          >
            <View style={styles.touchableBtnContainer}>
              <Image
                style={global.device == "2" ? styles.image2 : styles.image}
                source={require("../assets/icons8-facebook.png")}
              />
              <Text
                style={[
                  commonForeground(theme),
                  CommonZoomStyle("small", { zoom }),
                  styles.label,
                ]}
              >
                {i18n.t("facebook")}
              </Text>
              <Feather
                name="external-link"
                size={global.device == "2" ? 40 : 24}
                style={[
                  commonForegroundDes(theme),
                  global.device == "2"
                    ? styles.touchableIcon2
                    : styles.touchableIcon,
                ]}
              />
            </View>
            <View style={{ marginLeft: 40, marginRight: -10 }}>
              <Divider />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchableBtn}
            accessibilityRole="button"
            accessible={true}
            onPress={() => {
              Linking.openURL(i18n.t("instaLink"));
            }}
          >
            <View style={styles.touchableBtnContainer}>
              <Image
                style={global.device == "2" ? styles.image2 : styles.image}
                source={require("../assets/icons8-instagram.png")}
              />
              <Text
                style={[
                  CommonZoomStyle("small", { zoom }),
                  commonForeground(theme),
                  styles.label,
                ]}
              >
                {i18n.t("insta")}
              </Text>
              <Feather
                name="external-link"
                size={global.device == "2" ? 40 : 24}
                style={[
                  commonForegroundDes(theme),
                  global.device == "2"
                    ? styles.touchableIcon2
                    : styles.touchableIcon,
                ]}
              />
            </View>
            <View style={{ marginLeft: 40, marginRight: -10 }}>
              <Divider />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchableBtn}
            accessibilityRole="button"
            accessible={true}
            onPress={() => {
              Linking.openURL(i18n.t("linkedinLink"));
            }}
          >
            <View style={styles.touchableBtnContainer}>
              <Image
                style={global.device == "2" ? styles.image2 : styles.image}
                source={require("../assets/icons8-linkedin.png")}
              />
              <Text
                style={[
                  CommonZoomStyle("small", { zoom }),
                  commonForeground(theme),
                  styles.label,
                ]}
              >
                {i18n.t("linkedin")}
              </Text>
              <Feather
                name="external-link"
                size={global.device == "2" ? 40 : 24}
                style={[
                  commonForegroundDes(theme),
                  global.device == "2"
                    ? styles.touchableIcon2
                    : styles.touchableIcon,
                ]}
              />
            </View>
            <View style={{ marginLeft: 40, marginRight: -10 }}>
              <Divider />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchableBtn}
            accessibilityRole="button"
            accessible={true}
            onPress={() => {
              Linking.openURL(i18n.t("redditLink"));
            }}
          >
            <View style={styles.touchableBtnContainer}>
              <Image
                style={global.device == "2" ? styles.image2 : styles.image}
                source={require("../assets/icons8-reddit.png")}
              />
              <Text
                style={[
                  CommonZoomStyle("small", { zoom }),
                  commonForeground(theme),
                  styles.label,
                ]}
              >
                {i18n.t("reddit")}
              </Text>
              <Feather
                name="external-link"
                size={global.device == "2" ? 40 : 24}
                style={[
                  commonForegroundDes(theme),
                  global.device == "2"
                    ? styles.touchableIcon2
                    : styles.touchableIcon,
                ]}
              />
            </View>
            <View style={{ marginLeft: 40, marginRight: -10 }}>
              <Divider />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchableBtn}
            accessibilityRole="button"
            accessible={true}
            onPress={() => {
              Linking.openURL(i18n.t("twitterLink"));
            }}
          >
            <View style={styles.touchableBtnContainer}>
              <Image
                style={global.device == "2" ? styles.image2 : styles.image}
                source={require("../assets/icons8-twitter.png")}
              />
              <Text
                style={[
                  CommonZoomStyle("small", { zoom }),
                  commonForeground(theme),
                  styles.label,
                ]}
              >
                {i18n.t("twitter")}
              </Text>
              <Feather
                name="external-link"
                size={global.device == "2" ? 40 : 24}
                style={[
                  commonForegroundDes(theme),
                  global.device == "2"
                    ? styles.touchableIcon2
                    : styles.touchableIcon,
                ]}
              />
            </View>
            <View style={{ marginLeft: 40, marginRight: -10 }}>
              <Divider />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchableBtn}
            accessibilityRole="button"
            accessible={true}
            onPress={() => {
              Linking.openURL(i18n.t("youtubeLink"));
            }}
          >
            <View style={styles.touchableBtnContainer}>
              <Image
                style={global.device == "2" ? styles.image2 : styles.image}
                source={require("../assets/icons8-youtube.png")}
              />
              <Text
                style={[
                  CommonZoomStyle("small", { zoom }),
                  commonForeground(theme),
                  styles.label,
                ]}
              >
                {i18n.t("youtube")}
              </Text>
              <Feather
                name="external-link"
                size={global.device == "2" ? 40 : 24}
                style={[
                  commonForegroundDes(theme),
                  global.device == "2"
                    ? styles.touchableIcon2
                    : styles.touchableIcon,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
              styles.introMsg,
            ]}
          >
            {i18n.t("otherlinks")}
          </Text>
        </View>
        <View
          style={[
            styles.groupContainer,
            commonSettingBackground(theme),
            commonBorder(theme),
            { marginTop: "4%", marginHorizontal: "4%" },
          ]}
        >
          <TouchableOpacity
            style={styles.touchableBtn}
            accessibilityRole="button"
            accessible={true}
            onPress={() => {
              Linking.openURL(i18n.t("websiteLink"));
            }}
          >
            <View style={styles.touchableBtnContainer}>
              <Image
                style={
                  global.device == "2" ? styles.image2 : styles.imageOtherLinks
                }
                source={require("../assets/web.png")}
              />
              <Text
                style={[
                  commonForeground(theme),
                  CommonZoomStyle("small", { zoom }),
                  styles.label,
                ]}
              >
                {i18n.t("website")}
              </Text>
              <Feather
                name="external-link"
                size={global.device == "2" ? 40 : 24}
                style={[
                  commonForegroundDes(theme),
                  global.device == "2"
                    ? styles.touchableIcon2
                    : styles.touchableIcon,
                ]}
              />
            </View>
            <View style={{ marginLeft: 40, marginRight: -10 }}>
              <Divider />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchableBtn}
            accessibilityRole="button"
            accessible={true}
            onPress={() => {
              Linking.openURL(i18n.t("podcastLink"));
            }}
          >
            <View style={styles.touchableBtnContainer}>
              <Image
                style={global.device == "2" ? styles.image2 : styles.image}
                source={require("../assets/ehsayers.png")}
              />
              <Text
                style={[
                  CommonZoomStyle("small", { zoom }),
                  commonForeground(theme),
                  styles.label,
                ]}
              >
                {i18n.t("podcast")}
              </Text>
              <Feather
                name="external-link"
                size={global.device == "2" ? 40 : 24}
                style={[
                  commonForegroundDes(theme),
                  global.device == "2"
                    ? styles.touchableIcon2
                    : styles.touchableIcon,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  touchableBtn: { marginBottom: 0 },
  touchableBtnContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },

  groupContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    borderRadius: 5,
    padding: 10,
    paddingLeft: 10,
    paddingBottom: 0,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1, // IOS
    shadowRadius: 3, //IOS
    shadowColor: "#00000029", // IOS
    elevation: 2, // Android ,
  },
  label: {
    width: "80%",
    marginBottom: 0,
    marginLeft: "-10%",
    marginTop: "1.5%",
    paddingBottom: "4%",
  },
  touchableIcon: {
    paddingHorizontal: "0%",
    marginTop: "1%",
  },
  touchableIcon2: {
    paddingHorizontal: "2%",
    marginTop: "1%",
  },
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
  image: {
    width: "30%",
    height: 33,
    resizeMode: "contain",
    marginLeft: Platform.OS == "android" ? -30 : -40,
    marginTop: 0,
  },
  image2: {
    width: "30%",
    height: 65,
    resizeMode: "contain",
    marginLeft: Platform.OS == "android" ? -70 : -80,
    marginTop: 15,
  },
  imageOtherLinks: {
    width: "30%",
    height: 25,
    resizeMode: "contain",
    marginLeft: Platform.OS == "android" ? -30 : -40,
    marginTop: 5,
  },
  introMsg: {
    textAlign: "left",
    marginTop: "5%",
    marginLeft: 22,
    marginRight: 16,
    marginBottom: "0%",
  },
});
export default SocialMediaSettingScreen;
