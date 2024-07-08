import { useAuth } from '@/app/providers/Auth';
import { Redirect } from 'expo-router';
import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
  const {session, loading, profile} = useAuth();

  if(loading) {
    return <ActivityIndicator/>
  }
  if (!session) {
    return <Redirect href="/auth/sign-in" />

  }

  return (
    <SafeAreaView>
        <Text style={styles.mainName}>Hi, <Text>{profile?.first_name} </Text></Text>

    </SafeAreaView>
  )
}

export default index;
const styles = StyleSheet.create({
  mainName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20
  }
})