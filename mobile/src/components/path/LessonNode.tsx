import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { PathLesson } from '../../types/course';
import { useSound } from '../../providers/SoundProvider';
import { useTheme } from '../../providers/ThemeProvider';

export function LessonNode({lesson,offset,onPress}:{lesson:PathLesson;offset:number;onPress:()=>void}){
 const {play}=useSound(); const {colors}=useTheme(); const locked=lesson.status==='LOCKED'; const completed=lesson.status==='COMPLETED'; const bg=locked?colors.surfaceRaised:colors.green; const shadow=locked?colors.border:colors.greenPressed;
 return <View style={{alignItems:'center',marginVertical:11,transform:[{translateX:offset}]}}>
  <Pressable disabled={locked} onPress={()=>{play('tap');onPress();}} style={({pressed})=>({width:80,height:80,borderRadius:40,alignItems:'center',justifyContent:'center',backgroundColor:bg,borderBottomColor:shadow,borderBottomWidth:pressed?2:8,transform:[{translateY:pressed?6:0}],opacity:locked?.75:1})}>
   <Ionicons name={locked?'lock-closed':completed?'checkmark':'star'} size={35} color={locked?colors.textMuted:colors.white}/>
  </Pressable>
  <Text numberOfLines={2} style={{color:locked?colors.textMuted:colors.textSecondary,fontSize:12,fontWeight:'800',marginTop:8,maxWidth:132,textAlign:'center'}}>{lesson.title}</Text>
 </View>;
}
