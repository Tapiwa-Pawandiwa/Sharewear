import Colors from '@/constants/Colors';
import React,{useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Touchable} from 'react-native'

interface ToggleSwitchProps {
    initialState?: boolean;
    onToggle?: (state: boolean) => void;
    style?: object;
}

const ToggleSwitch:React.FC<ToggleSwitchProps> = ({initialState=false, onToggle, style}) => {
    const [isCompleted, setIsCompleted] = useState(initialState);

    const handleToggle = (newState: boolean) => {
        setIsCompleted(newState);
        if(onToggle){
            onToggle(newState);
        }
    }

  return (
   <View style={[styles.container,style]}>
        <TouchableOpacity 
                style={[styles.button, !isCompleted && styles.activeButton]}
                onPress={() => handleToggle(false)}
        >
        <Text style={[styles.text, !isCompleted && styles.activeText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
                style={[styles.button, isCompleted && styles.activeButton]}
                onPress={() => handleToggle(true)}
        >
        <Text style={[styles.text, isCompleted && styles.activeText]}>Completed</Text>
        </TouchableOpacity>
    </View>
  )
}

export default ToggleSwitch;

const styles = StyleSheet.create({
 container:{
    flexDirection: 'row',
    borderRadius: 39,
    overflow: 'hidden',
    borderWidth: 1,
    width: 300,
    height: 50,
    borderColor: '#ccc',
 },
 button:{
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 4,
    marginLeft: 5,
   
 },
 activeButton:{
    backgroundColor: Colors.green.main,
 },
 text:{
    color: Colors.grey.dark,
 },
    activeText:{
        color: '#fff',
 }
})