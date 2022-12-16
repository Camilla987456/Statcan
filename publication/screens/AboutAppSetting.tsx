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
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
} from "../normalization.js";
import "../settings.js";
import i18n from "../resources.js";
import { Feather } from "@expo/vector-icons";
const banner = require("../assets/img_canadamdpi.png");

const AboutAppSettingScreen = ({ navigation }) => {
  const [isFrench, setIsFrench] = useState(i18n.isFrench);
  const [name, setName] = useState("");
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [theme, setTheme] = useState(global.theme);
  React.useEffect(
    () =>
      navigation.addListener("focus", () => {
        setZoom(global.zoom);
        setBold(global.bold);
        setName(i18n.t("aboutApp"));
        setTheme(global.theme);
      }),
    []
  );


  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
      <View
        style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}
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
            size={commonZoomSize("xlarge", zoom)}
            style={[
              commonForeground(theme),
              { marginTop: 10, marginBottom: 10 },
            ]}
          />
        </TouchableOpacity>
        <Text
          style={[
            CommonZoomStyle("xlarge", { zoom }),
            commonFontWeight({ bold }),
            commonForeground(theme),
            { textAlign: "center", marginLeft: 10 },
          ]}
        >
          {name}
        </Text>
      </View>
      <ScrollView style={styles.scrollViewContainer}>
        <Text
          style={[CommonZoomStyle("medium", { zoom }), commonForeground(theme)]}
        >
          {i18n.t("aboutAppDes")}
        </Text>
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
  },
  groupLabel: { marginLeft: 10, fontWeight: "bold", marginTop: 10 },
  label: { marginLeft: 15 },
});
export default AboutAppSettingScreen;
