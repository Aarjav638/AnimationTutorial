import {
  Dimensions,
  Image,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  View,
} from 'react-native';
const {width} = Dimensions.get('window');

import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import data, {locationImage} from '../constants/data';
import {icons} from 'lucide-react-native';
import Animated, {
  Extrapolation,
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import React, {useState} from 'react';

const IconComponent = ({
  name,
  iconStyle,
  size,
}: {
  name: keyof typeof icons;
  iconStyle?: StyleProp<any>;
  size: number;
}) => {
  const Icon = icons[name];
  return <Icon style={iconStyle} size={size} />;
};

const duration = 600;
const _size = width * 0.9;
const layout = {
  borderRadius: 16,
  width: _size,
  height: _size * 1.27,
  spacing: 12,
  cardsGap: 22,
};
const maxVisibleItems = 6;

const colors = {
  primary: '#6667AB',
  light: '#fff',
  dark: '#111',
};

const menu = ['Home', 'About', 'Contact', 'Settings', 'Logout'];

function Card({
  info,
  index,
  totalLength,
  activeIndex,
}: {
  totalLength: number;
  index: number;
  info: (typeof data)[0];
  activeIndex: SharedValue<number>;
}) {
  const rstyles = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      zIndex: totalLength - index,
      opacity: interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [1 - 1 / maxVisibleItems, 1, 1],
      ),
      shadowOpacity: interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [0, 0, 1],
        {
          extrapolateRight: Extrapolation.CLAMP,
        },
      ),
      transform: [
        {
          translateY: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [-layout.cardsGap, 0, layout.height - layout.cardsGap],
          ),
        },
        {
          scale: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [0.96, 1, 1],
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.card, rstyles]}>
      <Text
        style={[
          styles.title,
          {
            position: 'absolute',
            top: -layout.spacing,
            right: layout.spacing,
            fontSize: 102,
            color: colors.primary,
            opacity: 0.05,
          },
        ]}>
        {index}
      </Text>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{info.type}</Text>
        <View style={styles.row}>
          <IconComponent name="Clock" size={16} iconStyle={styles.icon} />
          <Text style={styles.subtitle}>
            {info.from} - {info.to}
          </Text>
        </View>
        <View style={styles.row}>
          <IconComponent name="MapPin" size={16} iconStyle={styles.icon} />
          <Text style={styles.subtitle}>{info.distance} km</Text>
        </View>
        <View style={styles.row}>
          <IconComponent name="Briefcase" size={16} iconStyle={styles.icon} />
          <Text style={styles.subtitle}>{info.role}</Text>
        </View>
      </View>
      <Image source={{uri: locationImage}} style={styles.locationImage} />
    </Animated.View>
  );
}

const Menu = ({
    visible,
    setMenuVisible,
    activeIndex,
    setActiveIndex,
  }: {
    visible: boolean;
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
    setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const flingRight = Gesture.Fling()
      .direction(Directions.RIGHT)
      .onStart(() => {
        if (!visible) return;
        runOnJS(setMenuVisible)(false);
      });
  
    const tapOutside = Gesture.Tap().onStart(() => {
      if (!visible) return;
      runOnJS(setMenuVisible)(false);
    });
  
    return (
      <GestureDetector gesture={flingRight}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 100,
            width: width,
            height: Dimensions.get('window').height,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        >
          <GestureDetector gesture={tapOutside}>
            <View style={{ flex: 1 }} />
          </GestureDetector>
          <Animated.View
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300).delay(500)}
            style={{
              padding: layout.cardsGap * 2,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              rowGap: layout.spacing,
            }}
          >
            {menu.map((item, index) => (
              <Animated.Text
                key={index.toString() + item}
                entering={FadeInRight.duration(300).delay(index * 100)}
                exiting={FadeOutRight.duration(300).delay((menu.length - index) * 100)}
                style={{
                  color: '#fff',
                  fontSize: 30,
                  zIndex: 110,
                  fontWeight: 'bold',
                }}
                onPress={() => {
                  console.log(`Selected index: ${index}`);
                  setActiveIndex(index);
                  setMenuVisible(false);
                }}
              >
                {index === activeIndex ? '👉 ' : ''}
                {item}
              </Animated.Text>
            ))}
          </Animated.View>
        </View>
      </GestureDetector>
    );
  };
  
export default function App() {
  const activeIndex = useSharedValue(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuItemIndex, setMenuItemIndex] = useState(0);
  const flingUp = Gesture.Fling()
    .direction(Directions.UP)
    .onStart(() => {
      if (activeIndex.value === 0) {
        return;
      }
      activeIndex.value = withTiming(Math.max(activeIndex.value - 1, 0), {
        duration,
      });
    });
  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      if (activeIndex.value === data.length - 1) {
        return;
      }
      activeIndex.value = withTiming(
        Math.min(activeIndex.value + 1, data.length - 1),
        {
          duration,
        },
      );
    });

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      if (menuVisible) {
        return;
      }
        runOnJS(setMenuVisible)(true);
    });

  const combined = Gesture.Exclusive(flingUp, flingDown, flingLeft);

  return (
    <View style={styles.container}>
      {
        menuVisible && <Menu visible={menuVisible} setMenuVisible={setMenuVisible} activeIndex={menuItemIndex} setActiveIndex={setMenuItemIndex} />
      }
      <GestureDetector gesture={combined}>
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: layout.cardsGap * 2,
          }}
          pointerEvents="box-none">
          {data.map((c, index) => {
            return (
              <Card
                info={c}
                key={c.id}
                activeIndex={activeIndex}
                index={index}
                totalLength={data.length - 1}
              />
            );
          })}
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.primary,
    padding: layout.spacing,
  },
  card: {
    borderRadius: layout.borderRadius,
    width: layout.width,
    height: layout.height,
    padding: layout.spacing,
    backgroundColor: colors.light,
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 20,
  },
  title: {fontSize: 32, fontWeight: '600'},
  subtitle: {},
  cardContent: {
    gap: layout.spacing,
    marginBottom: layout.spacing,
  },
  locationImage: {
    flex: 1,
    borderRadius: layout.borderRadius - layout.spacing / 2,
  },
  row: {
    flexDirection: 'row',
    columnGap: layout.spacing / 2,
    alignItems: 'center',
  },
  icon: {
    color: colors.primary,
  },
});
