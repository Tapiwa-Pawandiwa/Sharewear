import { StyleSheet ,Image,FlatList} from 'react-native';
import ToggleSwitch from '@/components/ToggleSwitch';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function TabTwoScreen() {
  const handleToggle = (state: boolean) => {
    console.log(state);
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <View style={styles.innerContainer}>
        <Image source={require('../../assets/images/birdbox.png')} style={styles.image} />
         <Text style={styles.title}>My Requests</Text>
      </View>
      <ToggleSwitch initialState={false} onToggle={handleToggle} style={styles.toggleSwitch}/>
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
    backgroundColor: Colors.green.light,
    height: 250,
    borderRadius: 40,
    width: '95%',
    marginTop: 10,
    marginLeft: 10,
    padding: 15,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.green.light,
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
