export function toStdDateStrFormat(str){return str.substring(0,str.lastIndexOf('-'));}
export function toStdDateStr(date){
      let yy=date.getFullYear();
      let mm1=date.getMonth()+1;let mm=mm1<10?`0${mm1}`:`${mm1}`;
      let dd1=date.getDate();let dd=dd1<10?`0${dd1}`:`${dd1}`;
      let hh1=date.getHours();let hh=hh1<10?`0${hh1}`:`${hh1}`;
      let mi1=date.getMinutes();let mi=mi1<10?`0${mi1}`:`${mi1}`;
      let ss1=date.getSeconds()+1;let ss=ss1<10?`0${ss1}`:`${ss1}`;
      return `${yy}-${mm}-${dd}T${hh}:${mi}:${ss}`;}
export function toStdDate(str){//convert api return format to East time, 2022-02-08T13:40:34-0500
       let str1=str.substring(0,str.lastIndexOf('-')); //console.log(str,str1);
       let dp=str1.split('T');//console.log(dp);
       let ds=dp[0].split('-');
       let dt=dp[1].split(':');
       return new Date(ds[0],parseInt(ds[1])-1,ds[2],dt[0],dt[1],dt[2]);
   }
export function toStdDateSimple(str){//convert api return format to East time, 2022-02-08T13:40:34-0500
       let str1=str.trim();
       let dp=str1.split('T');//console.log(dp);
       let ds=dp[0].split('-');
       let dt=dp[1].split(':');
       return new Date(ds[0],parseInt(ds[1])-1,ds[2],dt[0],dt[1],dt[2]);
   }
export function isAfternoonByDateStr(str){//convert api return format to East time, 2022-02-08T13:40:34-0500
       let str1=str.substring(0,str.lastIndexOf('-'));
       let dp=str1.split('T');//console.log(dp);
       let ds=dp[0].split('-');
       let dt=dp[1].split(':');
       return dt[1]>12;
   }
export function isAfternoonByDate(date){return date.getHours()>12;}

export function isDateStrGreater(sDate1,sDate2){//convert api return format to East time, 2022-02-08T13:40:34-0500
 /* let str1=sDate1.substring(0,sDate1.lastIndexOf('-'));
  let dp1=str1.split('T');
  let ds1=dp1[0].split('-');
  let dt1=dp1[1].split(':');

  let str2=sDate2.substring(0,sDate2.lastIndexOf('-'));
  let dp2=str2.split('T');
  let ds2=dp2[0].split('-');
  let dt2=dp2[1].split(':');
  let result=true;*/
  let date1=toStdDate(sDate1);let date2=toStdDate(sDate2);
         return +date1 >= +date2;
   }
export function isDateGreater(date1,date2){return +date1 >= +date2;}

export function areOnSameStdDayByStr(first, second){
   let str1=first.substring(0,sDate1.lastIndexOf('-'));
     let dp1=str1.split('T');
     let ds1=dp1[0].split('-');
     let dt1=dp1[1].split(':');

     let str2=second.substring(0,sDate2.lastIndexOf('-'));
     let dp2=str2.split('T');
     let ds2=dp2[0].split('-');
     let dt2=dp2[1].split(':');

     if(ds1[0]!=ds2[0])return false;
     if(ds1[1]!=ds2[1])return false;
     if(ds1[2]!=ds2[2])return false;
     return true;
}
export function areOnSameStdDay(first, second){
    let yy1=first.getFullYear();
    let mm1=first.getMonth();
    let dd1=first.getDate();

    let yy2=second.getFullYear();
    let mm2=second.getMonth();
    let dd2=second.getDate();
    if(yy1!=yy2)return false;
    if(mm1!=mm2)return false;
    if(dd1!=dd2)return false;
    return true;
}

export function areOnSameHalfStdDayByStr(first, second){
   let str1=first.substring(0,sDate1.lastIndexOf('-'));
     let dp1=str1.split('T');
     let ds1=dp1[0].split('-');
     let dt1=dp1[1].split(':');

     let str2=second.substring(0,sDate2.lastIndexOf('-'));
     let dp2=str2.split('T');
     let ds2=dp2[0].split('-');
     let dt2=dp2[1].split(':');

     if(ds1[0]!=ds2[0])return false;
     if(ds1[1]!=ds2[1])return false;

     return ((ds1[2] < 12 && ds2[2] < 12) || (ds1[2] >= 12 && ds2[2] >= 12));
}
export function areOnSameHalfStdDay(first, second){
   return first.getFullYear() === second.getFullYear() &&
          first.getMonth() === second.getMonth() &&
          first.getDate() === second.getDate() &&
          ((first.getHours() < 12 && second.getHours() < 12) ||
            (first.getHours() >= 12 && second.getHours() >= 12));
}