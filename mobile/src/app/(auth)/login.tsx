import { useState } from 'react';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { PageHeader } from '../../components/navigation/PageHeader';
import { CatMascot } from '../../components/mascot/CatMascot';
import { DuoButton } from '../../components/ui/DuoButton';
import { DuoInput } from '../../components/ui/DuoInput';
import { Screen } from '../../components/ui/Screen';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../providers/ThemeProvider';
export default function LoginScreen(){
 const {colors}=useTheme(); const [emailOrUsername,setEmailOrUsername]=useState(''); const [password,setPassword]=useState(''); const {login,loading,error,clearError}=useAuthStore();
 const submit=async()=>{clearError();try{await login(emailOrUsername.trim(),password);router.replace('/learn');}catch{}};
 return <Screen><PageHeader title="Log in"/><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}><ScrollView contentContainerStyle={{flexGrow:1,paddingHorizontal:24,paddingTop:30,paddingBottom:30,alignItems:'center'}} keyboardShouldPersistTaps="handled"><CatMascot size={104}/><Text style={{color:colors.textPrimary,fontSize:29,fontWeight:'900',marginTop:18}}>Welcome back!</Text><Text style={{color:colors.textSecondary,fontSize:15,fontWeight:'600',textAlign:'center',marginTop:7}}>Your streak has been asking about you.</Text><View style={{width:'100%',gap:13,marginTop:30}}><DuoInput value={emailOrUsername} onChangeText={setEmailOrUsername} placeholder="Email or username" autoCapitalize="none" autoCorrect={false}/><DuoInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry onSubmitEditing={submit}/>{!!error&&<Text style={{color:colors.red,fontWeight:'800',fontSize:13,paddingHorizontal:2}}>{error}</Text>}<DuoButton title="Log in" loading={loading} disabled={!emailOrUsername.trim()||!password} onPress={submit}/></View></ScrollView></KeyboardAvoidingView></Screen>;
}
