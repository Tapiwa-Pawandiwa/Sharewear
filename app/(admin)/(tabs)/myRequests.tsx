import { StyleSheet ,Image,FlatList} from 'react-native';
import ToggleSwitch from '@/components/ToggleSwitch';
import RequestCard from '@/components/RequestCard';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

interface DataItem {
  id: string;
  description: string;
  location: string;
  items: number;
  from: string;
  image: any;
  time: string;
}

const data:DataItem[] = [
  {id: '1',description : 'Help me with my groceries', location: 'Prenzlauer-Berg', items: 5, from: 'Olly', image: require('../../../assets/images/foodboxes.jpg'), time: '23:00:10'},
  {id: '2',description : 'Help me with my wheelchair', location: 'Prenzlauer-Berg', items: 3, from: 'David', image: require('../../../assets/images/wheelchair.jpg'), time: '23:00:10'},
  {id: '3',description : 'Help me with baby supplies', location: 'Prenzlauer-Berg', items: 3, from: 'Jessica', image: require('../../../assets/images/babyImage.jpg'), time: '23:00:10'},
];

export default function TabTwoScreen() {
  const handleToggle = (state: boolean) => {
    console.log(state);
  };
 

  const renderItem = ({ item }: { item: DataItem }) => (
    <RequestCard description={item.description} location={item.location} items={item.items} from={item.from} image={item.image} time={item.time} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <View style={styles.innerContainer}>
        <Image source={require('../../../assets/images/birdbox.png')} style={styles.image} />
         <Text style={styles.title}>My Requests</Text>
      </View>
      <ToggleSwitch initialState={false} onToggle={handleToggle} style={styles.toggleSwitch}/>
      </View>
      <FlatList 
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
 
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'LeagueSpartan-Regular',
    marginLeft: 20,
  },
  image: {
    width: 60,
    height: 60,
    marginLeft: 20,
  },
  headerContainer: {
    backgroundColor: Colors.grey.background,
    height: 210,
    borderRadius: 40,
    width: '95%',
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 20,
    padding: 15,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey.background,
    borderRadius: 40,
    marginTop: 50,
    width: '95%',
    marginLeft: 10,
  
  },
  toggleSwitch: {
    marginTop: 20,
    marginLeft: 20,
  },
});
