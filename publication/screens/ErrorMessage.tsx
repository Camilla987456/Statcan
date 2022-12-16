import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet,TouchableOpacity,Image,ScrollView,Dimensions} from "react-native";
import {CommonStyles,CommonZoomStyle,commonForeground,commonBackground} from "../normalization.js";
import i18n from "../resources.js";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const wid=Math.abs(windowWidth-windowHeight)<100?windowWidth*0.6:windowWidth-40;
const hei=Math.min(744/1314*wid,windowHeight*0.6);

export function errorMessage(offline,onRetry,index,name){
   return(
     <View style={[{justifyContent: "space-around",alignItems: "center",padding: 10,height:'100%'},commonBackground(global.theme)]}>
        <Text style={[{height:'30%',width:'100%',paddingHorizontal:10},,CommonZoomStyle("small", { zoom }),commonForeground(theme)]}>
            {offline? i18n.t("offLine"): i18n.t("serverDown").replace("(Screen-name)", name)}
        </Text>
        <TouchableOpacity onPress={onRetry} style={[styles.retryBtn,{height:'10%',}]}>
            <Text style={[{color: "#FFFFFF",alignSelf: "center",paddingVertical: 5,},CommonStyles.mediumFont,]}>
                {i18n.t("retry")}
            </Text>
        </TouchableOpacity>
        <View style={{maxWidth:'100%',flexGrow:1,justifyContent:'center',alignItems:'center'}}>
            <Image style={{resizeMode:'contain',width:wid,height:hei}} source={require("../assets/Link-broken.png")}/>
        </View>
     </View>
)}


const styles = StyleSheet.create({
  retryBtn: {
    backgroundColor: "#333333",
    width: Platform.OS === "android" ? "46%" : "45%",
    borderRadius: 5,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
