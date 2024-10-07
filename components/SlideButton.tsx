import React, { useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface SlideButtonProps {
  title: string;
  onSlideComplete: () => void;
  buttonStyle?: object;
  textStyle?: object;
  disabled?: boolean;
}

const SlideButton: React.FC<SlideButtonProps> = ({ title, onSlideComplete, buttonStyle, textStyle, disabled }) => {
  const [slideComplete, setSlideComplete] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: slideAnim } }],
    { useNativeDriver: false }
  );

  const handleGestureStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX > 150) {
        setSlideComplete(true);
       {disabled ? undefined : onSlideComplete()} 
      } else {
        // Reset the animation if the slide wasn't far enough
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    }
  };


  return (
    <View style={[styles.button, buttonStyle]}>
       <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleGestureStateChange}
        enabled={!disabled}
      >
 <Animated.View style={[styles.buttonContent, { transform: [{ translateX: slideAnim }] }]}>
          <Ionicons name="arrow-forward-circle" size={24} color="white" style={styles.icon} />
          {!slideComplete && <Text style={[styles.buttonText, textStyle]}>{title}</Text>}
        </Animated.View>
      </PanGestureHandler>
     
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 250,
    borderRadius: 25,
    backgroundColor: Colors.theme.primary,
    overflow: 'hidden',
    marginVertical: 20,
    height: 50,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default SlideButton;
