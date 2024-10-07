import React from 'react'
import { useState,useEffect } from 'react'
import { View ,Text,StyleSheet, Alert,TextInput} from 'react-native'
import { supabase } from '@/lib/supabase'
import { useGlobalSearchParams } from 'expo-router';
import RoundedButton from '@/components/RoundedButton';




const ResetPasswordScreen=()=> {
  const {token} = useGlobalSearchParams();
  const [newPassword,setNewPassword] = useState('');

  const resetPassword = async () => {
    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Password has been reset.');
        // Redirect to login or main page
      }
    } catch (error) {
      Alert.alert('Error');
    }
  };

 
  return (
    <View>
      <Text>Reset Password</Text>
      <Text>Enter your new password</Text>
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter your new password"
        secureTextEntry
      />
      <RoundedButton title="Reset Password" onPress={resetPassword} />
    </View>
  )
}

export default ResetPasswordScreen;