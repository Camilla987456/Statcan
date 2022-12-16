/** @format */

import React, { useEffect, useState,useRef } from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,AppState,Appearance,
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
  commonBorder,
  themeLiteral,
  commonSettingBackground,
} from "../normalization.js";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkNotificationAvailability } from "../services";
import "../settings.js";
import i18n from "../resources.js";


// This screen is for the user to set the subjects they want to follow.
const SubjectsFollowingSettingScreen = ({ navigation }) => {
  const [theme, setTheme] = useState(global.theme);
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [name, setName] = useState("");const [count, setCount] = useState(0);
  const [isFrench, setIsFrench] = useState(i18n.isFrench);
  const [subjects, setSubjects] = useState([]);
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const appState = useRef(AppState.currentState);const isFocused = useIsFocused();

  let theDay = new Date();
  const today = `${theDay.getFullYear()}-${
    theDay.getMonth() + 1
  }-${theDay.getDate()}`;

  React.useEffect(() => {
    navigation.addListener("focus", () => {
      setZoom(global.zoom);
      setBold(global.bold);
      setName(i18n.t("subjectsFollowing"));
      //  setSubjects(global.subjectItems);
      let lll = i18n.isFrench()
        ? global.subjectItems.sort(function (a, b) {
            return a.fre < b.fre ? -1 : a.fre > b.fre ? 1 : 0;
          })
        : global.subjectItems.sort(function (a, b) {
            return a.eng < b.eng ? -1 : a.eng > b.eng ? 1 : 0;
          });
      setSubjects(lll);
      setTheme(global.theme);
      global.screen="Settings";global.SubScreen="SubjectFollowingSetting";global.indicator++;setCount(global.indicator);
    });
    navigation.addListener("blur", (e) => {
      console.log("test leaving ...");
      let l = global.subjectItems
        .filter((s) => s.value)
        .map(function (e) {
          return { key: e.key, value: e.value, date: e.date };
        });
      AsyncStorage.setItem("Subjects", JSON.stringify(l));
      global.subjects = l;
      global.followingsDirty = true;
      //Update notification when home get focus, no need for the line below
      //global.notificationReadAll = checkNotificationAvailability();
    });
    let lll = i18n.isFrench()
            ? global.subjectItems.sort(function (a, b) {
                return a.fre < b.fre ? -1 : a.fre > b.fre ? 1 : 0;
              })
            : global.subjectItems.sort(function (a, b) {
                return a.eng < b.eng ? -1 : a.eng > b.eng ? 1 : 0;
              });
          setSubjects(lll);
 setName(i18n.t("subjectsFollowing"));

  }, []);

     useFocusEffect(
          React.useCallback(() => {
            const subscriptionF = AppState.addEventListener("change", handleAppStateChangeF);console.log('subscription removed in SubjectFollowingSetting');
                return () =>{if(subscriptionF)subscriptionF.remove();console.log('subscription removed in SubjectFollowingSetting'); }
          }, [])
        );
  const handleAppStateChangeF = nextAppState => {
     console.log('SubjectFollowingSetting1 detected state change:',global.screen,'sub:',global.subScreen,'State:',appState);
     if(global.screen=="Settings" && global.SubScreen=="SubjectFollowingSetting"){
         try{
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                global.colorScheme = Appearance.getColorScheme();global.indicator++;setCount(global.indicator);setTheme(global.theme);
                console.log('SubjectFollowingSetting2.......App has come to the foreground! scheme:',global.colorScheme,commonBackground(theme));
             }
            appState.current = nextAppState;
         }catch(err){console.log('err in SubjectFollowingSetting');return;}
     }
  }


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
          accessibilityRole="button"
          accessible={true}
          onPress={() =>
            global.navigationIndicator == 0
              ? navigation.navigate("Settings")
              : global.navigationIndicator == 1
              ? navigation.navigate("FavoritesScreen")
              : navigation.navigate("Settings")
          }
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
      <Text
        style={[
          CommonZoomStyle("mini", { zoom }),
          commonForegroundDes(theme),
          styles.label2,
        ]}
      >
        {i18n.t("manageSubIntro")}
      </Text>
      <ScrollView style={[commonSettingBackground(theme), styles.scrollView]}>
        {subjects.map((n, index) => (
          <TouchableOpacity
            accessibilityRole="checkbox"
            accessible={true}
            onPress={() => {
              n.value = !n.value;
              global.subjectItems[index].value = n.value;
              global.subjectItems[index].date = n.value ? today : "";
              setSubjects([...global.subjectItems]);
            }}
            key={index}
          >
            <View
              style={{
                flexDirection: "row",
                margin: 10,
                marginTop: 5,
                borderBottomWidth: 1,
                borderBottomColor: "lightgray",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={[
                  CommonZoomStyle("medium", { zoom }),
                  commonForegroundDes(theme),
                  styles.label,
                ]}
              >
                {i18n.isFrench() ? n.fre : n.eng}
              </Text>
              <View 
              style={[commonBorder(theme), styles.checkerContainer]}
              >
                {n.value && (
                  <Image
                    style={{
                      width: global.device == "2" ? "97%" : "100%",
                      height: global.device == "2" ? "98%" : "100%",
                    }}
                    source={require("../assets/Option_checked.png")}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    marginRight: "8%",
  },
  headerTextLandscape: {
    flex: 1,
    textAlign: "center",
    marginRight: "15%",
    marginTop: "1.3%",
  },
  backButton: { paddingHorizontal: "4%", marginTop: 10, marginBottom: 10 },
  label: {
    marginLeft: 10,
    width: "80%",
    marginBottom: 10,
    marginVertical: 0,
  },
  label2: {
    marginLeft: 20,
    width: "80%",
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: -5,
  },
  labelContainer: {
    flexDirection: "row",
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    justifyContent: "space-between",
  },
  scrollView: {
    // backgroundColor: "white",
    width: "100%",
    height: "100%",
    borderRadius: 2,
    borderWidth: 1,
     borderColor: "white",
    marginVertical: 15,
    marginBottom: 0,
  },
  checkerContainer: {
    borderWidth: 1,
    marginRight: 5,
    borderRadius: commonZoomSize("large", zoom) / 10,
    width: commonZoomSize("large", zoom),
    height: commonZoomSize("large", zoom),
    alignItems: "center",
    justifyContent: "center",
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
});

export default SubjectsFollowingSettingScreen;
