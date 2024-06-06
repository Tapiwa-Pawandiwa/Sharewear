import { View, Text, TouchableOpacity, StyleSheet , ViewStyle, TextStyle} from 'react-native'
import React from 'react';
import Colors from '@/constants/Colors';

type RoundedButtonProps = {
    title: string;
    onPress: () => void;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
  };

const RoundedButton: React.FC<RoundedButtonProps> = ({title,onPress,buttonStyle, textStyle}) => {
  return (
    <TouchableOpacity style={[styles.button,buttonStyle]}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default RoundedButton;

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 20,
        width: 200,
        marginTop: 20,
        justifyContent: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        textAlign: 'center',
    },
    });