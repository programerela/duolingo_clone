import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSound } from '../../providers/SoundProvider';
import { useTheme } from '../../providers/ThemeProvider';
export function AnswerOption({label,selected,disabled,onPress,index}:{label:string;selected:boolean;disabled?:boolean;onPress:()=>void;index?:number}){
 const {play}=useSound(); const {colors}=useTheme();
 return <Pressable disabled={disabled} onPress={()=>{play('tap');onPress();}} style={({pressed})=>({minHeight:62,borderRadius:16,borderWidth:2,borderBottomWidth:pressed&&!disabled?2:4,borderColor:selected?colors.blue:colors.border,backgroundColor:selected?colors.blueSoft:colors.surface,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:14,transform:[{translateY:pressed&&!disabled?2:0}]})}>
  {typeof index==='number'&&<View style={{width:32,height:32,borderRadius:10,borderWidth:2,borderColor:selected?colors.blue:colors.border,alignItems:'center',justifyContent:'center'}}><Text style={{color:selected?colors.blue:colors.textSecondary,fontSize:13,fontWeight:'900'}}>{index+1}</Text></View>}
  <Text style={{flex:1,color:selected?colors.blue:colors.textPrimary,fontSize:17,fontWeight:'700'}}>{label}</Text>{selected&&<Ionicons name="checkmark" size={22} color={colors.blue}/>} 
 </Pressable>;
}
