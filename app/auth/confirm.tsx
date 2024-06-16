import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoundedButton from '@/components/RoundedButton';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { confirmSignUp } from 'aws-amplify/auth';

/*
    Custom Confirm Sign Up Screen
    1. Purpose : To allow users to confirm their sign up once they have received a code in their email
*/

export default function ConfirmSignUp() {
  const [username, setUsername] = useState('');
  const [authCode, setAuthCode] = useState('');
 // const { name, family_name,password, username: signUpUsername } = Auth.currentUserInfo();
  
   const onConfirm =  async () =>{
    try {
      confirmSignUp({
        username: username,
        confirmationCode: authCode,
      }
      )
      console.log("Username:", username);
      console.log("Auth Code:", authCode);

     // const user = await Auth.currentAuthenticatedUser();
    
     // await Auth.signOut();
      Alert.alert('Success', 'Code confirmed! 🎉 You can now sign in.', [
        { text: 'Sign In', onPress: () => router.navigate('/protected') },
      ]);


    } catch (error) {

      Alert.alert(   
        'Error',
        'Verification code does not match. Please enter a valid verification code.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
      console.log(
     error,
      );
    }
  }
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Confirm Sign Up</Text>
        <TextInput
          value={username}
          onChangeText={text => setUsername(text)}
          placeholder="Enter username/email again"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          style={styles.input}
        />
        <TextInput 
          value={authCode}
          onChangeText={text => setAuthCode(text)}
          placeholder="Enter verification code"
          keyboardType="numeric"
          style={styles.input}
        />
        <RoundedButton title="Confirm Sign Up" onPress={onConfirm} />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      backgroundColor: 'white'
    },
    container: {
      flex: 1,
      alignItems: 'center'
    },
    title: {
      fontSize: 20,
      color: '#202020',
      fontWeight: '500',
      marginVertical: 15
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: "black",
      },
  });
