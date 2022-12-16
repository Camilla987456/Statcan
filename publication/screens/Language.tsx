/** @format */

import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  CheckBox,
  Image,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../settings.js";
import i18n from "../resources.js";
import { commonBackground, commonBackgroundColor, commonForeground, CommonStyles,commonForegroundDes, commonForegroundColor, commonForegroundLabel, commonButton, commonCardBackground, themeLiteral } from "../normalization.js";
import theme from "react-native-elements/dist/config/theme.js";
const banner = require("../assets/img_canadamdpi.png");

const LanguageScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  React.useEffect(
    () =>{
      navigation.addListener("focus", () => {setName(i18n.t("chooseLanguage")); });
      const backHandler = BackHandler.addEventListener("hardwareBackPress",() =>true);
      return () => backHandler.remove();
    },[]);

  return (
    <SafeAreaView
      style={[commonBackground(theme),
       
        CommonStyles.safeArea,
        {
          alignItems: "center",
          justifyContent: "space-around",
          // backgroundColor: "black",
        },
      ]}
    >
      <Text
        style={[
          commonForegroundDes(theme),
         {
          fontSize: 24,
          textAlign: "center",
          marginBottom: 16,
          // color: "black",
          fontWeight: "bold",
          marginTop: "-20%",
         }
        ]}
        accessibilityRole="header"
        accessible={true}
      >
        {name}
      </Text>
      {i18n.isFrench() ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "90%",
          }}
        >
          <TouchableOpacity
            style={[
              
              styles.languageButtonEn
            ]}

            accessibilityRole="button"
            accessibilityLabel={i18n.t("selectFrench")}
            accessible={true}
            onPress={() => {
              i18n.locale = "fr-CA";
              AsyncStorage.setItem("Culture", "fr-CA");
              AsyncStorage.setItem("Initial", "1");
              navigation.navigate("Welcome");
            }}
          >
            <Text
              style={[commonButton(theme),
                {
                  textAlign: "center",
                  color: "white",
                  marginLeft: 0,
                  width: 120,
                  borderRadius: 10,
                  fontSize: 24,
                  fontWeight: "bold",
                },
              ]}
            >
              Français
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageButtonEn}
            accessibilityRole="button"
            accessibilityLabel={i18n.t("selectEnglish")}
            accessible={true}
            onPress={() => {
              i18n.locale = "en-CA";
              AsyncStorage.setItem("Culture", "en-CA");
              AsyncStorage.setItem("Initial", "1");
              navigation.navigate("Welcome");
            }}
          >
            <Text
              style={[commonButton(theme),
                {
                  textAlign: "center",
                  color: "white",
                  marginLeft: 10,
                  width: 120,
                  borderRadius: 10,
                  fontSize: 24,
                  fontWeight: "bold",
                },
              ]}
            >
              English
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            
            flexDirection: "row",
            justifyContent: "space-around",
            width: "90%",
          }}
        >
          <TouchableOpacity
            style={[commonButton(theme),styles.languageButtonEn]}
            accessibilityRole="button"
            accessibilityLabel={i18n.t("selectEnglish")}
            accessible={true}
            onPress={() => {
              i18n.locale = "en-CA";
              AsyncStorage.setItem("Culture", "en-CA");
              AsyncStorage.setItem("Initial", "1");
              navigation.navigate("Welcome");
            }}
          >
            <Text
              style={[
                {
                  textAlign: "center",
                  color: "white",
                  marginLeft: 0,
                  width: 120,
                  borderRadius: 10,
                  fontSize: 24,
                  fontWeight: "bold",
                },
              ]}
            >
              English
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              commonButton(theme),
              styles.languageButtonEn
            ]}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel={i18n.t("selectFrench")}
            onPress={() => {
              i18n.locale = "fr-CA";
              AsyncStorage.setItem("Culture", "fr-CA");
              AsyncStorage.setItem("Initial", "1");
              navigation.navigate("Welcome");
            }}
          >
            <Text
              style={[
                {
                  textAlign: "center",
                  color: "white",
                  marginLeft: 0,
                  width: 120,
                  borderRadius: 10,
                  fontSize: 24,
                  fontWeight: "bold",
                },
              ]}
            >
              Français
            </Text>
          </TouchableOpacity>
        </View>
      )}

<View>
            {themeLiteral() == "light" ? (
              <Image
                style={styles.image}
                source={require("../assets/Canada_wordmark_logo.png")}
              />
            ) : (
              <Image
                style={styles.image}
                source={require("../assets/darkmodewordmark.png")}
              />
            )}
          </View>

      {/* <Image
        source={banner}
        style={styles.image}
      /> */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  image: {
    resizeMode: "contain",
    width: "25%",
    minWidth: '70%',
      height: 60,
    // paddingVertical: "6%",
    // marginHorizontal: Platform.OS == "android" ? "37%" : "36%",
    // marginTop: "1%",
  },


  languageButtonEn: {
    borderRadius: 12,
    padding: "4%",
    // backgroundColor: "#335075",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 3,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 10, // IOS
    shadowRadius: 0, //IOS
    // shadowColor: "#DDDDDD", // IOS
    elevation: 10, // Android
  },
  languageButtonFr: {
    borderRadius: 10,
    padding: "5%",
    // backgroundColor: "#182F2E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 3,
  },
  btnNext: {
    width: 100,
    borderRadius: 10,
    // shadowColor: "#3D536C",
  },
  // image: {
  //   maxWidth: 250,
  //   minWidth: 250,
  //   height: 60,
  // },
});
export default LanguageScreen;
