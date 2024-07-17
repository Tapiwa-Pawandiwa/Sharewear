import RoundedButton from '@/components/RoundedButton'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useAuth } from '@/app/providers/Auth'
import { Redirect } from 'expo-router'

import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import Colors from '@/constants/Colors'

const profile = () => {
  const {session, loading, profile} = useAuth();


 const logout = () => {
    console.log('logging out...')
    async function signOut() {
      const { error } = await supabase.auth.signOut()
    }
    signOut()
  }


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.innerContainer}>
           <Text style={styles.nameText}>{profile?.first_name}</Text>
        </View>
        
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
})