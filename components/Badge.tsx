import React from 'react'
import { View, Text ,StyleSheet} from 'react-native'
import iconSet from '@expo/vector-icons/build/FontAwesome5'
import Colors from '@/constants/Colors'


interface BadgeProps {
    text?: string | null;
    style?: object;
}

const Badge:React.FC<BadgeProps>=({text,style})=> {
  return (
    <View style={[styles.container, style]}>
        <Text style={styles.text}>{text}</Text>
    </View>
  )
}

export default Badge;

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#C2E7B2',
        padding: 8,
        width: 70,
        height: 30,
        borderRadius:10,
        margin: 5,
        alignContent:'center',
        justifyContent:'center',
    }
    ,
    text:{
        color:Colors.theme.primary,
        fontSize: 10,
        fontWeight:'bold',
        textAlign:'center'
    }
})

