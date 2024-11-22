import {View, Image, Dimensions} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  StyleProps,
} from 'react-native-reanimated';
import {User} from './FlatlistAnim';
import { memo } from 'react';


const WIDTH = Dimensions.get('window').width;

const Item = memo(({ item, rstyle }: { item: User; rstyle: StyleProps }) => {return(
  <View
        style={[
          {
            alignItems: 'center',
            rowGap: 10,
          },
        ]}>
        <View
          style={{
            backgroundColor: 'black',
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 2,
            height: 80,
            width: 80,
            borderColor: 'yellow',
            borderWidth: 2,
          }}>
          <Image
            source={{uri: item.picture.medium}}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 40,
            }}
            resizeMethod="scale"
            resizeMode="contain"
          />
        </View>
        <Animated.Text
          style={[
            {
              fontSize: 10,
              fontWeight: '600',
              width: 80,
              color: 'black',
              textAlign: 'center',
            },
            rstyle,
          ]}>
          {item.name.first} {item.name.last}
        </Animated.Text>
      </View>
)
});


const Stories = ({
  data,
  scrollY,
}: {
  data: User[];
  scrollY: SharedValue<number>;
}) => {



  const renderItem = ({item}: {item: User}) => {
    return <Item item={item} rstyle={rstyle}  />
  };

  const ruserFlatListStyle = useAnimatedStyle(() => {
    const scaleValue = 
      interpolate(scrollY.value, [-1, 0, 100], [1, 1, 0.3], Extrapolation.CLAMP)
    const widthValue = interpolate(
      scrollY.value,
      [-1,0,50, 100],
      [WIDTH,WIDTH, 270,270],
      Extrapolation.CLAMP,
    );

    const roundedValue = Math.round(scaleValue * 100) / 100;
    
    const topValue = interpolate(
      scrollY.value,
      [-1,0, 100],
      [90,90, 10],
      Extrapolation.CLAMP,
    );
    const translateXValue = interpolate(
      scrollY.value,
      [0,60 ,100],
      [0, 0,-30],
      Extrapolation.CLAMP,
    );

    return {
        
     top:Math.max(topValue,0),
      transform: [
        
        {scale: roundedValue},
        {translateX: translateXValue},
      ],
      width: Math.max(widthValue, 270),
    };
  });
  const rstyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [-1,0, 100],
      [1,1, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity: opacity,
    };
  });

  return (
    <Animated.FlatList
      style={[{
        position: 'absolute',
        left:0,
        right:0,
      },
        ruserFlatListStyle,
      ]}
      scrollEventThrottle={16}
      data={data}
      contentContainerStyle={{paddingHorizontal: 20}}
      horizontal
      keyExtractor={item => item.email}
      renderItem={renderItem}
    />
  );
};

export default Stories;
