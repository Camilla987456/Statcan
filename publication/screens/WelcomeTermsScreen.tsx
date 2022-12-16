/** @format */

import React, { useEffect, useState } from "react";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  CheckBox,
  Image,
  BackHandler,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../settings.js";
import i18n from "../resources.js";
import {
  CommonStyles,
  commonCardBackground,
  commonForegroundDes,
  CommonZoomStyle,
} from "../normalization.js";
import { Feather } from "@expo/vector-icons";
const WelcomeTermsScreen = ({ navigation }) => {
  const [name, setName] = useState(i18n.t("lang"));
  const [label, setLabel] = useState(i18n.t("label"));
  const toggleSwitch = () => {
    i18n.toogle();
    setName(i18n.t("lang"));
    setLabel(i18n.t("label"));
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonCardBackground(theme)]}>
      <View style={styles.header}>
        <View
          style={{
            alignItems: "center",
            marginBottom: "0%",
            marginTop: "0%",
            width: "100%",
            marginHorizontal: global.device == "2" ? "-6%" : "-10%",
          }}
          accessibilityRole="header"
          accessible={true}
        >
          <TouchableOpacity
            style={{marginLeft:'-65%', marginBottom:'-9%'}}
            accessibilityRole="button"
            accessible={true}
            onPress={() => navigation.navigate("Welcome")}
            accessibilityLabel={i18n.t("goBack")}
          >
            <Feather
              name="x"
              size={global.device == "2" ? 50 : 25}
              style={[
                commonForegroundDes(theme),
                { paddingHorizontal: "4%", marginTop: 10, marginBottom: 10 },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              commonForegroundDes(theme),
             
              {
                marginBottom: 10,
                fontSize:17,
                fontWeight: "bold",
                marginTop: "1%",
                marginLeft: global.device == "2" ? 0 : "15%",
              },
            ]}
          >
            {i18n.t("termAndCondition")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleSwitch}
          style={[{ marginRight: "7%" }, CommonStyles.tapSpot]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={"Switch to" + label}
        >
          <Text
            style={[
              commonForegroundDes(theme),
              {
                //  color: "#7834BC",
                fontSize: global.device == "2" ? 35 : 15,
              },
            ]}
          >
            {name}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 15,
          marginBottom: 5,
          marginLeft: 16,
          marginRight: 16,
        }}
      >
        <ScrollView
          style={[commonCardBackground(theme), styles.scrollViewContainer]}
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
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  btnNext: {
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#335075",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "0%",
    marginTop: "6%",
    width: "100%",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 10, // IOS
    shadowRadius: 0, //IOS
    shadowColor: "#DDDDDD", // IOS
    elevation: 10, // Android
  },
  btnNext1: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: "0%",
    width: "80%",
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    height: 30,
    marginTop: 34,
    justifyContent: "flex-end",
    marginBottom: 25,
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
    paddingHorizontal: "0%",
    alignItems: "center",
    alignSelf: "flex-end",
    marginHorizontal: "-4%",
  },
});
export default WelcomeTermsScreen;
