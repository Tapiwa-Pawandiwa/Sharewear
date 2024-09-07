import React from 'react'
import { View, Text,StyleSheet,Image } from 'react-native'
import RoundedButton from '../RoundedButton';
import Colors from '@/constants/Colors';
import RemoteImage from '../RemoteImage';

interface RequestCardProps {
  headline: string;
  location: string;
  status: string;
  description: string;
  items: number;
  image: string;
  onManage: () => void; 
}

const RequestCard:React.FC<RequestCardProps> = ({ headline, location, status, description, items, image, onManage }) => {
  const handleManage = () => {
    console.log('Manage Request');
    }
  //Add max quanity for the amount of characters in the description 
    return (
      <View style={styles.container}>
      <RemoteImage style={styles.image} path={image} fallback={'https://via.placeholder.com/200'} />
      <View style={styles.heading}>
        <Text style={styles.headlineStyle}>{headline}</Text>
        <Text style={styles.locationStyle}>{location}</Text>
        <Text style={styles.statusStyle}>Status: {status}</Text>
        <Text style={styles.itemStyle}>{items} Items</Text>
      </View>
      <View style={styles.rightContainer}>
        <RoundedButton title="Manage" buttonStyle={styles.requestButton} textStyle={styles.buttonText} onPress={onManage} />
      </View>
    </View>
  )
}

export default RequestCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 140,
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
  headlineStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },statusStyle: {
    fontSize: 12,
    color: 'blue',
    marginBottom: 5,
  },
    descriptionStyle: {
        fontSize: 16,
       fontFamily: 'LeagueSpartan-Regular',
       marginBottom: 5,
     
    },
    locationStyle: {
        fontSize: 10,
        width: 140,
        marginBottom: 5,
        color: 'black',
        fontFamily: 'Now-Light',
    },
    itemStyle: {    
        fontSize: 12,
        color: 'black',
     
    },
    image: {
        width: 120,
        height: 80,
        marginLeft: 10,
        marginTop: 10,
        borderRadius: 20,
    },
    requestButton: {
        backgroundColor: Colors.red.alt,
        width: 80,
        height: 30,
        justifyContent: 'center',
        alignContent: 'center',
        marginRight: 15,

    },
    buttonText: {
        color: 'black',
        fontSize: 12,
        lineHeight: 10,
    },
    rightContainer:{
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 50,
        
    }
});