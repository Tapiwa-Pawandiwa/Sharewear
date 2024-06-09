import Colors from '@/constants/Colors';
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'


type StepCounterProps = {
    currentStep: number;
    totalSteps: number;
}

const StepCounter:React.FC<StepCounterProps> = ({currentStep, totalSteps}) => {
    const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <View style={styles.container}>
          {steps.map((step, index) => (
        <React.Fragment key={step}>
          <View
            style={[
              styles.numberContainer,
              step <= currentStep && styles.activeNumberContainer,
            ]}
          >
            <Text
              style={[
                styles.numberStyle,
                step <= currentStep && styles.activeNumberStyle,
              ]}
            >
              {step}
            </Text>
          </View>
          {index < totalSteps - 1 && (
            <View
              style={[
                styles.line,
                step < currentStep && styles.activeLine,
              ]}
              
            />
          )}
        </React.Fragment>
         ))}
    </View>
  )
}

export default StepCounter;

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
     
    },
    numberContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'lightgrey',
        marginLeft: 10,
        borderColor: 'black',
        borderWidth: 1
    },
  numberStyle: {
    fontSize: 16,
    fontWeight: 'bold',
   
    alignContent: 'center',
    lineHeight: 30,
    textAlign: 'center'
  },
  activeNumberContainer: {
    backgroundColor: Colors.green.main,
  },
    activeNumberStyle: {
        color: 'white',
    },
  line:{
    width: 50,
    height: 3,
    backgroundColor: 'lightgrey',
  },
    activeLine: {
        backgroundColor: Colors.green.main,
    },
})