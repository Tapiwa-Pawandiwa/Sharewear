import Colors from '@/constants/Colors';
import React, { useEffect } from 'react'
import {View,Text,StyleSheet} from 'react-native'
import RoundedButton from '../RoundedButton';
import {Image} from 'expo-image'
import {Tables} from '@/app/database.types';
import CountdownTimer from '../CountDownTimer';


type DonationWithDetails  = Tables<'donation_with_details'>;

interface DonationCardProps {
    donation: DonationWithDetails;
    type?: 'donor' | 'requester';
    onManage?: () => void;


  }

const DonationCard: React.FC<DonationCardProps> = ({ donation ,type,onManage }) => {

  return (
    <View style={styles.container}>
        {donation.images && donation.images.length > 0 ? (
        <Image 
        source={{ uri: donation.images[0] }} 
        style={styles.donationImage}
        cachePolicy="memory-disk"
 placeholder={{uri: "https://via.placeholder.com/150"}}
         />
      ) : (
        <Image source={{uri: 'https://via.placeholder.com/150'}} style={styles.donationImage} />
      )}
         <View style={styles.donationRequest}>
        <Text style={styles.headlineText}>{donation.donation_request_headline || 'Donation Request'}</Text>
        <Text style={styles.addressText}>{donation.donation_request_address || 'Address not available'}</Text>
      </View>
      <View style={styles.timeContainer}>
        <Image style={styles.timeImage} source={require('@/assets/icons/time.png')} contentFit='contain' />
        {donation.timer_start_time ? (
          <CountdownTimer createdTime={donation.timer_start_time}  donationId={donation.donation_id}/>
        ) : (
          <Text style={styles.timeText}>No timer</Text>
        )}
         {
           type==='donor' && donation.donation_status === 'PENDING' &&  (
              <RoundedButton title="Cancel" buttonStyle={styles.button} textStyle={styles.buttonText} />
            )
        } 
        {
             type==='requester' &&  (
              <RoundedButton title="Manage" buttonStyle={styles.manageButton} textStyle={styles.manageText} onPress={onManage} />
            )
        }
          
      </View>
      
    </View>
  )
}


export default DonationCard;


const styles = StyleSheet.create({
     container:{
        backgroundColor: Colors.grey.background,
        borderRadius: 35,
        width: "92%",
        height: 125,
        alignSelf: "center",
        justifyContent: "space-between", // Ensures space distribution between children
        alignItems: 'center', // Align items in the center of the cross-axis
        marginBottom: 10,
        padding: 10,
        flexDirection: 'row',
     },
        donationImage:{
            width: 100,
            height: 80,
            borderRadius: 30,
            
        },
        timeContainer:{
            alignItems: 'center',
            margin: 10,
            justifyContent: 'space-evenly', // Distributes space evenly

        },
        timeImage:{
            width: 45,
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
            maxWidth: 120,
        },
        headlineText:{
            color: Colors.grey.dark,
            fontSize: 14,
            marginBottom: 5,
            maxWidth: 120,
        },
        donationRequest:{
          flex: 1, // Take available space

            margin: 10,
            width: 100,
        },
        button:{
            backgroundColor: Colors.red.hard,
            alignContent: 'center',
            width: 90,
            height: 30,
            marginTop: 20,
            borderRadius: 20,
            marginLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
           
        },
        buttonText:{
            color: 'white',
            fontSize: 11,
            fontFamily: 'Helvetica',
            alignSelf: 'center',
            justifyContent: 'center',
        },
        manageButton:{
            backgroundColor: Colors.beige.main,
            width: 80,
            marginTop: 20,
            borderRadius: 20,
            marginLeft: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        
        manageText:{
            color: 'black',
            fontSize: 11,
            fontFamily: 'Helvetica',
            alignSelf: 'center',
            justifyContent: 'center',
        }

})


