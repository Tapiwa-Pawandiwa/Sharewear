import Colors from '@/constants/Colors';
import React from 'react'
import { View,StyleSheet, Text, Image } from 'react-native'

const DonationCard = () => {
  return (
   <View style={styles.container}>
        <Image source={require('../../assets/images/newborn.png')} style={styles.image}/>
        <View style={styles.textContainer}>
        <Text style={styles.title}>Help Jessica with Baby Supplies</Text>
        <Text style={styles.subtitle}>Prenzlauer Berg, Berlin</Text>
      </View>
   </View>
  )
}

export default DonationCard;

const styles = StyleSheet.create({
    container: {
        width: 250,
        height: 180,
        backgroundColor: Colors.green.light,
        borderRadius: 20,
        overflow: 'hidden', // Ensures the image and text don't overflow the container
        shadowColor: '#000',
        shadowRadius: 10,
        shadowOpacity: 0.1,
      },
      image: {
        width: '100%',
        height: '50%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      textContainer: {
        padding: 10,
        height: 100,
      },
      title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      subtitle: {
        fontSize: 14,
        color: '#555',
      },
})
