import {Image, Text, View} from 'react-native';
import React, { memo } from 'react';
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


const Item= memo(({item}: {item: User}) => {
  return (
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
              <Text style={{fontSize: 16, fontWeight: 'bold',color:'black'}}>
                {item.name.first} {item.name.last}
              </Text>
              <Text style={{fontSize: 12, color: 'gray'}}>{item.email}</Text>
            </View>
          </View>
  )
}
)

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
    const TopValue = interpolate(
      scrollY.value,
      [-1,0, 200],
      [200,200, 100],
      Extrapolation.CLAMP,
    );
      return {
        top: Math.max(TopValue, 100), 
      };
    
  });


  const renderItem = ({item}: {item: User}) => {
    return <Item item={item} />
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header translateY={scrollY} />
      <Stories data={data} scrollY={scrollY} />
      <Animated.FlatList
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
        onScroll={handleScrollEvent}
        data={data}
        scrollEventThrottle={16}
        style={[{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,

        },rFlatListStyle]}
        keyExtractor={item => item.email}
        renderItem={renderItem}
      />
    </View>
  );
};

export default FlatlistAnim;
