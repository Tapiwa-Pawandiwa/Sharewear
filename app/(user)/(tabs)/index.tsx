import { useAuth } from '@/app/providers/Auth';
import CategoryChip from '@/components/user/CategoryChip';
import CategoryList from '@/components/user/CategoryList';
import DonationCard from '@/components/user/DonationCard';
import DonationList from '@/components/user/DonationList';
import Colors from '@/constants/Colors';
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
    console.log(profile, 'profile')
    console.log(session, 'session')
    return <Redirect href="/(auth)/sign-in" />

  }

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.mainName}>Hi, <Text style={styles.name}>{profile?.first_name} </Text></Text>
      <Text style={styles.label}>Latest Near you...</Text>
       <DonationList/>
       <CategoryList/>
    </SafeAreaView>
  )
}

export default index;
const styles = StyleSheet.create({
  container:{
    backgroundColor: 'white',
    flex: 1
  },
  mainName: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 20
  }, 
  name:{
    color: Colors.theme.primary
  },
  label:{
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 20
  }
})