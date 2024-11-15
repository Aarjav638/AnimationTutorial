import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated, { useAnimatedStyle, interpolate, Extrapolation, SharedValue } from 'react-native-reanimated';

const WIDTH = Dimensions.get('window').width; 
const HEIGHT = Dimensions.get('window').height;
const SIZE = WIDTH * 0.7;
const Page = ({
    translateX,
    index,
    title
}:{
    translateX: SharedValue<number>,
    index: number,
    title: string
}) => {
    
  const inputRange = [(index-1)*WIDTH,index*WIDTH,(index+1)*WIDTH];
    const rCStyle = useAnimatedStyle(() => {
        const radiusAnimValue = interpolate(
          translateX.value,
          inputRange,
          [0, WIDTH / 2, 0],
          Extrapolation.CLAMP
        );
        const scale = interpolate(translateX.value, inputRange, [0,1,0],Extrapolation.CLAMP);
        return {
          borderRadius: radiusAnimValue,
            transform: [{scale}],
        };
      });
    
      const rTStyle = useAnimatedStyle(() => {
        const scaleAnimValue = interpolate(translateX.value,inputRange, [
         -2,
          5,
          2,
        ],
        Extrapolation.CLAMP
    );
        
        const opacity = interpolate(translateX.value, inputRange, [-2, 1, -2],Extrapolation.CLAMP);
        const translateY = interpolate(translateX.value, inputRange, [HEIGHT/2, 0, -HEIGHT/2],Extrapolation.CLAMP);
        return {
            opacity,
          transform: [{scale: scaleAnimValue},{
                translateY: translateY
          }],
          
        };
        
      });
  return (
    <View style={{
        ...styles.container,
        backgroundColor:`rgba(0,0,256,0.${index+2})`
    }}>
        <Animated.View style={[{
            width:SIZE,
            height:SIZE,
            backgroundColor: 'rgba(0,0,256,0.4)',
        },rCStyle]}/>
        <Animated.Text style={[{
            fontWeight:'bold',
            position:'absolute',
            color:'white',
            textTransform:'uppercase'
        },rTStyle]}>{title}</Animated.Text>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    }
})