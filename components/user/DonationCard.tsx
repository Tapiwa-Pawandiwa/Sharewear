import Colors from '@/constants/Colors';
import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import RoundedButton from '../RoundedButton';
import {Image} from 'expo-image'
import {Tables} from '@/app/database.types';
import CountdownTimer from '../CountDownTimer';


type DonationWithDetails  = Tables<'donation_with_details'>;

interface DonationCardProps {
    donation: DonationWithDetails;
  }

const DonationCard: React.FC<DonationCardProps> = ({ donation }) => {
    const { donation_request_headline, donation_request_address, images,timer_start_time } = donation;



  return (
    <View style={styles.container}>
        {images && images.length > 0 ? (
        <Image 
        source={{ uri: images[0] }} 
        style={styles.donationImage}
        cachePolicy="memory-disk"
 placeholder={{uri: "https://via.placeholder.com/150"}}

         />
      ) : (
        <Image source={{uri: 'https://via.placeholder.com/150'}} style={styles.donationImage} />
      )}
         <View style={styles.donationRequest}>
        <Text style={styles.headlineText}>{donation_request_headline || 'Donation Request'}</Text>
        <Text style={styles.addressText}>{donation_request_address || 'Address not available'}</Text>
      </View>
      <View style={styles.timeContainer}>
        <Image style={styles.timeImage} source={require('@/assets/icons/time.png')} />
        <Text style={styles.timeText}>
       
        </Text>
        {timer_start_time ? (
          <CountdownTimer createdTime={timer_start_time} />
        ) : (
          <Text style={styles.timeText}>No timer</Text>
        )}
        <RoundedButton title="Abort Donation" buttonStyle={styles.abort} textStyle={styles.buttonText} />
      </View>
    </View>
  )
}


export default DonationCard;


const styles = StyleSheet.create({
     container:{
        backgroundColor: Colors.grey.background,
        borderRadius: 35,
        width: 375,
        height: 140,
        marginBottom: 10,
        padding: 10,
        flexDirection: 'row',
     },
        donationImage:{
            width: 80,
            height: 100,
            borderRadius: 30,
            margin: 10
        },
        timeContainer:{
            alignItems: 'center',
            margin: 10
        },
        timeImage:{
            width: 30,
            height: 30,
            marginRight: 5
        },

        timeText:{
            color: Colors.grey.dark,
            fontSize: 16,
        },
        addressText:{
            color: Colors.grey.light,
            width: 110,
            fontSize: 12,
        },
        headlineText:{
            color: Colors.grey.dark,
            fontSize: 14,
        },
        donationRequest:{
            margin: 10,
            width: 100,
        },
        abort:{
            backgroundColor: Colors.red.hard,
            width: 120,
            height: 35,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10
        },
        buttonText:{
            color: 'white',
            fontSize: 12,
            fontFamily: 'Helvetica',


        }

})


