import React, { useEffect, useState } from 'react'
import { View, StyleSheet,Text,Pressable, ActivityIndicator,FlatList } from 'react-native';
import RoundedButton from '@/components/RoundedButton';
import Carousel from 'react-native-reanimated-carousel';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import RemoteImage from '@/components/RemoteImage';
import { useQuery } from 'react-query';
import { Tables } from '@/app/database.types';
import { useDonationRequestsWithCategory } from '@/app/hooks/useDonationRequests';
import Colors from '@/constants/Colors';
import { Image } from 'expo-image';



const Item = ({item}) => {
  return (
    <View style={styles.itemContainer}>
      <Text>{item.name}</Text>
      <Text>{item.quantity}</Text>
    </View>
  )
}


export default function donationRequest() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Retrieve the 'id' from the route parameters
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state


  const { data: donationRequests, isLoading, refetch } = useDonationRequestsWithCategory(); // Use your custom hook
  
  const donationRequest = donationRequests?.find((request) => request.donation_request_id?.toString() === id?.toString());

  
  if (!donationRequest) {
    return <Text>No donation request found.</Text>; // Handle case when no donation request is found
  }
  const renderImageItem = ({ item }: { item: string }) => {
    return (
      <RemoteImage
        path={item}
        style={styles.carouselImage}
        fallback="https://via.placeholder.com/150"
      />
    );
  };

  const toggleItemSelection = (item) => {
    setSelectedItems(prevItems => {
      if (prevItems.includes(item.id)) {
        return prevItems.filter(i => i !== item.id);
      } else {
        return [...prevItems, item.id];
      }
    });
  };


  return (
    <View style={styles.container}>
    <View style={styles.carouselContainer}>
    {donationRequest.images && (
          <Carousel<string> // Explicitly define the type as string
            data={donationRequest.images || []} // Pass the images array
            renderItem={({ item }) => (
              <Image
                source={item}
                style={styles.carouselImage}
                contentFit="cover"
                placeholder={{uri: "https://via.placeholder.com/150"}}
                cachePolicy="memory-disk"
              />
            )}           
             width={370}
            height={200}
            loop
            style={styles.carouselImage}
          />
        )}
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.headline}>{donationRequest.headline}</Text>
      <Text style={styles.formattedAddress}>{donationRequest.formatted_address}</Text>
    </View>
    <View style={styles.descriptionContainer}>
      <Text style={styles.description}>{donationRequest.description}</Text>
    </View>
    <Text style={styles.itemsNeeded}>Items Needed</Text>
    <FlatList
      data={donationRequest.items}
      renderItem={({ item }) => (
        <Pressable onPress={() => toggleItemSelection(item)}>
          <View style={[styles.item, selectedItems.includes(item.id) ? styles.selected : null]}>
            <Text>{item.name} - {item.quantity}</Text>
          </View>
        </Pressable>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
    {selectedItems.length > 0 && (
      <RoundedButton title="Commit to Donation" onPress={() => {}} />
    )}
  </View>
)
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: 'white',
  paddingHorizontal: 12,
},
carouselContainer: {
  marginTop: 20,
  width: 370,
  borderRadius: 25,
  height: 200,
  marginBottom: 20,
  justifyContent: 'center',
  alignItems: 'center',
},
carousel: {
  marginHorizontal: 12,
},
carouselImage: {
  width: 370,
  height: 200,
  alignContent: "center",
  alignSelf: "center",
  borderRadius: 25,
  marginBottom: 10,
},
textContainer: {
  marginBottom: 12,
  alignItems: 'center',
},
headline: {
  fontSize: 16,
  fontWeight: 'bold',
},
formattedAddress: {
  fontSize: 14,
  fontWeight: '300',
  marginVertical: 4,
},
descriptionContainer: {
  marginBottom: 20,
  padding: 10,
  backgroundColor: '#f0f0f0',
},
description: {
  color: 'black',
},
itemsNeeded: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 10,
},
item: {
  padding: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  marginVertical: 5,
},
selected: {
  backgroundColor: '#d3f8d3',
},
})
