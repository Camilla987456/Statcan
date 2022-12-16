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
  useWindowDimensions,
  Platform
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
  commonButton,
  commonTextButtonColor,
} from "../normalization.js";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkConnection, checkNotificationAvailability, decodeHtmlCharCodes } from "../services";
import i18n from "../resources.js";

// This screen is for the user to set the subjects they want to follow.
const SubjectInterestScreen = ({ route,navigation }) => {

  
  const [theme, setTheme] = useState(global.theme);
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [isFrench, setIsFrench] = useState(i18n.isFrench);
  const [subjects, setSubjects] = useState([]);
  const [lang, setLang] = useState(i18n.t("lang"));
  const { width, height } = useWindowDimensions();
  const [showFilter, setShowFilter] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [serverDown, setServerDown] = useState(false);
  const [offline, setOffline] = useState(false);
  const [label, setLabel] = useState(i18n.t("label"));
  const [disabled, setDisabled] = useState(false);
  const isLandscapeMode = width > height ? true : false;
  const opacityStyle = disabled ? 1 : 0.7;
  const appState = useRef(AppState.currentState);const isFocused = useIsFocused();


  const onNextFilter = () => {
        setShowFilter(false);
        setLoading(true);
        let l = global.subjectItems
          .filter((s) => s.value)
          .map(function (e) {
            return { key: e.key, value: e.value, date: e.date };
          });
        AsyncStorage.setItem("Subjects", JSON.stringify(l));
        global.subjects = l;
        global.followingsDirty = true;
        getFollowingList();
        global.followingsDirty = false;
        setLoading(false);
       
  };
  const getFollowingList = async () => {
    if (!checkConnection()) {
      setOffline(true);
      setLoading(false);
      return;
    }
    setOffline(false);
    if (global.subjectItems.filter((n) => n.value).length == 0) return [];
    setLoading(true);
    let value = [];
    let followings = [];
    let url = i18n.isFrench()
      ? global.pubApiUrlBaseFr + "following"
      : global.pubApiUrlBaseEn + "following";
    let data = [];
    global.subjects.forEach(function (x) {
      if (x.value) data.push({ subject_id: x.key });
    });
    console.log(url, data);

    try {
      const response = await fetch(url, {
        method: "POST",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      setServerDown(false);
      console.log(
        "response status",
        response.status,
        "list count:",
        json.length
      );
      json.forEach(function (x) {
        let key = x.subject.subject_name;
       
        for (let i = 0; i < Math.min(10, x.followings.length); i++) {
          value.push({
            id: x.followings[i].id,
            title: decodeHtmlCharCodes(x.followings[i].title),
            category: x.followings[i].subject_name,
            categoryId: x.followings[i].subject_id,
            date: x.followings[i].published_date,
            image: x.followings[i].branding_image_src,
            imageLabel: x.followings[i].branding_image_alt,
          });
        }
        followings.push({ key: key, value: value });
      });
      followings = followings.sort(function (a, b) {
        return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
      });
      setList(followings);
      setLoading(false);
    } catch (error) {
      console.log("error");
      setServerDown(true);
    } finally {
      setLoading(false);
    }
    setLoading(false);
   
    navigation.navigate('HomeTabScreen',{screen:'FollowingStack'});
  };
  let theDay = new Date();
  const today = `${theDay.getFullYear()}-${
    theDay.getMonth() + 1
  }-${theDay.getDate()}`;
  
  const toggleSwitch = () => {
    i18n.toogle();
    setLang(i18n.t("lang"));
    setLabel(i18n.t("label"));
  };
  React.useEffect(() => {
    navigation.addListener("focus", () => {
      setZoom(global.zoom);
      setBold(global.bold);
      // setName(i18n.t("interest"));
      setLang(i18n.t("lang"));
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
      global.screen="WelcomeScreen";global.SubScreen="SubjectInterest";global.indicator++;setCount(global.indicator);
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
//  setName(i18n.t("interest"));

  }, []);

     useFocusEffect(
          React.useCallback(() => {
            const subscriptionF = AppState.addEventListener("change", handleAppStateChangeF);console.log('subscription removed in SubjectInterest');
                return () =>{if(subscriptionF)subscriptionF.remove();console.log('subscription removed in SubjectInterest'); }
          }, [])
        );
  const handleAppStateChangeF = nextAppState => {
     console.log('SubjectFollowingSetting1 detected state change:',global.screen,'sub:',global.subScreen,'State:',appState);
     if(global.screen=="WelcomeScreen" && global.SubScreen=="SubjectInterest"){
         try{
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                global.colorScheme = Appearance.getColorScheme();global.indicator++;setCount(global.indicator);setTheme(global.theme);
                console.log('SubjectInterest.......App has come to the foreground! scheme:',global.colorScheme,commonBackground(theme));
             }
            appState.current = nextAppState;
         }catch(err){console.log('err in SubjectInterest');return;}
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
            
               navigation.navigate("Main")
          }
          accessibilityLabel={i18n.t("skip")}
        >
          <Text
            
            size={global.device == "2" ? 50 : 25}
            style={[styles.skipButton, commonForegroundDes(theme),{ fontSize: global.device == "2" ? 30 : 17}]}
          >{i18n.t("skip")}</Text>
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
          {i18n.t('interest')}
        </Text>
        
        <TouchableOpacity
          onPress={toggleSwitch}
          style={[
            {
            //   marginRight: 20,
            //   marginBottom: 10,
            //   marginTop: global.device == "2" ? "15%" : "9%",
            },
            CommonStyles.tapSpot,
          ]}
          accessibilityRole="button"
          accessibilityLabel={"Switch to" + label}
          accessible={true}
        >
          <Text
            style={[commonTextButtonColor(theme),{
              // color: "#7834BC",
              fontSize: global.device == "2" ? 40 : 20,
            }]}
          >
            {lang}
          </Text>
        </TouchableOpacity>
      
      </View>
      {/* <Text
        style={[
          CommonZoomStyle("mini", { zoom }),
          commonForegroundDes(theme),
          styles.label2,
        ]}
      >
        {i18n.t("manageSubIntro")}
      </Text> */}
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
              setDisabled(!subjects  || true);
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
      <View
                style={[commonBackground(theme),{
                  justifyContent: "center",
                  alignItems: "center",
                //   height: mtfHeight,
                }]}
              >
                <TouchableOpacity
                style={[commonButton(theme),styles.apply,{ opacity: opacityStyle }]}
                  accessibilityRole="button"
                  accessible={true}
                  disabled = {!disabled}
                  // activeOpacity= {1}
                  onPress={onNextFilter}
                >
                    
                  <Text
                    style={[
                      CommonStyles.mediumFont,
                      styles.disabledBtn 
                    ]}
                  >
                    {i18n.t("next")}
                  </Text>
                
                   </TouchableOpacity>                 
              </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  disabledBtn:{
    color: "white", fontWeight: "bold",
    // opacity:0.7
  },
  enableBtn:{
    color: "white", fontWeight: "bold",
    // opacity:1
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
    marginRight: "8%",
  },
  headerTextLandscape: {
    flex: 1,
    textAlign: "center",
    marginRight: "15%",
    marginTop: "1.3%",
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    marginTop: Platform.OS == "android" ? "-19%" : "-30%",
  },
  skipButton: { paddingHorizontal: "4%", marginTop: 10, marginBottom: 10 },
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
    // borderRadius: 2,
    // borderWidth: 1,
    //  borderColor: "white",
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
  apply: {
    borderRadius: 5,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    // backgroundColor: "#26374A",
    width: "50%",
    minHeight: 35,
    // opacity :0.7
  },
});

export default SubjectInterestScreen;
