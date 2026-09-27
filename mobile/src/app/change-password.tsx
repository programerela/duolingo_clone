import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/navigation/PageHeader';
import { DuoButton } from '../components/ui/DuoButton';
import { DuoInput } from '../components/ui/DuoInput';
import { Screen } from '../components/ui/Screen';
import { profileApi } from '../services/profileApi';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../providers/ThemeProvider';
export default function ChangePasswordScreen(){
 const {colors}=useTheme(); const [currentPassword,setCurrentPassword]=useState(''); const [newPassword,setNewPassword]=useState(''); const [confirmPassword,setConfirmPassword]=useState(''); const clear=useAuthStore(s=>s.clearLocalSession); const qc=useQueryClient();
 const mutation=useMutation({mutationFn:()=>profileApi.changePassword(currentPassword,newPassword),onSuccess:async()=>{await clear();qc.clear();Alert.alert('Password changed','For security, log in again with your new password.',[{text:'OK',onPress:()=>router.replace('/login')}]);}}); const valid=currentPassword.length>0&&newPassword.length>=8&&newPassword===confirmPassword&&currentPassword!==newPassword;
 return <Screen><PageHeader title="Change password"/><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}><ScrollView contentContainerStyle={{padding:22,paddingBottom:36,gap:13}} keyboardShouldPersistTaps="handled"><Text style={{color:colors.textPrimary,fontSize:25,fontWeight:'900',marginTop:12}}>Choose a new password</Text><Text style={{color:colors.textSecondary,fontSize:14,lineHeight:20,fontWeight:'600',marginBottom:10}}>Changing it signs out your existing refresh sessions.</Text><DuoInput value={currentPassword} onChangeText={setCurrentPassword} placeholder="Current password" secureTextEntry/><DuoInput value={newPassword} onChangeText={setNewPassword} placeholder="New password (8+ characters)" secureTextEntry/><DuoInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm new password" secureTextEntry/>{confirmPassword.length>0&&newPassword!==confirmPassword&&<Text style={{color:colors.red,fontWeight:'800',fontSize:13}}>Passwords do not match.</Text>}{!!mutation.error&&<Text style={{color:colors.red,fontWeight:'800',fontSize:13}}>{mutation.error instanceof Error?mutation.error.message:'Could not change password'}</Text>}<DuoButton title="Change password" disabled={!valid} loading={mutation.isPending} onPress={()=>mutation.mutate()}/></ScrollView></KeyboardAvoidingView></Screen>;
}
