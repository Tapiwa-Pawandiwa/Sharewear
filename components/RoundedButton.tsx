import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react';
import Colors from '@/constants/Colors';

type RoundedButtonProps = {
    title: string;
    onPress: () => void;
    style: object;
};

const RoundedButton: React.FC<RoundedButtonProps> = ({title,onPress,style}) => {
  return (
    <TouchableOpacity style={[styles.button,style]}>
      <Text style={styles.buttonText}>{title}</Text>
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
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    });