/** @format */

import React, { useEffect, useState,useRef } from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  CheckBox,
  Image,
  TouchableOpacity,
  ScrollView,AppState,Appearance,
  useWindowDimensions
} from "react-native";
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonForegroundDes,
  commonCardBackground,
} from "../normalization.js";
import "../settings.js";
import i18n from "../resources.js";
import { Feather } from "@expo/vector-icons";

const banner = require("../assets/img_canadamdpi.png");

const TermConditionSettingScreen = ({ navigation }) => {
  const [isFrench, setIsFrench] = useState(i18n.isFrench);
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const [name, setName] = useState("");const [count, setCount] = useState(0);
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [theme, setTheme] = useState(global.theme);
  const appState = useRef(AppState.currentState);const isFocused = useIsFocused();
  React.useEffect(
    () =>
      navigation.addListener("focus", () => {
        setZoom(global.zoom);
        setBold(global.bold);
        setName(i18n.t("termAndCondition"));
        setTheme(global.theme);
        global.screen="Settings";global.SubScreen="TermConditionSetting";global.indicator++;setCount(global.indicator);
      }),
    []
  );
     useFocusEffect(
          React.useCallback(() => {
            const subscriptionF = AppState.addEventListener("change", handleAppStateChangeF);console.log('subscription removed in TermConditionSetting');
                return () =>{if(subscriptionF)subscriptionF.remove();console.log('subscription removed in TermConditionSetting'); }
          }, [])
        );
  const handleAppStateChangeF = nextAppState => {
     console.log('TermConditionSetting1 detected state change:',global.screen,'sub:',global.subScreen,'State:',appState);//if(global.screen=="Settings")navigation.navigate("Settings");
     if(global.screen=="Settings" && global.SubScreen=="TermConditionSetting"){
         try{
           if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                global.colorScheme = Appearance.getColorScheme();global.indicator++;setCount(global.indicator);setTheme(global.theme);
                console.log('TermConditionSetting2.......App has come to the foreground! scheme:',global.colorScheme,commonBackground(theme));
             }
            appState.current = nextAppState;
         }catch(err){console.log('err in TermConditionSetting');return;}
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
            size={global.device == "2" ? 50 : 18}
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[commonBackground(theme), styles.scrollViewContainer]}
      >
        <View>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_a")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_b")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_c")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_d")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_e")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_f")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_i")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_j")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_k")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_l")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_m")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_n")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_o")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_p")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_q")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_r")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_s")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_t")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_u")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_v")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_w")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_x")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_y")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_z")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_aa")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_bb")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_cc")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_dd")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_ee")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_ff")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_gg")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_hh")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_ii")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_jj")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_kk")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_ll")}
          </Text>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
            ]}
          >
            {i18n.t("termAndConditionContent_mm")}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    padding: 16,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  groupLabel: { marginLeft: 10, fontWeight: "bold", marginTop: 10 },
  label: { marginLeft: 15 },
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
});

export default TermConditionSettingScreen;
