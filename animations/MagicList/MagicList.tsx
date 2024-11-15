import {StyleSheet} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Page from './Page';

const data = ['What', 'is', 'this', 'magic', 'list', 'doing', 'here', '?'];

const MagicList = () => {
  const scrollX = useSharedValue(0);

  const handleScrollEvent = useAnimatedScrollHandler(event => {
    
    scrollX.value = event.contentOffset.x;
  
  });

  

  return (
    <Animated.ScrollView
      horizontal
      pagingEnabled
      onScroll={handleScrollEvent}
      style={{flex: 1}}
      scrollEventThrottle={16}>
      {data.map((item, i) => (
        <Page
          key={i}
          index={i}
          title={item}
          translateX={scrollX}
        />
      ))}
    </Animated.ScrollView>
  );
};

export default MagicList;

const styles = StyleSheet.create({});
