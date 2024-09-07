import RoundedButton from '@/components/RoundedButton'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useAuth } from '@/app/providers/Auth'
import { Redirect, useRouter } from 'expo-router'

import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import Colors from '@/constants/Colors'

const profile = () => {
  const {session, loading, profile, signUserOut} = useAuth();
  const router = useRouter();


 const logout = () => {
    console.log('logging out...')
    try {
    signUserOut()
    router.push('/sign-in')
    } catch (error) {
      console.log('error logging out: ', error)
      
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.innerContainer}>
           <Text style={styles.nameText}>{profile?.first_name}</Text>
        </View>
      </View>
      <View style={styles.detailsContainer}>
         
        <Text style={styles.label}>My Info</Text>
        <Text >{profile?.user_type}</Text>
        <Text>Contact Details:</Text>
        <Text style={styles.subText}>{profile?.phone_number}</Text>
        <Text style={styles.subText}>{profile?.email}</Text>
      </View>
        

      <RoundedButton title="Logout" onPress={logout} buttonStyle={styles.logoutStyle}/>
    </View>
  )
}

export default profile;

const styles = StyleSheet.create({
 logoutStyle:{
  backgroundColor: Colors.green.main,
  alignSelf: 'center',
 },
 container:{
  flex: 1,
 },
 label:{
  fontSize: 20,
  fontWeight: 'bold',
  fontFamily: 'LeagueSpartan-Regular',
  alignContent: 'center',
  justifyContent: 'center',
 },
 subText:{
  fontSize: 16,
  fontFamily: 'LeagueSpartan-Light',
  alignContent: 'center',

 },
 headerContainer: {
  backgroundColor: Colors.green.light,
  height: 210,
  borderRadius: 40,
  width: '95%',
  marginTop: 20,
  marginLeft: 10,
  marginBottom: 20,
  padding: 15,

},
innerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 40,
  marginTop: 50,
  alignSelf: 'center',

},
nameText:{
  fontSize: 40,
  fontWeight: 'bold',
  fontFamily: 'LeagueSpartan-Regular',
  alignSelf: 'center',
},
detailsContainer:{
  marginLeft: 20,
  marginRight: 20,
  width: 300,
  alignSelf: 'center',
  justifyContent: 'center',
},
})