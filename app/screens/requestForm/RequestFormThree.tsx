import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RoundedButton from '@/components/RoundedButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const RequestFormThree:React.FC = () => {
  return (
<SafeAreaView>
    <Text>Request Form One</Text>
    <RoundedButton title='Next' onPress={() => {}}/>
</SafeAreaView>
)
}

export default RequestFormThree