import { Pressable, Switch, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../providers/ThemeProvider';
import { useSound } from '../../providers/SoundProvider';
type Props={icon:keyof typeof Ionicons.glyphMap;title:string;subtitle?:string;value?:string;onPress?:()=>void;danger?:boolean;toggle?:boolean;toggleValue?:boolean;onToggle?:(value:boolean)=>void;last?:boolean;};
export function SettingsRow({icon,title,subtitle,value,onPress,danger,toggle,toggleValue,onToggle,last}:Props){
 const {play}=useSound(); const {colors}=useTheme(); const contentColor=danger?colors.red:colors.textPrimary;
 return <Pressable disabled={!onPress&&!toggle} onPress={()=>{if(!onPress)return;play('tap');onPress();}} style={({pressed})=>({minHeight:70,flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:12,borderBottomWidth:last?0:1.5,borderBottomColor:colors.border,backgroundColor:pressed&&onPress?colors.surfaceRaised:colors.surface})}>
  <View style={{width:40,height:40,borderRadius:13,alignItems:'center',justifyContent:'center',backgroundColor:danger?colors.redSoft:colors.blueSoft}}><Ionicons name={icon} size={21} color={danger?colors.red:colors.blue}/></View>
  <View style={{flex:1}}><Text style={{fontSize:16,fontWeight:'800',color:contentColor}}>{title}</Text>{!!subtitle&&<Text style={{color:colors.textSecondary,fontSize:12,fontWeight:'600',marginTop:3}}>{subtitle}</Text>}</View>
  {toggle?<Switch value={Boolean(toggleValue)} onValueChange={(next)=>{play('tap');onToggle?.(next);}} trackColor={{false:colors.border,true:colors.greenPressed}} thumbColor={toggleValue?colors.green:colors.textSecondary}/>:<>{!!value&&<Text numberOfLines={1} style={{maxWidth:130,color:colors.textSecondary,fontSize:13,fontWeight:'700',marginRight:4}}>{value}</Text>}{!!onPress&&<Ionicons name="chevron-forward" size={22} color={colors.textMuted}/>}</>}
 </Pressable>;
}
