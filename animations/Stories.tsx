import {View, Image, Dimensions} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {User} from './FlatlistAnim';

const WIDTH  = Dimensions.get('window').width;

const Stories = ({
  data,
  scrollY,
}: {
  data: User[];
  scrollY: SharedValue<number>;
}) => {

  const ruserFlatListStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.3],
      Extrapolation.CLAMP,
    );
    const widthValue = interpolate(
        scrollY.value,
        [0, 100],
        [WIDTH, 260],
        'clamp'
        );

    const translateYValue = interpolate(
      scrollY.value,
      [0, 100],
      [10, -70],
      Extrapolation.CLAMP,
    );
    const translateXValue = interpolate(
      scrollY.value,
      [0, 100],
      [0, 0],
      Extrapolation.CLAMP,
    );

    return {
        
      width: widthValue,
      transform: [
        {translateY: translateYValue},
        {translateX: translateXValue},
        {scale: scaleValue},
      ],
    };
  });
  const rstyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity: opacity,
    };
  });

  return (
    <Animated.FlatList
      style={[
        {
          height: 170,
        },
        ruserFlatListStyle,
      ]}
      data={data}
      contentContainerStyle={{paddingHorizontal: 20}}
      horizontal
      keyExtractor={item => item.email}
      renderItem={({item}) => (
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
      )}
    />
  );
};

export default Stories;
