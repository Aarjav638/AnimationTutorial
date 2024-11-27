import {
  ImageBackground,
  ImageSourcePropType,
  StatusBar,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import React, { useEffect, useState} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {imagesArr} from '../constants/Images';

const CaraouselCardStack = () => {
  const [activeIndex, setActiveIndex] = useState(imagesArr.length - 1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <ImageBackground
        source={imagesArr[activeIndex % imagesArr.length]}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        blurRadius={60}
      />

      {imagesArr.map((image, index) => {

        return (
          <CardStack
            key={index}
            index={index}
            setActiveIndex={setActiveIndex}
            activeIndex={activeIndex}
            image={image}
            length={imagesArr.length}
          />
        );
      })}
    </View>
  );
};

export default CaraouselCardStack;

const CardStack = ({
  image,
  index,
  setActiveIndex,
  length,
    activeIndex,
}: {
  image: ImageSourcePropType;
  index: number;
  activeIndex: number;
  length: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const lastOffset = useSharedValue({x: 0, y: 0});
    const position = useSharedValue({x: 0, y: 0});
    const value = useSharedValue(length) ;

    const panGestureHandler = Gesture.Pan()
    .runOnJS(true)
    .onUpdate(({translationX, translationY}) => {
      position.value = {
        x: translationX + lastOffset.value.x,
        y: translationY + lastOffset.value.y,
      };
    })
    .onEnd(() => {
    
      if (
        Math.abs(position.value.x) < 100 &&
        Math.abs(position.value.y) < 100
      ) {
        lastOffset.value = { x: 0, y: 0 };
        position.value = withSpring({ x: 0, y: 0 });
      } else {
        lastOffset.value = { x: 0, y: 0 };
        position.value = withTiming({
          x: position.value.x * 10,
          y: position.value.y * 10,
        });
    
        setActiveIndex(activeIndex-1
        
        );
      }
    });
    

  const rotate = useDerivedValue(() => {
    return interpolate(
      index,
      [value.value - 3, value.value - 2, value.value - 1, value.value],
      [0, 20, -20, 0],
      Extrapolation.CLAMP,
    );
  });

  const additionalTranslate = useDerivedValue(() => {
    return interpolate(
      index,
      [value.value - 3, value.value - 2, value.value - 1, value.value],
      [0, 80, -80, 0],
    Extrapolation.CLAMP,
    );
  });

  const scale = useDerivedValue(() => {
    return interpolate(
      index,
      [value.value - 3, value.value - 2, value.value - 1, value.value],
      [0.2, 0.9, 0.9, 1],
      Extrapolation.CLAMP,
    );
  });

  const rnStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {rotateZ: `${rotate.value}deg`},
        {translateX: position.value.x + additionalTranslate.value},
        {translateY: position.value.y},
        {scale: scale.value},
      ],
    };
  });



  useEffect(() => {
    value.value = withSpring(activeIndex, {
      damping: 10,
      stiffness: 100,
    });
  }, [activeIndex]);


  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={[{zIndex: activeIndex + 1}, stylesImage.animatedView, rnStyle]}>
        <Image source={image} style={stylesImage.imageStyle} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const stylesImage = StyleSheet.create({
  animatedView: {
    position: 'absolute',
    height: 350,
    width: 250,
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
});

 

  


  