import { useDonationRequests } from '@/app/hooks/useDonationRequests';
import { useDonationRequestsWithCategoryAndTags } from '@/app/hooks/useDonationRequests';
import Colors from '@/constants/Colors';
import React, { useEffect } from 'react'
import { View,StyleSheet, Text, Image } from 'react-native'
import Carousel from 'react-native-reanimated-carousel';
import RemoteImage from '../RemoteImage';


const DonationCard = () => {
  const { data: donationRequests, error, isLoading } = useDonationRequests();
  const { data: donationRequestsWithCategoryAndTags, error: error2, isLoading: isLoading2 } = useDonationRequestsWithCategoryAndTags();

  console.log(donationRequests?.[0].images, 'images');

  const renderImageItem = ({ item }: { item: string }) => {
    return (
      <RemoteImage
        path={item}
        style={styles.image}
        fallback="https://via.placeholder.com/150"
      />
    );
  };

  return (
   <View style={styles.container}>
     
     <Carousel<string> // Explicitly define the type as string
      data={donationRequests?.[0].images || []} // Pass the images array
      renderItem={renderImageItem}
      width={210}
      height={100}
    />

        <View style={styles.textContainer}>
        <Text style={styles.title}></Text>
        <Text style={styles.subtitle}>Prenzlauer Berg, Berlin</Text>
      </View>
   </View>
  )
}

export default DonationCard;

const styles = StyleSheet.create({
    container: {
        width: 210,
        height: 180,
        backgroundColor: 'white',
        borderRadius: 25,
        shadowColor: 'black',
       shadowOffset: {
        width: 0,
        height: 4  // Vertical shadow offset as per your Figma spec
    },
    margin: 10,
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5, // Works only on Android
    
      },
      image: {
      width: 210,
      height: 100,
      alignContent: 'center',
      alignSelf: 'center',
        borderRadius: 25,
      },
      textContainer: {
        padding: 10,
        height: 100,
      },
      title: {
        fontSize: 14,
        fontFamily: 'LeagueSpartan-Regular',
        marginBottom: 5,
        fontWeight: 400,
        lineHeight: 18,
      },
      subtitle: {
        fontSize: 14,
        color: '#555',
        fontFamily: 'LeagueSpartan-Light',
      },
})
