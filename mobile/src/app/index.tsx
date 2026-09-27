import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { CatMascot } from '../components/mascot/CatMascot';
import { DuoButton } from '../components/ui/DuoButton';
import { Screen } from '../components/ui/Screen';
import { useTheme } from '../providers/ThemeProvider';

export default function WelcomeScreen(){
 const {colors}=useTheme();
 return <Screen style={{paddingHorizontal:24,paddingTop:10,paddingBottom:18}}>
  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,minHeight:42}}><View style={{width:10,height:10,borderRadius:5,backgroundColor:colors.green}}/><Text style={{color:colors.green,fontSize:26,fontWeight:'900',letterSpacing:-.8}}>LingoCat</Text></View>
  <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:12}}><View style={{padding:18,borderRadius:40,backgroundColor:colors.surfaceSoft,borderWidth:2,borderColor:colors.border}}><CatMascot size={176} mood="happy"/></View><Text style={{color:colors.textPrimary,fontSize:31,lineHeight:38,fontWeight:'900',textAlign:'center',marginTop:26,letterSpacing:-.7}}>Learn a language,{`\n`}one win at a time.</Text><Text style={{color:colors.textSecondary,fontSize:16,lineHeight:23,fontWeight:'600',textAlign:'center',maxWidth:330,marginTop:12}}>Short lessons, real progress, and a very persistent cat.</Text></View>
  <View style={{gap:13,paddingBottom:6}}><DuoButton title="Get started" onPress={()=>router.push('/register')}/><DuoButton title="I already have an account" variant="outline" onPress={()=>router.push('/login')}/></View>
 </Screen>;
}
