import { View } from '@/components/Themed'
import { Text, StyleSheet, TextInput, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import Colors from '@/constants/Colors'
import RoundedButton from '@/components/RoundedButton'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { signIn } from 'aws-amplify/auth';

const signInScreen = () => {
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [error, setError] = useState('');
    // Function to toggle the password visibility state 
    const toggleShowPassword = () => { 
        setShowPassword(!showPassword); 
    }; 
  
    const onSignIn = async () => {
        setError('');
        console.log('Signing in...');
        try {
          await signIn({
            username: email,
            password,
          })
        } catch (e: any) {
           setError(e.message);
            console.log('Sign in failed', e);
        }
        //expo go not supported so need work around here 

    }
  return (
    <View style={styles.container}> 
    <Image source={require('../../assets/images/logos/main-logo.png')} style={styles.image} />
        <Text style={styles.title}>Sign In to your account</Text>
 
         <TextInput
            style={styles.input}
            placeholder='Email'
            onChangeText={setEmail}
            value={email}
        />
        <View style={styles.passwordContainer}>
            <TextInput
             style={styles.input}
            placeholder='Password'
            value={password}
            secureTextEntry={!showPassword} 
            onChangeText={setPassword}
        />
          <MaterialCommunityIcons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={24} 
                    color="#aaa"
                    style={styles.icon} 
                    onPress={toggleShowPassword} 
                /> 
        </View>
       
        <Link href="" >
            <Text>Forgot Password? <Text style={styles.resetText}>Reset Password  </Text></Text>
        </Link>
        <Text>Don't have an account?
            <Link href="/auth/sign-up">
                <Text style={styles.resetText}> Sign Up</Text>
            </Link>
        </Text>

        <RoundedButton title='Sign In' onPress={onSignIn} buttonStyle={styles.button} textStyle={styles.buttonText} link="" />
        {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  )
}

export default signInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'black'
    },
    passwordContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
    }, 
     icon: {
        position: 'absolute', 
        right: 20, 
        top: 20
    },
    resetText:{
        color: Colors.green.main
    },
    button:{
        backgroundColor: Colors.green.main,
        marginTop: 20
    },
    buttonText:{
        color: 'white'
    },
    image: {
        width: 250,
        height: 115,
    }
  
})