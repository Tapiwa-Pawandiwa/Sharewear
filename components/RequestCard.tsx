import React from 'react'
import { View, Text,StyleSheet,Image } from 'react-native'
import RoundedButton from './RoundedButton';
import Colors from '@/constants/Colors';

interface RequestCardProps {
    description : string;
    location: string;
    items: number;
    from: string;
    image: any;
    time: string;
}

const RequestCard:React.FC<RequestCardProps> = ({description,location,items,from,image,time}) => {
  const handleManage = () => {
    console.log('Manage Request');
    }
  //Add max quanity for the amount of characters in the description 
    return (
  <View style={styles.container}>
    <Image source={image} style={styles.image} />
    <View style={styles.heading}>
        <Text style={styles.descriptionStyle}>{description}</Text>
        <Text style={styles.locationStyle}>{location}</Text>
        <Text style={styles.itemStyle}>{items} Items {"\n"}From: {from}</Text>
    </View>
    <View style={styles.rightContainer}>
        <Text>{time}</Text>
        <RoundedButton title='Manage' buttonStyle={styles.requestButton} textStyle={styles.buttonText} onPress={handleManage}/>
    </View>
  </View>
  )
}

export default RequestCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 110,
    padding: 5,
    flexDirection: 'row',
    width: '92%',
    marginBottom: 15,
    backgroundColor: Colors.grey.card,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  heading:{
    marginTop: 15,
    marginLeft: 10,
    maxWidth: 150
  },
    descriptionStyle: {
        fontSize: 16,
       fontFamily: 'LeagueSpartan-Regular',
       marginBottom: 5,
     
    },
    locationStyle: {
        fontSize: 14,
        color: 'black',
        fontFamily: 'LeagueSpartan-Light',
    },
    itemStyle: {    
        fontSize: 12,
        color: 'black',
     
    },
    image: {
        width: 120,
        height: 80,
        marginLeft: 0,
        marginTop: 10,
        borderRadius: 20,
    },
    requestButton: {
        backgroundColor: Colors.red.alt,
        width: 80,
        height: 30,
        justifyContent: 'center',
        alignContent: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 10,
        lineHeight: 10,
    },
    rightContainer:{
        alignItems: 'center',
        alignSelf: 'center',
    }
});