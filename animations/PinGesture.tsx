import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

const {height, width} = Dimensions.get('screen');

// Helper function to clamp values
const Clamp = (value: number, lowerBound: number, upperBound: number) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};

const PinGesture = () => {
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const scale = useSharedValue(1);
  const prevScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const prevTranslateX = useSharedValue(0);
  const prevTranslateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevTranslateX.value = translateX.value;
      prevTranslateY.value = translateY.value;
    })
    .onUpdate(e => {
      if (scale.value > 1) {
        const scaledWidth = width * scale.value;
        const scaledHeight = height * scale.value;

        const maxTranslateX = (scaledWidth - width) / 2;
        const maxTranslateY = (scaledHeight - height) / 2;

        
        translateX.value = Clamp(
          prevTranslateX.value + e.translationX,
          -maxTranslateX,
          maxTranslateX
        );
        translateY.value = Clamp(
          prevTranslateY.value + e.translationY,
          -maxTranslateY,
          maxTranslateY
        );
      } else {
        translateX.value = 0;
        translateY.value = 0;
      }
    })
    .onEnd(e => {
      if (scale.value > 1) {
        translateX.value = withDecay({velocity: e.velocityX, clamp: [-width, width]});
        translateY.value = withDecay({velocity: e.velocityY, clamp: [-height, height]});
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(e => {
      focalX.value = e.focalX;
      focalY.value = e.focalY;
      prevScale.value = scale.value;
    })
    .onChange(e => {
      scale.value = Math.max(prevScale.value * e.scale, 1);
    })
    .onEnd(() => {
      prevScale.value = scale.value;
    });

  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const rImageStyle = useAnimatedStyle(() => {
    const scaledWidth = width * scale.value;
    const scaledHeight = height * scale.value;

    const maxTranslateX = (scaledWidth - width) / 2;
    const maxTranslateY = (scaledHeight - height) / 2;

    return {
      transform: [
        {translateX: Clamp(translateX.value, -maxTranslateX, maxTranslateX)},
        {translateY: Clamp(translateY.value, -maxTranslateY, maxTranslateY)},
        {translateX: focalX.value},
        {translateY: focalY.value},
        {translateX: -width / 2},
        {translateY: -height / 2},
        {scale: scale.value},
        {translateX: -focalX.value},
        {translateY: -focalY.value},
        {translateX: width / 2},
        {translateY: height / 2},
      ],
    };
  });

  return (
    <GestureDetector gesture={combinedGesture}>
      <View>
      <StatusBar barStyle="light-content" backgroundColor={'transparent'} translucent={true} />
      <Animated.Image
        source={require('../assets/background.jpg')}
        style={[{height, width}, rImageStyle]}
        resizeMode="cover"
      />
      </View>
    </GestureDetector>
  );
};

export default PinGesture;

const styles = StyleSheet.create({});
