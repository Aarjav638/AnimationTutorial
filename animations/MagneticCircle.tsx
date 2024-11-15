import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated,{useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated'
import { Gesture, GestureDetector} from 'react-native-gesture-handler'

const SIZE = Dimensions.get('window').width*0.9 ;
const RADIUS= SIZE/2;
const {width,height} = Dimensions.get('screen');
function clamp({val, min, max}:{
  val:number,
  min:number,
  max:number
}) {
  return Math.min(Math.max(val, min), max);
}
const MagneticCircle = () => {

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const prevTranslateX = useSharedValue(0);
  const prevTranslateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      prevTranslateX.value = translateX.value;
      prevTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      const maxTranslateX = width/2 - 50;
      const maxTranslateY = height/2 - 75;
      
      translateX.value = clamp(
       {
        val: prevTranslateX.value + e.translationX,
        min: -maxTranslateX,
        max: maxTranslateX
       }
      );
      translateY.value = clamp(
       {
        val: prevTranslateY.value + e.translationY,
        min: -maxTranslateY,
        max: maxTranslateY
       }
      );
    })
    .onEnd(() => {
      const distance = Math.sqrt(translateX.value **2 + translateY.value **2);
      if(distance < RADIUS+50){
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      }
      
    }).runOnJS(true);

    const rstyle = useAnimatedStyle(() => {
      return {
        transform: [
          {translateX: translateX.value},
          {translateY: translateY.value}
        ]
      }
    }
    )

  return (
      <View style={styles.circle}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[{width:100,height:100,backgroundColor:'lightblue',borderRadius:10},rstyle]}></Animated.View>
      </GestureDetector>
      </View>
  )
}

export default MagneticCircle

const styles = StyleSheet.create({
  circle:{
    width:SIZE,
    height:SIZE,
    borderRadius:RADIUS,
    alignSelf:'center',
    alignItems:'center',
    borderColor:'lightblue',
    borderWidth:5,
    justifyContent:'center'
  }
})