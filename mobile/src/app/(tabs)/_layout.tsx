import { useCallback } from 'react';
import { BackHandler, View } from 'react-native';
import { Tabs, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../providers/ThemeProvider';

export default function TabsLayout(){
 const insets=useSafeAreaInsets(); const {colors}=useTheme();
 useFocusEffect(useCallback(()=>{const sub=BackHandler.addEventListener('hardwareBackPress',()=>{BackHandler.exitApp();return true;});return()=>sub.remove();},[]));
 const iconFor=(name:keyof typeof Ionicons.glyphMap,focused:boolean)=><View style={{width:40,height:34,alignItems:'center',justifyContent:'center',borderRadius:12,backgroundColor:focused?colors.blueSoft:colors.transparent}}><Ionicons name={name} size={25} color={focused?colors.blue:colors.textMuted}/></View>;
 return <Tabs initialRouteName="learn" backBehavior="none" screenOptions={{headerShown:false,tabBarHideOnKeyboard:true,tabBarStyle:{backgroundColor:colors.nav,borderTopColor:colors.border,borderTopWidth:2,height:64+insets.bottom,paddingTop:6,paddingBottom:Math.max(insets.bottom,7),elevation:0},tabBarActiveTintColor:colors.blue,tabBarInactiveTintColor:colors.textMuted,tabBarLabelStyle:{fontSize:10,fontWeight:'900',marginTop:-2}}}>
  <Tabs.Screen name="learn" options={{title:'Learn',tabBarIcon:({focused})=>iconFor('home',focused)}}/>
  <Tabs.Screen name="quests" options={{title:'Quests',tabBarIcon:({focused})=>iconFor('checkmark-circle',focused)}}/>
  <Tabs.Screen name="leaderboard" options={{title:'Leagues',tabBarIcon:({focused})=>iconFor('shield',focused)}}/>
  <Tabs.Screen name="shop" options={{title:'Shop',tabBarIcon:({focused})=>iconFor('storefront',focused)}}/>
  <Tabs.Screen name="profile" options={{title:'Profile',tabBarIcon:({focused})=>iconFor('person',focused)}}/>
 </Tabs>;
}
