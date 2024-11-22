import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {icons, LucideIcon} from 'lucide-react-native';

const Height = Dimensions.get('window').height;

const DATA_URL = 'https://randomuser.me/api/?results=100';

export type User = {
  name: {
    first: string;
    last: string;
  };
  picture: {
    medium: string;
    large: string;
  };
};

const Favourites = () => {
  const [data, setData] = React.useState<User[]>([]);
  const fetchUsers = async () => {
    const response = await fetch(DATA_URL);
    const data = await response.json();
    setData(data.results);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'transparent'} translucent={true} />
      <Header scrollY={scrollY} length={data.length} />
      <Animated.ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}>
        {data.map((item, index) => (
          <ImageBackground
            key={index}
            style={{
              width: Dimensions.get('window').width / 2,
              padding: 10,
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              height: 200,
            }}
            resizeMode="cover"
            resizeMethod='resize'
            source={{uri: item.picture.large}}>
            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              {item.name.first} {item.name.last}
            </Text>
          </ImageBackground>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default Favourites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const IconComponent = ({name}: {name: keyof typeof icons}) => {
  const Icon: LucideIcon = icons[name];
  return <Icon color={'#fff'} size={24} />;
};


type HeaderProps={
    scrollY: SharedValue<number>,
    length: number
}

const Header = React.memo(({scrollY, length}: HeaderProps) => {
  const headerStyles = useAnimatedStyle(() => {
    const headerHeight = interpolate(
      scrollY.value,
      [0, 300],
      [Height / 2, Height / 5],
      Extrapolation.CLAMP,
    );
    return {
      height: headerHeight,
    };
  });

  const textStyles = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, 300],
      [60, 30],
      Extrapolation.CLAMP,
    );
    return {
      fontSize: fontSize,
    };
  });
  const rsubtxet = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, 200],
      [18, 14],
      Extrapolation.CLAMP,
    );
    return {
      fontSize: fontSize,
    };
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: '#0c1d34',
          paddingHorizontal: 20,
          paddingTop: 80,
          paddingBottom:24
        },
        headerStyles,
      ]}>
      <Animated.Text
        style={[
          {
            color: '#fff',
            fontWeight: 'bold',
          },
          textStyles,
        ]}>
        Favorites
      </Animated.Text>
      <Animated.Text
        style={[
          {
            color: '#fff',
            fontWeight: 'semibold',
          },
          rsubtxet,
        ]}>
        {length} contacts
      </Animated.Text>
      <View
        style={{
          flexDirection: 'row',
          columnGap: 10,
          paddingHorizontal: 16,
          backgroundColor: '#0c1d34',
          position: 'absolute',
          bottom: 10,
          right: 0,
          zIndex: 100,
        }}>
        <IconComponent name="Search" />
        <IconComponent name="Plus" />
        <IconComponent name="EllipsisVertical" />
      </View>
    </Animated.View>
  );
});
