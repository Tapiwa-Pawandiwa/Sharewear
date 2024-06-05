import React from 'react'
import { View, Text,StyleSheet,Image } from 'react-native'
import RoundedButton from './RoundedButton';
import Colors from '@/constants/Colors';

interface RequestCardProps {
    description : string;
    location: string;
    items: number;
    from: string;
    image: string;
    time: string;
}


const RequestCard:React.FC<RequestCardProps> = ({description,location,items,from,image,time}) => {
  const handleManage = () => {
    console.log('Manage Request');
    }
  
    return (
  <View style={styles.container}>
    <Image source={require(image)} style={styles.image} />
    <View>
        <Text>{description}</Text>
        <Text>{location}</Text>
        <Text>{items} Items {"\n"} From: {from}</Text>
    </View>
    <View>
        <Text>{time}</Text>
        <RoundedButton title='Manage' style={styles.requestButton} onPress={handleManage}/>
    </View>
  </View>
  )
}

export default RequestCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    width: 300,
    borderRadius: 20,
  },
    image: {
        width: 60,
        height: 60,
        marginLeft: 20,
    },
    requestButton: {
        backgroundColor: Colors.red.alt,
    }
});