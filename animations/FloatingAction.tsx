import {
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  StyleProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {icons} from 'lucide-react-native';
import {BlurView} from '@react-native-community/blur';

const DATA = Array(100).fill('');

const WIDTH = Dimensions.get('window').width;

const ICON_COMPONENT = ({
  toogleOpened,
  opened,
}: {
  opened: SharedValue<number>;
  toogleOpened: () => void;
}) => {
  const rStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      opened.value,
      [0, 1],
      [0, 45],
      Extrapolation.CLAMP,
    );

    return {
      position: 'absolute',
      zIndex: 101,
      top: interpolate(opened.value, [0, 1], [12.5, 23], Extrapolation.CLAMP),
      right: interpolate(opened.value, [0, 1], [12.5, 18], Extrapolation.CLAMP),
      transform: [
        {
          rotate: `${rotate}deg`,
        },
      ],
    };
  });

  const Component = icons['Plus'];
  return (
    <Animated.View style={rStyle}>
      <TouchableWithoutFeedback onPress={toogleOpened}>
        <Component size={24} color="white" />
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const BACKGROOUND_COLOR = [
  '#FFC0CB',
  '#FFA07A',
  '#FFD700',
  '#FF4500',
  '#FF6347',
  '#FF69B4',
  '#FF8C00',
  '#FFA500',
  '#FFB6C1',
  '#FFDAB9',
  '#FFDEAD',
  '#FFE4B5',
  '#FFE4C4',
  '#FFE4E1',
  '#FFEBCD',
  '#FFEFD5',
  '#FFFAF0',
  '#FFFAFA',
  '#FFFF00',
  '#FFFFE0',
  '#FFFFF0',
  '#FFFFFF',
  '#F0F8FF',
  '#FAEBD7',
  '#FAF0E6',
  '#FAFAD2',
  '#FDF5E6',
  '#FF0000',
  '#FF1493',
  '#FF4500',
  '#FF6347',
  '#FF69B4',
  '#FF7F50',
  '#FF8C00',
  '#FFA07A',
  '#FFA500',
  '#FFB6C1',
  '#FFC0CB',
  '#FFD700',
  '#FFDAB9',
  '#FFDEAD',
  '#FFDAB9',
  '#FDF5E6',
  '#FF0000',
  '#FF1493',
  '#FF4500',
  '#FF6347',
  '#FF69B4',
  '#FF7F50',
  '#FF8C00',
  '#FFA07A',
  '#FFA500',
  '#FFB6C1',
  '#FFC0CB',
  '#FFD700',
  '#FFDAB9',
  '#FFDEAD',
  '#FDF5E6',
  '#FF0000',
  '#FF1493',
  '#FF4500',
  '#FF6347',
  '#FF69B4',
  '#FF7F50',
  '#FF8C00',
  '#FFA07A',
  '#FFA500',
  '#FFB6C1',
  '#FFC0CB',
  '#FFD700',
  '#FFDAB9',
  '#FDF5E6',
  '#FF0000',
  '#FF1493',
  '#FF4500',
  '#FF6347',
  '#FF69B4',
  '#FF7F50',
  '#FF8C00',
  '#FFA07A',
  '#FFA500',
  '#FFB6C1',
  '#FFC0CB',
  '#FFD700',
  '#FFDAB9',
  '#FDF5E6',
  '#FF0000',
  '#FF1493',
  '#FF4500',
  '#FF6347',
  '#FF69B4',
  '#FF7F50',
  '#FF8C00',
  '#FFA07A',
  '#FFA500',
  '#FFB6C1',
  '#FFC0CB',
  '#FFD700',
  '#FFDAB9',
  '#FFDAB9',
  '#FFDEAD',
];

const FloatingAction = () => {
  const opened = useSharedValue(0);
  const [modalOpened, setModalOpened] = React.useState(false);
  const blurOpacity = useSharedValue(0);
  const toogleOpened = () => {
    setModalOpened(!modalOpened);
    blurOpacity.value = withTiming(opened.value === 0 ? 1 : 0, {duration: 500});
    opened.value = withTiming(opened.value === 0 ? 1 : 0, {duration: 500});
    if (modalOpened && Keyboard.isVisible()) {
      Keyboard.dismiss();
    }
  };

  const blurStyle = useAnimatedStyle(() => ({
    opacity: blurOpacity.value,
  }));
  const rStyle = useAnimatedStyle(() => {
    const height = interpolate(
      opened.value,
      [0, 1],
      [50, WIDTH],
      Extrapolation.CLAMP,
    );
    const width = interpolate(
      opened.value,
      [0, 1],
      [50, WIDTH * 0.85],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      opened.value,
      [0, 1, 2],
      [0, 100, 300],
      Extrapolation.CLAMP,
    );
    const translateX = interpolate(
      opened.value,
      [0, 1],
      [WIDTH / 2 - 25, WIDTH * 0.074],
      Extrapolation.CLAMP,
    );

    return {
      height,
      width,
      transform: [
        {
          translateX,
        },
        {
          translateY: -translateY,
        },
      ],
    };
  });

  const renderItem = ({index}: {index: number}) => {
    return (
      <View
        style={{
          height: 150,
          width: Dimensions.get('window').width / 2.4,
          borderRadius: 10,
          backgroundColor: BACKGROOUND_COLOR[index],
        }}
      />
    );
  };

  const opacity = useSharedValue(0);

  useEffect(() => {
    const keboardListner = Keyboard.addListener(
      'keyboardDidShow',
      handleTranslate,
    );
    const keboardListnerHide = Keyboard.addListener(
      'keyboardDidHide',
      handleTranslateDown,
    );
    return () => {
      keboardListner.remove();
      keboardListnerHide.remove();
    };
  }, []);

  const handleTranslate = () => {
    opened.value = withDelay(200, withTiming(2, {duration: 500}));
  };
  const handleTranslateDown = () => {
    opened.value = withTiming(1, {duration: 500});
  };

  const rFloatTextStyle = useAnimatedStyle(() => {
    opacity.value = withTiming(modalOpened ? 1 : 0, {duration: 200});
    return {
      opacity: opacity.value,
    };
  });
  return (
    <KeyboardAvoidingView style={styles.container}>
      {modalOpened && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99,
            },
            blurStyle,
          ]}>
          <BlurView style={[StyleSheet.absoluteFill]} blurAmount={22} />
        </Animated.View>
      )}
      <FlatList
        data={DATA}
        numColumns={2}
        contentContainerStyle={{
          rowGap: 20,
          paddingVertical: 20,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-evenly',
          paddingHorizontal: 20,
          columnGap: 20,
        }}
        style={{marginTop: (StatusBar.currentHeight ?? 50) + 50}}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />
      <Animated.View style={[styles.flottingButton, rStyle]}>
        <ICON_COMPONENT opened={opened} toogleOpened={toogleOpened} />
        <Animated.View style={rFloatTextStyle}>
          <Animated.Text
            style={{
              color: 'white',
              fontSize: 20,
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}>
            Black Friday
          </Animated.Text>
          <Text
            style={{
              color: 'white',
              fontSize: WIDTH * 0.042,
              marginVertical: 25,
              textAlign: 'justify',
            }}>
            <Text
              style={{color: '#23879d', cursor: 'pointer'}}
              onPress={() =>
                Linking.openURL('https://www.animatereactnative.com/')
              }>
              AnimateReactNative.com
            </Text>{' '}
            is now on sale for{' '}
            <Text
              style={{
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}>
              black friday
            </Text>{' '}
            at half the price for all plans 🎉
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: WIDTH * 0.042,
              marginBottom: 25,
              textAlign: 'justify',
            }}>
            Use <Text style={{fontWeight: 'bold'}}>BF2023</Text> at checkout to
            save <Text style={{fontWeight: 'bold'}}>$99.5</Text>
          </Text>
          <TextInput
            placeholder="Paste BF2023 For 50% OFF"
            placeholderTextColor={'#bdbdbd'}
            style={{
              backgroundColor: '#2c292c',
              padding: 10,
              borderRadius: 15,
              width: '100%',
              marginBottom: 20,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#ffd701',
              padding: 15,
              borderRadius: 15,
              width: '100%',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#4e2f00',
                fontWeight: 'bold',
                fontSize: WIDTH * 0.042,
              }}>
              Use.Learn.Save Time
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default FloatingAction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flottingButton: {
    position: 'absolute',
    bottom: 20,
    padding: 20,
    backgroundColor: '#131114',
    borderRadius: 25,
    zIndex: 100,
  },
});
