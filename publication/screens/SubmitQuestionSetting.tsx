/** @format */

import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  CheckBox,
  Platform,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonBackgroundHighlightColor,
} from "../normalization.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../settings.js";
import i18n from "../resources.js";
import { Feather } from "@expo/vector-icons";
import PublicationsSecondLevel from "../components/PublicationsSecondLevel.js";

const banner = require("../assets/img_canadamdpi.png");
type PublicationsProps = {
  navigation: any;
  route: {
    params: any;
  };
};
const SubmitQuestionSettingScreen = (props: PublicationsProps) => {
  const { navigation } = props;
  const [isFrench, setIsFrench] = useState(i18n.isFrench);
  const [name, setName] = useState(i18n.t("submitQuestion"));
  const [question, setQuestion] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [theme, setTheme] = useState(global.theme);
  React.useEffect(
    () =>
      navigation.addListener("focus", () => {
        setZoom(global.zoom);
        setBold(global.bold);
        setTheme(global.theme);
        setName(i18n.t("submitQuestion"));
      }),
    []
  );

  const item = props.route.params;
  const submitQuestion = () => {
    alert(question);
    setQuestion("");
    setEmail("");
    setPhone("");
  };
  const onBackButtonClick = () => {
    global.prevNavigateRoute == ""
      ? navigation.navigate("Settings")
      : navigation.navigate(global.prevNavigateRoute);
    global.prevNavigateRoute = "";
  };

  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
      <View
        style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}
      >
        <TouchableOpacity
          style={{}}
          accessibilityRole="button"
          accessible={true}
          onPress={onBackButtonClick}
          accessibilityLabel={i18n.t("goBack")}
        >
          <Feather
            name="chevron-left"
            size={commonZoomSize("xlarge", zoom)}
            style={[
              commonForeground(theme),
              { paddingHorizontal: "4%", marginTop: 10, marginBottom: 10 },
            ]}
          />
        </TouchableOpacity>
        <Text
          style={[
            CommonZoomStyle("xlarge", { zoom }),
            commonFontWeight({ bold }),
            commonForeground(theme),
            { flex: 1, textAlign: "center", marginRight: "8%" },
          ]}
        >
          {name}
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerShort}>
            <Text
              style={[
                CommonZoomStyle("medium", { zoom }),
                commonForeground(theme),
                { fontWeight: "bold" },
              ]}
            >
              {i18n.t("email")}
            </Text>
            <TextInput
              value={email}
              multiline={false}
              underlineColorAndroid="transparent"
              style={[
                {
                  borderWidth: 1,
                  borderColor: "gray",
                  backgroundColor: "white",
                },
                CommonZoomStyle("medium", { zoom }),
              ]}
              onChangeText={setEmail}
            ></TextInput>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerShort}>
            <Text
              style={[
                CommonZoomStyle("medium", { zoom }),
                commonForeground(theme),
                { fontWeight: "bold" },
              ]}
            >
              {i18n.t("phone")}
            </Text>
            <TextInput
              value={phone}
              multiline={false}
              underlineColorAndroid="transparent"
              style={[
                {
                  borderWidth: 1,
                  borderColor: "gray",
                  backgroundColor: "white",
                  textAlignVertical: "top",
                },
                CommonZoomStyle("medium", { zoom }),
              ]}
              onChangeText={setPhone}
            ></TextInput>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text
              style={[
                CommonZoomStyle("medium", { zoom }),
                commonForeground(theme),
                { fontWeight: "bold" },
              ]}
            >
              {i18n.t("yourQuestion")}
            </Text>
            <TextInput
              value={question}
              multiline={true}
              underlineColorAndroid="transparent"
              numberOfLines={40}
              maxLength={400}
              style={[
                {
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "gray",
                  marginBottom: 10,
                  backgroundColor: "white",
                  padding: 10,
                  textAlignVertical: "top",
                },
                CommonZoomStyle("medium", { zoom }),
              ]}
              onChangeText={setQuestion}
            ></TextInput>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <TouchableOpacity
        style={[
          { backgroundColor: commonBackgroundHighlightColor(theme) },
          styles.btnSubmit,
        ]}
        onPress={() => {
          Keyboard.dismiss();
          navigation.navigate("Settings");
        }}
        accessibilityRole="button"
        accessible={true}
        onPress={submitQuestion}
      >
        <Text
          style={[
            CommonStyles.mediumFont,
            { color: "white", textAlign: "center" },
          ]}
        >
          {i18n.t("submit")}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  btnSubmit: {
    marginBottom: 8,
    borderRadius: 10,
    padding: 10,
    // backgroundColor:commonForegroundHighlightColor(theme),    //'#26374A',
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 1, // IOS
    shadowRadius: 3, //IOS
    shadowColor: "rgba(0,0,0, .4)", // IOS
    elevation: 10, // Android
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    height: 55,
  },
  inputContainer: { flex: 1 },
  inner: { padding: 24, flex: 1, justifyContent: "space-around" },
  innerShort: { padding: 24 },
});

export default SubmitQuestionSettingScreen;
