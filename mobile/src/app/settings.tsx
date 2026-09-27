import type { ReactNode } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/navigation/PageHeader';
import { SettingsRow } from '../components/settings/SettingsRow';
import { Screen } from '../components/ui/Screen';
import { profileApi } from '../services/profileApi';
import { useAuthStore } from '../store/authStore';
import { usePreferencesStore } from '../store/preferencesStore';
import { useTheme } from '../providers/ThemeProvider';
import { addStreakWidgetToHomeScreen, syncStreakWidget } from '../native/streakWidget';

const feature=(title:string,description:string,icon='sparkles')=>router.push({pathname:'/feature',params:{title,description,icon}});

export default function SettingsScreen(){
 const {colors}=useTheme(); const meQuery=useQuery({queryKey:['me'],queryFn:profileApi.me}); const logout=useAuthStore(s=>s.logout); const qc=useQueryClient();
 const soundEnabled=usePreferencesStore(s=>s.soundEnabled); const setSoundEnabled=usePreferencesStore(s=>s.setSoundEnabled); const appearance=usePreferencesStore(s=>s.appearance);
 const me=meQuery.data;
 const doLogout=()=>Alert.alert('Log out?','You can log back in anytime.',[{text:'Cancel',style:'cancel'},{text:'Log out',style:'destructive',onPress:async()=>{await logout();qc.clear();router.replace('/');}}]);
 const addWidget=()=>{
  syncStreakWidget(me?.stats.streak??0);
  const requested=addStreakWidgetToHomeScreen();
  if(requested){Alert.alert('Add LingoCat widget','Confirm the widget placement on your home screen.');}
  else{Alert.alert('Add the widget manually','Long-press your Samsung home screen, choose Widgets, find LingoCat, then add the Streak widget.');}
 };
 const Section=({label,children}:{label:string;children:ReactNode})=><><Text style={{color:colors.textSecondary,fontWeight:'900',fontSize:12,letterSpacing:.8,marginTop:22,marginBottom:9,marginLeft:4}}>{label}</Text><View style={{borderWidth:2,borderColor:colors.border,borderRadius:20,overflow:'hidden',backgroundColor:colors.surface}}>{children}</View></>;
 return <Screen><PageHeader title="Settings"/><ScrollView contentContainerStyle={{paddingHorizontal:18,paddingTop:8,paddingBottom:42}} showsVerticalScrollIndicator={false}>
  <View style={{backgroundColor:colors.blueSoft,borderRadius:20,padding:16,flexDirection:'row',alignItems:'center',gap:12,borderWidth:2,borderColor:colors.border}}><View style={{width:48,height:48,borderRadius:16,backgroundColor:colors.blue,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:23}}>🐱</Text></View><View style={{flex:1}}><Text style={{color:colors.textPrimary,fontSize:17,fontWeight:'900'}}>{me?.displayName||me?.username||'Lingocat learner'}</Text><Text style={{color:colors.textSecondary,fontSize:12,fontWeight:'700',marginTop:2}}>{me?.email??''}</Text></View></View>
  <Section label="ACCOUNT">
   <SettingsRow icon="person-circle" title="Profile" subtitle="Name, username and profile details" onPress={()=>router.push('/edit-profile')}/>
   <SettingsRow icon="at" title="Username" value={me?.username?`@${me.username}`:''} onPress={()=>router.push('/edit-profile')}/>
   <SettingsRow icon="mail" title="Email" value={me?.email??''} onPress={()=>feature('Email address','Your verified email is used for sign-in and account security.','mail')}/>
   <SettingsRow icon="key" title="Password" subtitle="Change your password" onPress={()=>router.push('/change-password')} last/>
  </Section>
  <Section label="PREFERENCES">
   <SettingsRow icon="volume-high" title="Sound effects" subtitle="Feedback, buttons and lesson sounds" toggle toggleValue={soundEnabled} onToggle={(v)=>void setSoundEnabled(v)}/>
   <SettingsRow icon={appearance==='dark'?'moon':'sunny'} title="Appearance" value={appearance==='dark'?'Dark':'Light'} onPress={()=>router.push('/appearance')}/>
   <SettingsRow icon="language" title="Learning language" value={me?.activeCourse?.title??'Choose'} onPress={()=>router.replace('/learn')}/>
   <SettingsRow icon="notifications" title="Notifications" value="On" onPress={()=>feature('Notifications','Choose streak, practice and motivation reminders.','notifications')} last/>
  </Section>
  <Section label="HOME SCREEN">
   <SettingsRow icon="flame" title="Streak widget" subtitle="Keep your current streak on the Samsung home screen" onPress={addWidget} last/>
  </Section>
  <Section label="SUPPORT">
   <SettingsRow icon="help-circle" title="Help center" onPress={()=>feature('Help center','Common questions, lesson help and account support.','help-circle')}/>
   <SettingsRow icon="information-circle" title="About Lingocat" subtitle="Version, courses and technology" onPress={()=>feature('About Lingocat','LingoCat brings short lessons, streaks, rewards and progress tracking together in one place.','information-circle')} last/>
  </Section>
  <Section label="ACCOUNT ACTIONS">
   <SettingsRow icon="log-out" title="Log out" danger onPress={doLogout}/>
   <SettingsRow icon="trash" title="Delete account" subtitle="Permanently removes your progress" danger onPress={()=>router.push('/delete-account')} last/>
  </Section>
  <Text style={{color:colors.textMuted,fontWeight:'700',fontSize:11,textAlign:'center',marginTop:28}}>Lingocat · development build</Text>
 </ScrollView></Screen>;
}
