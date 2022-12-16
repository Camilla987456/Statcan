/** @format */

import React, { useEffect, useState ,useRef} from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  CheckBox,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Clipboard,
  Alert,
  Platform,AppState,Appearance,
  useWindowDimensions
} from "react-native";
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
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
  commonSettingBackground,
  commonTextButtonColor,
  commonButton,
  commonButtonColor,
} from "../normalization.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../settings.js";
import i18n from "../resources.js";
import { Feather, Ionicons } from "@expo/vector-icons";
const banner = require("../assets/img_canadamdpi.png");

const HelpSettingScreen = ({ navigation }) => {
  const [isFrench, setIsFrench] = useState(i18n.isFrench);
  const [name, setName] = useState("");const [count, setCount] = useState(0);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(i18n.t("copyClipboard"));
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [theme, setTheme] = useState(global.theme);
  const appState = useRef(AppState.currentState);const isFocused = useIsFocused();
  const email = i18n.t("generalEnquiriesInfo");
  const copyIt = () => {
    Clipboard.setString(email);

    setToast(true);
    setToastMsg(i18n.t("copyClipboard"));
    setTimeout(() => {
      setToast(false);
    }, 3500);
  };

  React.useEffect(
    () =>
      navigation.addListener("focus", () => {
        setZoom(global.zoom);
        setBold(global.bold);
        setTheme(global.theme);
        setName(i18n.t("help"));
         global.screen="Settings";global.SubScreen="HelpSetting";global.indicator++;setCount(global.indicator);
      }),
    []
  );
      useFocusEffect(
            React.useCallback(() => {
              const subscriptionF = AppState.addEventListener("change", handleAppStateChangeF);console.log('subscription removed in HelpSetting');
                  return () =>{if(subscriptionF)subscriptionF.remove();console.log('subscription removed in HelpSetting'); }
            }, [])
          );
    const handleAppStateChangeF = nextAppState => {
       console.log('HelpSetting1 detected state change:',global.screen,'sub:',global.subScreen,'State:',appState);
       if(global.screen=="Settings" && global.SubScreen=="HelpSetting"){
           try{
             if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                  global.colorScheme = Appearance.getColorScheme();global.indicator++;setCount(global.indicator);setTheme(global.theme);
                  console.log('HelpSetting2.......App has come to the foreground! scheme:',global.colorScheme,commonBackground(theme));
             }
             appState.current = nextAppState;
           }catch(err){console.log('err in HelpSetting');return;}
       }
    }



  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
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
          accessibilityLabel={i18n.t("helpandFAQ")}
          accessible={true}
        >
          {name}
        </Text>
      </View>
      <ScrollView>
        <Text
          style={[
            CommonZoomStyle("mini", { zoom }),
            commonForegroundDes(theme),
            styles.groupLabel,
          ]}
          accessibilityRole="header"
          accessible={true}
        >
          {i18n.t("generalEnquiries")}
        </Text>

        <Text
          style={[
            CommonZoomStyle("mini", { zoom }),
            commonForegroundDes(theme),
            styles.label,
            { marginTop: "2%", marginBottom: "2%" },
          ]}
        >
          {i18n.t("generalEnquiriesInfo")}
        </Text>

        <View
          style={[
            {
              marginTop: 0,
              marginBottom: 10,
              marginHorizontal: 30,
              marginLeft: 18,
            },
            commonSettingBackground(theme),
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              margin: 10,
              marginBottom: 15,
              marginTop: 15,
              borderBottomWidth: 1,
              borderBottomColor: "lightgray",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => Linking.openURL("mailto:infostats@statcan.gc.ca")}
              accessibilityRole="button"
              accessible={true}
            >
              <Text
                style={[
                  { marginBottom: 10, marginTop: 0 },
                  CommonZoomStyle("mini", { zoom }),
                  commonForegroundDes(theme),
                ]}
              >
                {i18n.t("emailViaApp")}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              margin: 10,
              marginVertical: 2,
              marginTop: -5,
              borderBottomWidth: 0,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={copyIt}
              accessibilityRole="button"
              accessible={true}
            >
              <Text
                // selectable={true}
                style={[
                  { marginBottom: 10, marginTop: 0 },
                  CommonZoomStyle("mini", { zoom }),
                  commonForegroundDes(theme),
                ]}
              >
                {i18n.t("copyEamilAddress")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={[
            CommonZoomStyle("mini", { zoom }),
            commonForegroundDes(theme),
            styles.groupLabel,
          ]}
          accessibilityRole="header"
          accessible={true}
        >
          {i18n.t("phone")}
        </Text>
        <View
          style={[
            {
              marginTop: 9,
              marginBottom: 0,
              marginHorizontal: 30,
              marginLeft: 18,
            },
            commonSettingBackground(theme),
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              margin: 10,
              marginBottom: 15,
              marginTop: 15,
              borderBottomWidth: 1,
              borderBottomColor: "lightgray",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={[
                CommonZoomStyle("mini", { zoom }),
                ,
                commonForegroundDes(theme),
                { marginBottom: 10, marginTop: 0 },
              ]}
            >
              {i18n.t("tollFreePhone")}
            </Text>

            <TouchableOpacity
            
              onPress={() => Linking.openURL("tel:18002631136")}
            >
              <View
                style={[commonButtonColor(theme),{
                  borderWidth: 1,
                  borderRadius: 3,
                  width: "100%",
                  height: global.device == "2" ? 40 : 23,
                  paddingHorizontal: 15,
                  marginVertical: global.device == "2" ? -2 : -5,
                  // borderColor: themeLiteral() === "light" ? "#000" : "#fff",
                }]}
              >
                <Text
                  style={[
                    commonForegroundDes(theme),
                    {
                      marginTop: i18n.isFrench()
                        ? global.device == "2"
                          ? 7
                          : 1
                        : Platform.OS == "android"
                        ? -1
                        : 1,
                      fontSize: i18n.isFrench()
                        ? Platform.OS == "android"
                          ? 14
                          : 15
                        : global.device == "2"
                        ? 28
                        : 16,
                    },
                  ]}
                >
                  {i18n.t("call")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              margin: 10,
              marginVertical: 2,
              marginTop: -5,
              borderBottomWidth: 0,
              justifyContent: "space-between",
            }}
          >
            <Text
              style={[
                CommonZoomStyle("mini", { zoom }),
                commonForegroundDes(theme),
                { marginBottom: 10, marginTop: 0 },
              ]}
            >
              {i18n.t("internationalPhone")}
            </Text>

            <TouchableOpacity
              onPress={() => Linking.openURL("tel:15142838300")}
            >
              <View
                style={[commonButtonColor(theme),{
                  borderWidth: 1,
                  borderRadius: 3,
                  width: "100%",
                  height: global.device == "2" ? 40 : 23,
                  paddingHorizontal: 15,
                  marginVertical: global.device == "2" ? -2 : -5,
                  // borderColor: themeLiteral() === "light" ? "#000" : "#fff",
                }]}
              >
                <Text
                  style={[
                    commonForegroundDes(theme),
                    {
                      marginTop: i18n.isFrench()
                        ? global.device == "2"
                          ? 7
                          : 1
                        : Platform.OS == "android"
                        ? -1
                        : 1,
                      fontSize: i18n.isFrench()
                        ? Platform.OS == "android"
                          ? 14
                          : 15
                        : global.device == "2"
                        ? 28
                        : 16,
                    },
                  ]}
                >
                  {i18n.t("call")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.groupLabel}>
          <Text
            style={[
              commonForegroundDes(theme),
              { marginBottom: 8, fontSize: global.device == "2" ? 18 : 11 },
            ]}
          >
            {i18n.t("regularBusinessHours")}
          </Text>
          <Text
            style={[
              ,
              commonForegroundDes(theme),
              { marginBottom: 8, fontSize: global.device == "2" ? 18 : 11 },
            ]}
          >
            {i18n.t("regularBusinessHoursInfo")}
          </Text>
        </View>
        <Text
          style={[
            CommonZoomStyle("mini", { zoom }),
            commonForegroundDes(theme),
            styles.groupLabel,
          ]}
          accessibilityRole="header"
          accessible={true}
        >
          {i18n.t("supportText")}
        </Text>
        <View
          style={[
            {
              marginTop: 10,
              marginBottom: 10,
              marginHorizontal: 30,
              marginLeft: 18,
            },
            commonCardBackground(theme),
          ]}
        >
            <TouchableOpacity
              accessibilityRole="button" style={{padding:8}}
              accessible={true}
              onPress={() =>
                navigation.navigate("BrowserSetting", {
                  url: i18n.isFrench()
                    ? "https://www.statcan.gc.ca/fr/rb/applications-mobiles/statscan-faq"
                    : "https://www.statcan.gc.ca/en/sc/mobile-applications/statscan-faq",
                  title: "faqs",
                })
              }
            >
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text style={[CommonZoomStyle("mini", { zoom }),commonForegroundDes(theme)]} accessibilityRole="button" accessibilityLabel={i18n.t("faqBtn")} accessible={true} >
                  {i18n.t("faqs")}
                </Text>
                <Feather name="external-link" style={[commonForegroundDes(theme)]}
                    size={global.device == "2"? 40:Platform.OS == "android"?24:20} />
              </View>
            </TouchableOpacity>

          {toast && (
            <View
              style={[
                {
                  alignSelf: "center",
                  borderRadius: 5,
                  width: "90%",
                  height:
                    global.device == "2"
                      ? "100%"
                      : Platform.OS == "android"
                      ? "80%"
                      : "100%",
                  marginTop: Platform.OS == "android" ? -30 : 0,
                  position: "absolute",
                  top: Platform.OS == "android" ? "100%" : "160%",
                  zIndex: 20,
                  backgroundColor:
                    themeLiteral() == "light" ? "black" : "white",
                },
              ]}
            >
              <Text
                style={[
                  commonFontWeight({ bold }),
                  commonForeground(theme),
                  {
                    color: themeLiteral() == "light" ? "white" : "black",
                    fontFamily: "NotoSans-Regular",
                    textAlign: "center",
                    paddingVertical: Platform.OS == "android" ? 2 : 2,
                    fontSize: global.device == "2" ? 40 : 18,
                  },
                ]}
              >
                {toastMsg}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  scrollViewContainer: {
    flex: 1,
    padding: 16,
    borderBottomColor: "lightgray",
    borderBottomWidth: 2,
    backgroundColor: "white",
  },
  groupLabel: { marginLeft: 20, fontWeight: "bold", marginTop: 10 },
  label: { marginLeft: 20 },
});
export default HelpSettingScreen;
