import { View, Text, TouchableOpacity, StyleSheet , ViewStyle, TextStyle, Pressable} from 'react-native'
import React from 'react';
import Colors from '@/constants/Colors';
import { Link, router } from 'expo-router';
import { useRouter } from 'expo-router';

type RoundedButtonProps = {
  title: string;
  onPress?: any; // Keep onPress prop for compatibility
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: ViewStyle;
  link?: string;
  icon?: any;
  disabled?: boolean; 
};

const RoundedButton: React.FC<RoundedButtonProps> = ({ title, onPress, buttonStyle, textStyle, link, icon,iconStyle , disabled}) => {
const router = useRouter();

if (link && !disabled) {
  return (
  <Link href={link ?? '' } style={[styles.button, buttonStyle]} asChild>
  <Pressable onPress={onPress}>
    <View style={styles.buttonContainer}>
      <Text style={[styles.buttonText, textStyle]}>{title} </Text>
      {icon && <View style={iconStyle}>{icon}</View>}
    </View>
  </Pressable>
  </Link>
);
}
return (

  <Pressable onPress={disabled ? undefined : onPress} style={[styles.button, buttonStyle]}>
    <View style={styles.buttonContainer}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      {icon && <View style={iconStyle}>{icon}</View>}
    </View>
  </Pressable>
);
};

export default RoundedButton;

const styles = StyleSheet.create({
    button: {
      paddingVertical: 10, 
      paddingHorizontal: 20,
      alignItems: 'center', 
      borderRadius: 25,
        width: 200,
        marginTop: 20,
        justifyContent: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    
    },
    });