import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen } from '../components/ui/Screen';
import { PageHeader } from '../components/navigation/PageHeader';
import { useTheme } from '../providers/ThemeProvider';
import { usePreferencesStore, type Appearance } from '../store/preferencesStore';
import { useSound } from '../providers/SoundProvider';

export default function AppearanceScreen(){
 const {colors}=useTheme(); const appearance=usePreferencesStore(s=>s.appearance); const setAppearance=usePreferencesStore(s=>s.setAppearance); const {play}=useSound();
 const Option=({mode,title,icon}:{mode:Appearance;title:string;icon:keyof typeof Ionicons.glyphMap})=>{
  const selected=appearance===mode;
  return <Pressable onPress={()=>{play('tap');void setAppearance(mode);}} style={({pressed})=>({minHeight:78,flexDirection:'row',alignItems:'center',gap:14,paddingHorizontal:16,borderWidth:2,borderBottomWidth:4,borderColor:selected?colors.blue:colors.border,borderRadius:18,backgroundColor:selected?colors.blueSoft:colors.surface,opacity:pressed?.75:1,marginBottom:12})}>
   <View style={{width:46,height:46,borderRadius:15,alignItems:'center',justifyContent:'center',backgroundColor:selected?colors.blue:colors.surfaceRaised}}><Ionicons name={icon} size={24} color={selected?colors.white:colors.textSecondary}/></View>
   <Text style={{flex:1,color:colors.textPrimary,fontSize:17,fontWeight:'900'}}>{title}</Text>{selected&&<Ionicons name="checkmark-circle" size={27} color={colors.blue}/>} 
  </Pressable>;
 };
 return <Screen><PageHeader title="Appearance"/><View style={{padding:20}}><Text style={{color:colors.textSecondary,fontWeight:'700',lineHeight:20,marginBottom:18}}>Choose how Lingocat looks. Your choice is saved on this device.</Text><Option mode="dark" title="Dark mode" icon="moon"/><Option mode="light" title="Light mode" icon="sunny"/></View></Screen>;
}
