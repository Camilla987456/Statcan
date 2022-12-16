import {View,Text,StyleSheet} from "react-native";
import {commonZoomSizeFix,commonZoomSize,CommonZoomStyle,commonForeground,commonForegroundLabel} from "../normalization.js";
//import {convertDateCategory} from "../services";
import i18n from "../resources.js";
export function adjustedDate(str,zoom,theme,isTitle){
  // let str=convertDateCategory(category);
   let dl=str.split(' ');
   if(isTitle){
        if(!i18n.isFrench() ||dl[0]!=1)return <Text style={[CommonZoomStyle("medium",{ zoom }),commonForeground(theme),styles.category, ]} accessibilityRole="header" accessible={true} numberOfLines={1} ellipsizeMode="tail">{str}</Text>;
        let s=commonZoomSizeFix("medium", { zoom })*0.8;
        return <View style={[{flexDirection:'row',alignItems:'center'},styles.category]} accessibilityRole="header"accessible={true}>
                    <Text style={[CommonZoomStyle("medium", { zoom }),commonForeground(theme),styles.date]}>{dl[0]}</Text>
                    <Text style={[CommonZoomStyle("mini", { zoom }),commonForeground(theme),{marginTop:-s},styles.date]}>er</Text>
                    <Text style={[CommonZoomStyle("medium", { zoom }),commonForeground(theme),styles.date]}> {dl[1]}</Text>
                    <Text style={[CommonZoomStyle("medium", { zoom }),commonForeground(theme),styles.date]}> {dl[2]}</Text>
                </View>;
       }
   else{
       if(!i18n.isFrench() ||dl[0]!=1)return <Text style={[CommonZoomStyle("small", { zoom }),commonForegroundLabel(theme)]} numberOfLines={1} ellipsizeMode="tail">{str}</Text>;
         let s=commonZoomSizeFix("small", { zoom })*0.8;
         return <View style={[{flexDirection:'row',alignItems:'center'},commonForegroundLabel(theme)]}>
                      <Text style={[CommonZoomStyle("small", { zoom }),commonForegroundLabel(theme)]}>{dl[0]}</Text>
                      <Text style={[CommonZoomStyle("small5", { zoom }),{marginTop:-s},commonForegroundLabel(theme)]}>er</Text>
                      <Text style={[CommonZoomStyle("small", { zoom }),commonForegroundLabel(theme)]}> {dl[1]}</Text>
                      <Text style={[CommonZoomStyle("small", { zoom }),commonForegroundLabel(theme)]}> {dl[2]}</Text>
               </View>;
   }
}
   const styles = StyleSheet.create({
     category: {
       fontWeight: "bold",
       paddingHorizontal: global.device == "2" ? 60 : 26,
       paddingTop: Platform.OS === "android" ? 0 : -10,
       paddingBottom: Platform.OS === "android" ? 0 : 10,
       marginBottom: Platform.OS === "android" ? 10 : 10,
       marginTop: 10,
     },
     date: {fontWeight: "bold",},
});


/////////////
/*
 if(!i18n.isFrench() ||dl[0]!=1)return <Text style={[commonForegroundLabel(theme),{marginTop: Platform.OS === "android" ? -1 : 3,},global.device == "2"? CommonZoomStyle("mini", { zoom }): CommonZoomStyle("mini", { zoom }),]} numberOfLines={1} ellipsizeMode="tail">{str}</Text>;
         let s=global.device == "2"? commonZoomSizeFix("mini4", { zoom }): commonZoomSizeFix("mini", { zoom });console.log('size:......',s);
         return <View style={[{flexDirection:'row',alignItems:'center'},commonForegroundLabel(theme),{marginTop: Platform.OS === "android" ? -1 : 3,},]}>
                      <Text style={[global.device == "2"? CommonZoomStyle("mini4", { zoom }): CommonZoomStyle("mini", { zoom }),commonForegroundLabel(theme)]}>{dl[0]}</Text>
                      <Text style={[global.device == "2"? CommonZoomStyle("mini5", { zoom }): CommonZoomStyle("mini1", { zoom }),{marginTop:-s*0.8},commonForegroundLabel(theme)]}>er</Text>
                      <Text style={[global.device == "2"? CommonZoomStyle("mini4", { zoom }): CommonZoomStyle("mini", { zoom }),commonForegroundLabel(theme)]}> {dl[1]}</Text>
                      <Text style={[global.device == "2"? CommonZoomStyle("mini4", { zoom }): CommonZoomStyle("mini", { zoom }),commonForegroundLabel(theme)]}> {dl[2]}</Text>
               </View>; */
