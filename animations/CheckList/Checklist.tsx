import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Page from './Page';

const DATA = ['coffee', 'bread', 'cheese', 'learning by doing', 'procrastinate'];

const Checklist = () => {



  return(
    <View style={styles.container}>
      {DATA.map((item, index) => {
        return (
          <Page key={index} index={index} text={item}  />
        );
      })}
    </View>
  )
};

export default Checklist;

const styles = StyleSheet.create({
  container:{
    flex:1,
    rowGap:10,
    justifyContent:'center',
    paddingHorizontal:20,
  }
});
