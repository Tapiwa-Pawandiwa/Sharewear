import React, { useState, useRef, useImperativeHandle } from 'react';
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

const SlideButton = React.forwardRef(({ title, onSlideComplete, buttonStyle, textStyle, disabled }: SlideButtonProps, ref) => {
  const [slideComplete, setSlideComplete] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    reset: () => {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: false,
      }).start(() => setSlideComplete(false));
    },
  }));

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: slideAnim } }],
    { useNativeDriver: false }
  );

  const handleGestureStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX > 150) {
        setSlideComplete(true);
        if (!disabled) {
          onSlideComplete();
        }
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
});

const styles = StyleSheet.create({
  button: {
    width: 250,
    borderRadius: 25,
    backgroundColor: Colors.green.main,
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
    alignSelf: 'center',
    textAlign: 'center',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default SlideButton;
