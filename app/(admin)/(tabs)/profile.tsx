import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import RoundedButton from '@/components/RoundedButton'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/app/providers/Auth'
import Colors from '@/constants/Colors'



const profile = () => {
  const {profile, signUserOut} = useAuth();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
        </View>
 
      </View>
 
      <Text style={styles.name}>{profile?.first_name}</Text>
      <Text style={styles.type}>{profile?.user_type}</Text>
      <View style={styles.detailsContainer}>
        <Text>My Info</Text>
  
        <Text>Contact Details:</Text>
        <Text>+27874567865</Text>
      </View>
      
      <RoundedButton title="Sign Out" onPress={signUserOut} buttonStyle={styles.logoutButton} textStyle={styles.logoutText}  />
    </View>
  )
}

export default profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  avatarContainer: {
    alignItems: 'center',
    backgroundColor: Colors.green.light,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 20,
    height: 200,
  },
  type:{
    alignSelf: "center",
    fontSize: 18,
    fontFamily: "LeagueSpartan-Regular",

  },
  avatar: {
    width: 150,
    height: 150,
    marginTop: 120,
    borderRadius: 73,
    backgroundColor: 'grey',
    shadowColor: Colors.green.main,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name:{
    fontSize: 24,
    fontFamily: "LeagueSpartan-Bold",
    marginBottom: 20,
    alignSelf: "center",
    marginTop: 80,
  },
  detailsContainer:{
    marginLeft: 20,
    marginRight: 20,
    width: 300,
    alignSelf: 'center',
  },

  logoutText:{
    fontSize: 16,
    fontFamily: "LeagueSpartan-Regular",
    alignSelf: "center",
    color: "#ffff",
  },
  logoutButton:{
    backgroundColor: Colors.theme.tertiary,
    width: 150,
    alignSelf: "center",
    marginTop: 20,
  }

})