import {  Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated, {  interpolateColor, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { Switch } from 'react-native-gesture-handler';

const COLORS = {
    dark:{
        background:'#1e1e1e',
        text:'#f8f8f8',
        circle:'#252525'
    },
    light:{
        background:'#f8f8f8',
        text:'#000',
        circle:'#fff'
    }

    
}
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const SIZE = WIDTH*0.8;

const SWITCH_TRACK_COLOR = {
    true:'rgba(256,0,256,0.2)',
    false:'rgba(0,0,0,0.1)'
}

const ThemeSwitch = () => {

    const [isDark, setIsDark] = React.useState(false);


    const toggleSwitch = () => {
        
        setIsDark(prev => !prev);
    }

    const themeAnim= useDerivedValue(()=>{
        return isDark ? 1 : 0;
    });

    const themeStyle = useAnimatedStyle(() => {

        const themeColor = interpolateColor(
            themeAnim.value,
            [0,1],
            [COLORS.light.background, COLORS.dark.background]
        )

        return {
            backgroundColor: themeColor
            
        }
    })
    const circleStyle = useAnimatedStyle(() => {
        const themeColor = interpolateColor(
            themeAnim.value,
            [0,1],
            [COLORS.light.circle, COLORS.dark.circle],
            
        )

        return {
            backgroundColor: themeColor
        }
    }
    )
    const textStyle = useAnimatedStyle(() => {
        const themeColor = interpolateColor(
            themeAnim.value,
            [0,1],
            [COLORS.light.text, COLORS.dark.text],
            
        )

        return {
            color: themeColor
        }
    }
    )

  return (
    <Animated.View style={[
        styles.container,
        themeStyle
    ]}>
      <Animated.Text
      style={[
        {
            fontSize:70,
            fontWeight:'bold',
            textTransform:'uppercase',
            letterSpacing:15,
            position:'absolute',
            top:HEIGHT*0.1,
        },
        textStyle
      ]}
      >Theme</Animated.Text>
        <Animated.View style={[
           { width:SIZE,
            height:SIZE,
            borderRadius:SIZE/2,
            justifyContent:'center',
            elevation:5,
            shadowOpacity:0.5,
            shadowRadius:20,
            shadowOffset:{
                width:0,
                height:20
            },
            shadowColor:isDark ?  'purple':'black' ,
            alignItems:'center'},circleStyle]}>
            <Switch
                trackColor={SWITCH_TRACK_COLOR}
                value={isDark}
                thumbColor={isDark ? 'purple' : 'black'}
                style={{
                    
                    transform:[{scaleX:2},{scaleY:2}]
                }}
                onValueChange={toggleSwitch}
            />
            
            </Animated.View>
    </Animated.View>
  )
}

export default ThemeSwitch

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width:WIDTH
    }
})