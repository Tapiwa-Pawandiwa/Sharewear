import React, { useState, useRef } from 'react';
import { View, Text, PanResponder, Animated, StyleSheet } from 'react-native';
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

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (!disabled) {
          const slideDistance = Math.min(gestureState.dx, 200); // Limit sliding to 200px
          slideAnim.setValue(slideDistance);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 150) {
          // Consider slide complete if moved more than 150px
          setSlideComplete(true);
          onSlideComplete();
        } else {
          // Reset the animation if the slide wasn't far enough
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={[styles.button, buttonStyle]}>
      <Animated.View style={[styles.buttonContent, { transform: [{ translateX: slideAnim }] }]}>
        <Ionicons name="arrow-forward-circle" size={24} color="white" style={styles.icon} />
        {!slideComplete && <Text style={[styles.buttonText, textStyle]}>{title}</Text>}
      </Animated.View>
      <Animated.View {...panResponder.panHandlers} style={[styles.overlay, { opacity: slideAnim.interpolate({
        inputRange: [0, 200],
        outputRange: [1, 0],
      }) }]}/>
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
