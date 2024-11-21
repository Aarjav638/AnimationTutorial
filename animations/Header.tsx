import {icons} from 'lucide-react-native';
import React, { memo } from 'react';
import {View} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
const IconComponent = () => {
  const Component = icons['Settings'];
  return <Component size={20} color={'black'} />;
};

const HomeIconComponent = () => {
  const Component = icons['House'];
  return <Component size={20} color={'black'} />;
};

const Header =  memo(({translateY}: {translateY: SharedValue<number>}) => {
  const rstyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      translateY.value,
      [-1,0, 100],
      [0,0, 20],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{translateX: translateX}],
    };
  });

  return (
    <View
      style={{
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        flexDirection: 'row',
      }}>
      <HomeIconComponent />
      <Animated.Text
        style={[
          {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'black',
          },
          rstyle,
        ]}>
        Chat
      </Animated.Text>
      <IconComponent />
    </View>
  );
})
export default Header;
