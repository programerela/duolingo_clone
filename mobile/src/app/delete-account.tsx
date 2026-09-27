import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PageHeader } from '../components/navigation/PageHeader';
import { DuoButton } from '../components/ui/DuoButton';
import { DuoInput } from '../components/ui/DuoInput';
import { Screen } from '../components/ui/Screen';
import { profileApi } from '../services/profileApi';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../providers/ThemeProvider';
export default function DeleteAccountScreen(){
 const {colors}=useTheme(); const [password,setPassword]=useState(''); const clear=useAuthStore(s=>s.clearLocalSession); const qc=useQueryClient(); const mutation=useMutation({mutationFn:()=>profileApi.deleteAccount(password),onSuccess:async()=>{await clear();qc.clear();router.replace('/');}}); const submit=()=>Alert.alert('Delete account permanently?','Your XP, streak and course progress will be removed. This cannot be undone.',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>mutation.mutate()}]);
 return <Screen><PageHeader title="Delete account"/><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}><ScrollView contentContainerStyle={{padding:22,paddingBottom:36,alignItems:'center'}} keyboardShouldPersistTaps="handled"><View style={{width:76,height:76,borderRadius:24,backgroundColor:colors.redSoft,alignItems:'center',justifyContent:'center',marginTop:26}}><Ionicons name="warning" size={38} color={colors.red}/></View><Text style={{color:colors.textPrimary,fontSize:27,fontWeight:'900',marginTop:20}}>This is permanent</Text><Text style={{color:colors.textSecondary,fontSize:14,lineHeight:21,fontWeight:'600',textAlign:'center',marginTop:9,marginBottom:28}}>Deleting your account removes your profile, progress, lesson attempts, XP and streak data.</Text><DuoInput value={password} onChangeText={setPassword} placeholder="Enter your password to confirm" secureTextEntry style={{width:'100%'}}/>{!!mutation.error&&<Text style={{color:colors.red,fontWeight:'800',alignSelf:'stretch',marginTop:12}}>{mutation.error instanceof Error?mutation.error.message:'Could not delete account'}</Text>}<DuoButton title="Delete my account" variant="red" disabled={!password} loading={mutation.isPending} onPress={submit} style={{width:'100%',marginTop:18}}/></ScrollView></KeyboardAvoidingView></Screen>;
}
