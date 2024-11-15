import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, runOnJS, withSpring, withTiming, withDelay } from 'react-native-reanimated';

const DoubleTap = () => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withSpring(1,undefined,(isFinished) => {
       if(isFinished){
        scale.value = withDelay(500, withTiming(0));
        }});
    })
    .maxDelay(250);

  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onStart(() => {
        console.log('single tap');
        opacity.value = withTiming(0,{},(isFinished) => {
            if(isFinished){
                opacity.value = withDelay(500, withTiming(1));
            }
        }
        );
    })
    ;

    const rtstyle = useAnimatedStyle(() => {
        return {
          opacity: opacity.value,
        };
      });

  const combinedGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View >
        <ImageBackground style={styles.box} source={require('../assets/background.jpg')} >
        <View style={styles.heartContainer}>
        <Animated.Image 
          source={require('../assets/heart.png')} 
          style={[styles.heart, rStyle]} 
        />
      </View>
        </ImageBackground>
        
        <Animated.Text style={[{
            fontSize: 50,
           textAlign:'center',
        },rtstyle]}>
            🐢🐢🐢🐢🐢
        </Animated.Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default DoubleTap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heart: {
    height:'100%',
    width:'100%',
    
  },
  heartContainer: {
    width: Dimensions.get('window').width*0.5,
    height: Dimensions.get('window').width*0.5,
objectFit:'contain',
    shadowRadius: 20,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 10,
  },
  box: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});
