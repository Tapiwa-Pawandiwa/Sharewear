import { View, Text } from 'react-native'
import React from 'react'
import RoundedButton from '@/components/RoundedButton'


const signUserOut = async () => {
  try {
    console.log('Sign out')
  } catch (e: any) {
    console.log('Sign out failed', e)
  }
}
const profile = () => {
  return (
    <View>
      <Text>profile</Text>
      <RoundedButton title="Sign Out" onPress={signUserOut} />
    </View>
  )
}

export default profile