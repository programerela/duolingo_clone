import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { PageHeader } from '../components/navigation/PageHeader';
import { CatMascot } from '../components/mascot/CatMascot';
import { DuoButton } from '../components/ui/DuoButton';
import { DuoInput } from '../components/ui/DuoInput';
import { Screen } from '../components/ui/Screen';
import { profileApi } from '../services/profileApi';
import { useSound } from '../providers/SoundProvider';
import { useTheme } from '../providers/ThemeProvider';
export default function EditProfileScreen(){
 const {colors}=useTheme(); const qc=useQueryClient(); const {play}=useSound(); const meQuery=useQuery({queryKey:['me'],queryFn:profileApi.me}); const [displayName,setDisplayName]=useState(''); const [username,setUsername]=useState('');
 useEffect(()=>{if(meQuery.data){setDisplayName(meQuery.data.displayName??'');setUsername(meQuery.data.username);}},[meQuery.data]);
 const mutation=useMutation({mutationFn:()=>profileApi.update({displayName:displayName.trim()||null,username:username.trim()}),onSuccess:async()=>{play('correct');await qc.invalidateQueries({queryKey:['me']});router.back();}});
 if(meQuery.isLoading)return <Screen style={{alignItems:'center',justifyContent:'center'}}><ActivityIndicator color={colors.green} size="large"/></Screen>;
 return <Screen><PageHeader title="Edit profile"/><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}><ScrollView contentContainerStyle={{padding:20,paddingBottom:36}} keyboardShouldPersistTaps="handled"><View style={{flexDirection:'row',alignItems:'center',gap:16,borderWidth:2,borderColor:colors.border,borderRadius:20,backgroundColor:colors.surface,padding:16,marginBottom:24}}><CatMascot size={94}/><View style={{flex:1}}><Text style={{color:colors.textPrimary,fontSize:16,fontWeight:'900'}}>Your Lingocat profile</Text><Text style={{color:colors.textSecondary,fontSize:12,lineHeight:17,fontWeight:'600',marginTop:4}}>Keep your profile clean and recognizable across the app.</Text></View></View><Text style={{color:colors.textSecondary,fontSize:12,fontWeight:'900',letterSpacing:.8,marginBottom:8,marginTop:14}}>NAME</Text><DuoInput value={displayName} onChangeText={setDisplayName} placeholder="Name"/><Text style={{color:colors.textSecondary,fontSize:12,fontWeight:'900',letterSpacing:.8,marginBottom:8,marginTop:14}}>USERNAME</Text><DuoInput value={username} onChangeText={setUsername} placeholder="Username" autoCapitalize="none" autoCorrect={false}/><Text style={{color:colors.textSecondary,fontSize:12,fontWeight:'900',letterSpacing:.8,marginBottom:8,marginTop:14}}>EMAIL</Text><View style={{minHeight:56,borderWidth:2,borderColor:colors.border,borderRadius:16,backgroundColor:colors.surfaceSoft,justifyContent:'center',paddingHorizontal:16,opacity:.82}}><Text style={{color:colors.textSecondary,fontSize:16,fontWeight:'600'}}>{meQuery.data?.email}</Text></View><Text style={{color:colors.textMuted,fontSize:11,fontWeight:'600',marginTop:7}}>For account security, your sign-in email is read-only here.</Text>{!!mutation.error&&<Text style={{color:colors.red,fontWeight:'800',marginTop:14}}>{mutation.error instanceof Error?mutation.error.message:'Could not update profile'}</Text>}<DuoButton title="Save changes" disabled={username.trim().length<3} loading={mutation.isPending} onPress={()=>mutation.mutate()} style={{marginTop:24}}/></ScrollView></KeyboardAvoidingView></Screen>;
}
