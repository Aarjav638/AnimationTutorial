import {Image, Text, View} from 'react-native';
import React from 'react';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import Header from './Header';
import Stories from './Stories';

const DATA_URL = 'https://randomuser.me/api/?results=50';

export type User = {
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture: {
    thumbnail: string;
    medium: string;
    large: string;
  };
};

const FlatlistAnim = () => {
  const [data, setData] = React.useState<User[]>([]);

  const scrollY = useSharedValue(0);

  const fetchUsers = async () => {
    const response = await fetch(DATA_URL);
    const data = await response.json();
    setData(data.results);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleScrollEvent = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const rFlatListStyle = useAnimatedStyle(() => {
    const marginTopValue = interpolate(
      scrollY.value,
      [0, 150],
      [10, -100],
      Extrapolation.CLAMP,
    );
    return {
      marginTop: marginTopValue,
    };
  });

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header translateY={scrollY} />
      <Stories data={data} scrollY={scrollY} />
      <Animated.FlatList
        onScroll={handleScrollEvent}
        data={data}
        style={[rFlatListStyle]}
        keyExtractor={item => item.email}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
              marginHorizontal: 20,
            }}>
            <Image
              source={{uri: item.picture.thumbnail}}
              style={{width: 40, height: 40, borderRadius: 20}}
            />
            <View style={{marginLeft: 10}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                {item.name.first} {item.name.last}
              </Text>
              <Text style={{fontSize: 12, color: 'gray'}}>{item.email}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default FlatlistAnim;
