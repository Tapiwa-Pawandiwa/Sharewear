import { StyleSheet ,Image,FlatList} from 'react-native';
import ToggleSwitch from '@/components/ToggleSwitch';
import RequestCard from '@/components/admin/RequestCard';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/providers/Auth';
import { useEffect, useState } from 'react';
import { useDonationRequestsWithCategoryAndTags } from '@/app/hooks/useDonationRequests';
import Carousel from 'react-native-reanimated-carousel';
import RemoteImage from '@/components/RemoteImage';
import FilterChipList from '@/components/FilterChipList';

interface DataItem {
  id: string;
  headline: string;
  formatted_address: string;
  items: number;
  from: string;
  image: string;
  time: string;
}


interface DonationRequest {
  id: string;
  headline: string;
  description: string;
  status: string;
  latitude: number;
  longitude: number;
  formatted_address: string;
  main_location: string;
  secondary_location: string;
  images: string[];  // Array of image URLs
  category_id?: string;  // Assuming category_id might be optional
  category_name?: string;  // Optional if using with category data
  tag_names?: string[];  // Optional if using with tags data
  item_names?: string[];  // Optional if using with item data
}




export default function TabTwoScreen() {
  const { data: donationRequestsWithCategoryAndTags, error, isLoading } = useDonationRequestsWithCategoryAndTags();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const {profile} = useAuth();




  const handleToggle = (state: boolean) => {
    console.log(state);
  };

 
  const fetchMyRequests = async () => {
    const { data: donationRequest, error:donationRequestError } = await supabase
    .from('donationRequest').select('*').eq('beneficiary_ID', profile?.id);
  }





  const renderItem = ({ item }: { item: DataItem }) => (
    <RequestCard
      description={item.headline}
      location={item.formatted_address}
      items={item.items}
      from={item.from}
      image={item.image}
      time={item.time}
    />
  );
  const transformedData: DataItem[] = donationRequestsWithCategoryAndTags?.map(request => ({
    id: request.id,
    headline: request.headline,
    formatted_address: request.formatted_address,
    items: request.item_names?.length || 0,  // count of items
    image: request.images?.[0] || 'https://via.placeholder.com/200',  // Pass image URL to RequestCard
    from: '', // Add the 'from' property here
    time: new Date().toLocaleTimeString(),  // or use a proper timestamp if available
  })) || [];
  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <View style={styles.innerContainer}>
         <Text style={styles.title}>My Requests</Text>
         <Image source={require('../../../assets/images/birdbox.png')} style={styles.image} />
      </View>
      <View style={styles.filterContainer}>
           <FilterChipList  />
      </View>
      </View>
     
   <View style={styles.results}>
        <FlatList
        data={transformedData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
   </View>
  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    marginLeft: 10,
    fontFamily: 'Now-Bold',
  },
  image: {
    width: 50,
    height: 50,
    marginLeft: 80,
      marginTop: -20,
    

  },
  headerContainer: {
    height: 140,
    borderRadius: 40,
    width: '95%',
    marginTop: 35,
    marginLeft: 10,
   
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 40,
    marginTop: 50,
    width: '95%',
    marginLeft: 10,
    marginBottom: 20,
  
  },
  filterContainer:{
    marginBottom: 10,
    alignItems: 'center',
  },
  results:{
    marginTop: 25,
  }

});
