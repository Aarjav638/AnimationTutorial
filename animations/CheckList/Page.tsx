import {  Text, View } from 'react-native'
import React from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

const Page = ({
    text,
    index,
}:{
    text:string,
    index:number,
}) => {

    const width = useSharedValue(5);

    const scale = useSharedValue(0);

    const translateX = useSharedValue(0);

    const opacity = useSharedValue(0);

    const textSpring = useSharedValue(0);

    const [checkedList, setCheckedList] = React.useState<{index:number}[]>(
        []
    );

    const [COLOR, setCOLOR] = React.useState('purple');

    const [textWidth, setTextWidth] = React.useState<number>(0);
    const onTextLayout = (e: any) => {
        const { width } = e.nativeEvent.layout;
        setTextWidth(width); 
      };


        const style = useAnimatedStyle(() => {
            
            return {
              transform: [{ translateX: translateX.value }],
              width: width.value,
            };
          });

          const handleOnpress = () => {
            if (checkedList.some((item) => item.index === index)) {
              setCheckedList((prev) => prev.filter((item) => item.index !== index));
              width.value = withSpring(10);
              translateX.value = withSpring(0);
              opacity.value = withSpring(0);
              setCOLOR('purple');
            } else {
              setCheckedList((prev) => [...prev, { index }]);
              width.value = withSpring(textWidth + 10);
              textSpring.value = withSpring(10);
              translateX.value = withSpring(40, {
                duration: 500,
              }, (isFinished) => {
                if (isFinished) {
                    textSpring.value = withSpring(0,{
                        duration:600
                    });
                }
              });
        
              setCOLOR('grey');
              
                opacity.value = withSpring(1);
                scale.value = withSpring(1,undefined,(isFinished) => {
                    if(isFinished){
                        scale.value = 0;
                    }
                }
                );


          };
        }

        const textSpringStyle = useAnimatedStyle(() => {
            return {
                transform:[{translateX:textSpring.value}],
            }
        }
        )

        const tickStyle= useAnimatedStyle(() => {
            return {
                opacity:opacity.value,
            }
        }
        )

        const rBoredrStyle = useAnimatedStyle(() => {
            return {
                transform:[{scale:scale.value}]
            }
        }
        )
  return (
    <View style={{
        flexDirection:'row',
        gap:20,
        marginVertical:10,
        alignItems:'center',
    }}>
        <Animated.View style={[{
            height:40,
            width:40,
            borderRadius:20,
            borderWidth:4,
            left:-5,
            borderColor:COLOR,
            borderStyle:'dotted',
            justifyContent:'center',
            alignItems:'center',
            position:'absolute',
        },rBoredrStyle]} />
        <Animated.Image style={[{
            height:30,
            width:30,
            resizeMode:'contain',
            left:0,
                position:'absolute',
                
            },tickStyle]} source={require('../../assets/tick.png')} />
        
            <Animated.View style={[{
                paddingVertical:2,
                backgroundColor:COLOR,
                borderColor:COLOR,
                position:'absolute',
                top:0.1,
                paddingHorizontal:10,
                
            },style]} />
                   
      <Animated.Text onLayout={onTextLayout}
      onPress={handleOnpress}
       style={[{
        position:'absolute',
        left:40,
            fontSize:20,
            color:COLOR,
            textTransform:'capitalize',
            fontWeight:'bold',
      },textSpringStyle]}>{text}</Animated.Text>
    </View>
  )

}

export default Page;
