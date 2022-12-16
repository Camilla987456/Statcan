/** @format */

import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
TextInput
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, FontAwesome5, Feather } from "@expo/vector-icons";
import "../settings.js";
import {
  convertDateCategory,
} from "../services";

import i18n from "../resources.js";
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonMenuBackground,
  commonForeground,
  commonFrameBackground,
  commonBorder,
  commonForegroundHighlightColor,
  commonCardBackground,
  commonForegroundDes,
  themeLiteral,
} from "../normalization.js";
import {toStdDateStr,toStdDate,areOnSameStdDay,isAfternoonByDate,areOnSameHalfStdDay,toStdDateSimple} from '../stdDates.js';

let currentPage = 0;
let list=[
  { "title": "Article 1","date": "2022-02-08T10:40:34-0500"},
  { "title": "Article 2","date": "2022-02-08T08:40:34-0500"},
  { "title": "Article 3","date": "2022-02-07T08:40:34-0500"},
  { "title": "Article 4","date": "2022-02-06T08:40:34-0500"},
];


const GroupingTestScreen = ({navigation }) => {
   const [date0,setDate0]=useState(list[0].date);
   const [date1,setDate1]=useState(list[1].date);
   const [date2,setDate2]=useState(list[2].date);
   const [date3,setDate3]=useState(list[3].date);
   const [curr,setCurr]=useState('');
   const [result,setResult]=useState('');
   const [currentTime,setCurrentTime]=useState(date0.substring(11,19));

  const groupPublications = (publications,currentStr) => {
        if (publications.length == 0) return [];
        let current = toStdDateSimple(currentStr);console.log('start1',current);
        let fistItemDate = toStdDate(publications[0].date);
        let categoryDate=fistItemDate;
        let category = i18n.t("latest");
        let groupList = [];
        let list = [];console.log('start loop......');
        for (let i = 0; i < publications.length; i++) {
           let itemDate = toStdDate(publications[i].date);
           let itemDateStrRaw = publications[i].date;
           if (areOnSameStdDay(current, itemDate)) {
             console.log('current and itemDate are Same day');
             if (isAfternoonByDate(current)) {console.log('current is Afternoon');
                if (isAfternoonByDate(itemDate)) {console.log('itemdate pass noon');
                    list.push(publications[i]);}
                else {console.log('itemdate Not pass noon');
                    if (category == i18n.t("earlierToday")) {console.log('in Early date category');
                             list.push(publications[i]);}
                    else {console.log('Not in Early date category');
                        if (!areOnSameHalfStdDay(categoryDate, itemDate) && list.length > 0) {
                            groupList.push({ category: category, data: list });
                            categoryDate = itemDate;
                            category = i18n.t("earlierToday");
                            list = [];
                            list.push(publications[i]);console.log('add into Early');
                        } else {console.log('keep in same category');
                            list.push(publications[i]);
                        }
                    }
                }
             } else {console.log('current is Morning');
                         list.push(publications[i]);
             }
           } else {console.log('current and itemDate are Not Same day');
               if (areOnSameStdDay(categoryDate, itemDate)) {
                   console.log('categoryDate and itemDate are Same day');
                   list.push(publications[i]);}
               else {
                    console.log('categoryDate and itemDate are Not Same day');
                    if (list.length > 0)groupList.push({ category: category, data: list });
                    categoryDate = itemDate;
                    category = convertDateCategory(itemDateStrRaw.substring(0, itemDateStrRaw.indexOf("T")));
                     list = [];
                     list.push(publications[i]);
               }
           }

        }

        console.log('End.............................................');
        if (list.length > 0) groupList.push({ category: category, data: list });
        list = [];
        return groupList;
  };

  const onTest=()=>{
      let pubs=[
         {title:list[0].title,date:date0},
         {title:list[1].title,date:date1},
         {title:list[2].title,date:date2},
         {title:list[3].title,date:date3},
      ];
      console.log('Start..........................');
      let currDT=`${date0.substring(0,10)} ${currentTime}`;
      let td=new Date();//let tdStr=`${}`;
      let cStr=toStdDateStr(td);console.log('Current string:',cStr);
      let str='';
      let gpub=groupPublications(pubs,cStr);

      gpub.forEach(x=>{
        str+=x.category+'\n';
        x.data.forEach(y=>{
           str+='\t\t'+y.title+'\n'
        });
      });

    /*   console.log(gpub);
      let str=JSON.stringify(gpub); */
      setResult(str);
  }
  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
      <View
        style={[
          {
            flexDirection: "row",
            marginTop: 10,
            alignItems: "center",
            marginBottom: 20,
            borderWidth: 1,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            elevation: 0,
            borderColor: "#CCD1D7",
          },
          commonCardBackground(theme),
        ]}
      >
        <TouchableOpacity
          style={{}}
          accessibilityRole="button"
          accessible={true}
          onPress={() => {
            navigation.navigate("Settings");
          }}
          accessibilityLabel={i18n.t("goBack")}
        >
          <Feather
            name="chevron-left"
            size={global.device == "2" ? 50 : 24}
            style={[
              commonForeground(theme),
              {
                paddingHorizontal: "4%",
                marginTop: 10,
                marginBottom: 10,
              },
            ]}
          />
        </TouchableOpacity>
        <Text
          style={[
            CommonZoomStyle("small", { zoom }),
            commonFontWeight({ bold }),
            commonForeground(theme),
            { flex: 1, textAlign: "center", marginRight: "8%" },
          ]}
        >
          Grouping test
        </Text>
        <Text onPress={onTest} style={{marginRight:10}}>Test</Text>
      </View>
      <Text>Change the date but keep them descending</Text>
      <View style={{width:'100%',paddingHorizontal:10,borderBottomWidth:1}}>
         <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:20}}>
            <Text style={styles.title}>{list[0].title}</Text><TextInput value={date0} onChangeText={setDate0} style={styles.item}/>
         </View>
         <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:20}}>
            <Text style={styles.title}>{list[1].title}</Text><TextInput value={date1} onChangeText={setDate1} style={styles.item}/>
         </View>
         <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:20}}>
            <Text style={styles.title}>{list[2].title}</Text><TextInput value={date2} onChangeText={setDate2} style={styles.item}/>
         </View>
         <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:20}}>
           <Text style={styles.title}>{list[3].title}</Text><TextInput value={date3} onChangeText={setDate3} style={styles.item}/>
         </View>
         <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:20}}>
             <Text style={styles.title}>{date0.substring(0,10)}</Text>
             <Text style={styles.title}>Current Time:</Text><TextInput value={currentTime} onChangeText={setCurrentTime} style={styles.item}/>
         </View>
      </View>
      <Text style={styles.title}>{curr}</Text>
      <Text style={styles.title}>{result}</Text>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  title: {
      fontSize:18
  },
  item: {
    borderWidth:1,fontSize:20
  },
});
export default GroupingTestScreen;
