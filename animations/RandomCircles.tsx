import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { persons } from '../constants/Images';

const Screen_Width = Dimensions.get('window').width;
const Screen_Height = Dimensions.get('window').height;

const RandomCircles = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const circlePositions = Array.from({ length: 3 }, () => ({
    x: useSharedValue(Math.random() * (Screen_Width - 200)),
    y: useSharedValue(Math.random() * (Screen_Height - 400)),
    scale: useSharedValue(Math.max(Math.random(), 0.6) * 2),
    borderWidth: useSharedValue(Math.max(4, Math.random() * 10)),
  }));

  const scrollX = useSharedValue(0);

  useEffect(() => {
    circlePositions.forEach((circle) => {
      circle.x.value = withSpring(Math.random() * (Screen_Width - 200));
      circle.y.value = withSpring(Math.random() * (Screen_Height - 400));
      circle.scale.value = withSpring(Math.max(Math.random(), 0.6) * 2);
      circle.borderWidth.value = withSpring(Math.max(4, Math.random() * 10));
    });
  }, [activeIndex]);

  const ScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x; 
      const index = Math.round(event.contentOffset.x / Screen_Width);
      runOnJS(setActiveIndex)(index);
    },
  });

  return (
    <View style={styles.container}>
      {circlePositions.map((circle, i) => {
        const rStyle = useAnimatedStyle(() => ({
          transform: [
            { translateX: circle.x.value },
            { translateY: circle.y.value },
            { scale: circle.scale.value },
          ],
          borderWidth: circle.borderWidth.value,
        }));

        return (
          <Animated.View
            key={i}
            style={[styles.circle, rStyle]}
          />
        );
      })}

      <View style={styles.imageContainer}>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          onScroll={ScrollHandler}
          scrollEventThrottle={16}
        >
          {persons.map((item, index) => {
            const rStyle = useAnimatedStyle(() => {
              const opacityValue = interpolate(
                scrollX.value,
                [
                  (index - 1) * Screen_Width, 
                  index * Screen_Width, 
                  (index + 1) * Screen_Width, 
                ],
                [0, 1, 0], 
                Extrapolation.CLAMP
              );
              return {
                opacity: opacityValue,
              };
            });

            return (
              <Animated.Image
                key={index}
                style={[styles.image, rStyle]}
                source={item.image}
              />
            );
          })}
        </Animated.ScrollView>
      </View>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, activeIndex === 0 && styles.activeTitle]}>
          {persons[activeIndex]?.title}
        </Text>
      </View>

      <View style={styles.paginationContainer}>
        {persons.map((_, index) => {
          const rStyle = useAnimatedStyle(() => {
            const widthValue = interpolate(
              scrollX.value,
              [
                (index - 1) * Screen_Width,
                index * Screen_Width,
                (index + 1) * Screen_Width,
              ],
              [12, 20, 12], 
              Extrapolation.CLAMP
            );

            const opacityValue = interpolate(
              scrollX.value,
              [
                (index - 1) * Screen_Width,
                index * Screen_Width,
                (index + 1) * Screen_Width,
              ],
              [0.2, 1, 0.2], 
              Extrapolation.CLAMP
            );

            return {
              width: widthValue,
              opacity: opacityValue,
            };
          });

          return <Animated.View key={index} style={[styles.paginationDot, rStyle]} />;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    position: 'absolute',
    top: 0,
    borderRadius: 100,
    borderColor: 'black',
  },
  imageContainer: {
    height: Screen_Width,
    width: Screen_Width,
  },
  image: {
    width: Screen_Width,
    height: Screen_Width,
    resizeMode: 'contain',
  },
  titleContainer: {
    paddingStart: 20,
    marginTop: 20,
    width:'70%'
  },
  title: {
    fontSize: 28,
    color: 'black',
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  activeTitle: {
    fontSize: 35,
  },
  paginationContainer: {
    flexDirection: 'row',
    width: '60%',
    paddingHorizontal: 20,
    columnGap: 4,
    position: 'absolute',
    bottom: Dimensions.get('window').height * 0.1,
    alignItems: 'center',
    height: 50,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'black',
  },
});

export default RandomCircles;
