import type { ReactNode } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../providers/ThemeProvider';
import { useSound } from '../../providers/SoundProvider';
export function PageHeader({ title, right, onBack }: { title: string; right?: ReactNode; onBack?: () => void }) {
  const { play } = useSound(); const { colors } = useTheme();
  return <View style={{ minHeight:58, flexDirection:'row', alignItems:'center', paddingHorizontal:12, borderBottomWidth:2, borderBottomColor:colors.border, backgroundColor:colors.background }}>
    <Pressable hitSlop={12} onPress={() => { play('tap'); onBack ? onBack() : router.back(); }} style={({pressed}) => ({width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center',opacity:pressed?0.55:1})}><Ionicons name="chevron-back" size={30} color={colors.textSecondary}/></Pressable>
    <Text numberOfLines={1} style={{flex:1,color:colors.textPrimary,fontSize:18,fontWeight:'900',textAlign:'center'}}>{title}</Text><View style={{width:44,alignItems:'flex-end'}}>{right}</View>
  </View>;
}
