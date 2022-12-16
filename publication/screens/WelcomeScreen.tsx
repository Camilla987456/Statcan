/** @format */

import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  BackHandler,
  Text,
  SafeAreaView,
  StyleSheet,
  CheckBox,
  Image,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../settings.js";
import i18n from "../resources.js";
import { CommonStyles,commonBackground,commonForegroundDes,commonButton } from "../normalization.js";
import "../settings.js";


const banner = require("../assets/img_canadamdpi.png");
const icon = require("../assets/iconWelcome.png");
const WelcomeScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const [name, setName] = useState(i18n.t("lang"));
  const [label, setLabel] = useState(i18n.t("label"));
   const [name2, setName2] = useState(i18n.t("settings"));

  const toggleSwitch = () => {
    i18n.toogle();
    setName(i18n.t("lang"));
    setLabel(i18n.t("label"));
  };
  React.useEffect(() => {
    navigation.addListener("focus", () => {
        global.screen = "Settings";
        global.SubScreen = "Settings";
                setName2(i18n.t("settings"));
      setName(i18n.t("lang"));
      setLabel(i18n.t("label"));
    });
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView
      style={[
        commonBackground(theme),
        CommonStyles.safeArea,
        {
          alignItems: "center",
          justifyContent: "space-around",
          backgroundColor: "white",
        
        },
      ]}
    >
      <View
        style={
          isLandscapeMode
            ? styles.headerContainerLandscape
            : styles.headerContainer
        }
      >
        <TouchableOpacity
          onPress={toggleSwitch}
          style={[
            {
              marginRight: '1%',
              marginBottom: '-3%',
              marginTop: global.device == "2" ? "15%" : "9%",
            },
            CommonStyles.tapSpot,
          ]}
          accessibilityRole="button"
          accessibilityLabel={"Switch to" + label}
          accessible={true}
        >
          <Text
            style={{
              color: "#335075",
              fontSize: global.device == "2" ? 40 : 15,
            }}
          >
            {name}
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={[
          {
            textAlign: "center",
            marginBottom: "-16%",
            color: "#333333",
            fontWeight: "bold",
            fontSize: 28,
            marginTop: global.device == "2" ? "-30%" : "-37%",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 3, // IOS
            shadowRadius: 3, //IOS
            shadowColor: "#00000029", // IOS
            elevation: 10, // Android
          },
        ]}
        accessibilityRole="header"
        accessible={true}
      >
        {i18n.t("welcome")}
      </Text>
      <Text
        style={[commonForegroundDes(theme),
          {
            fontSize: global.device == "2" ? 30 : 12,
            width: "80%",
            textAlign: "center",
            marginBottom: 10,
            color: "#333333",
            marginTop: global.device == "2" ? "-10%" :Platform.OS=='android'?"-18%": "-20%",
            fontWeight: "500",
          },
        ]}
      >
        {i18n.t("welcomeDes")}
      </Text>
      <View
        style={{
          width: 200,
          height: 200,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 15,
          marginRight: 15,
        }}
      >
        <Image
          style={{
            width: global.device == "2" ? "190%" : "150%",
            height: global.device == "2" ? 550 : "150%",
            resizeMode: "cover",
            marginTop: global.device == "2" ? "-140%" : "-50%",
          
          }}
          source={icon}
        />
      </View>
      <View style={styles.textandLinks}>
        <Text style={styles.textFont}>{i18n.t("priTou")}</Text>
        <Text
          onPress={() =>
            navigation.navigate("WelcomePrivacy", {
              url: i18n.t("privacyPolicyLink"),
              title: "privacyPolicy",
            })
          }
          style={styles.privacyNotice}
        >
          {i18n.t("privacyNotice")}
        </Text>
        <Text style={styles.textFont}>{i18n.t("privacyNotice2")}</Text>
      </View>
      <View style={i18n.locale=="en-CA"?styles.textandLinks2:styles.textandLinks2Fr}>
        <Text style={styles.textFont}>{i18n.t("acceptThe")}</Text>
        <Text 
          onPress={() => navigation.navigate("WelcomeTerms")}
          style={i18n.locale=="en-CA"?styles.privacyNotice:styles.privacyNoticeFR}
        >
          {i18n.t("termAndCondition")}
        </Text>
        <Text style={styles.textFont}>{i18n.t("dot")}</Text>
      </View>

      <TouchableOpacity
        style={[commonButton(theme),
          styles.btnNext]}
        onPress={() => {
          // AsyncStorage.setItem("Initial", "2");
          navigation.navigate("Interest");
        }}
        accessibilityRole="button"
        accessible={true}
        accessibilityLabel={i18n.t("continue")}
      >
        <Text style={[{ color: "white", fontWeight: "bold", fontSize: 15 }]}>
          {i18n.t("continue")}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  btnNext: {
    borderRadius: 7,
    padding: 13,
    backgroundColor: "#335075",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "0%",
    marginTop: "-30%",
    width: "90%",
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    marginTop: Platform.OS == "android" ? "-19%" : "-30%",
  },
  headerContainerLandscape: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    marginTop:
      global.device == "2"
        ? "-26%"
        : Platform.OS == "android"
        ? "-19%"
        : "-30%",
  },
  privacyNotice: {
    color: "#0078D7",
    fontSize: 12,
  },
  privacyNoticeFR: {
    color: "#0078D7",
    fontSize: 11,
    marginRight:'7%',
    marginTop:2

 
  },
  textandLinks: {
    flexDirection: "row",
    marginLeft: "25%",
    marginRight: "22%",
    marginTop: "-20%",
  },
  textandLinks2: {
    flexDirection: "row",
    marginLeft: "3%",
    marginTop: "-39.5%",
  },
  textandLinks2Fr: {
    flexDirection: "row",
    marginLeft: "3%",
    marginTop: "-39.5%",
  },
  textFont: {
    fontSize: 12,
    marginBottom:Platform.OS=='android'?20:0
  },
 
});
export default WelcomeScreen;
