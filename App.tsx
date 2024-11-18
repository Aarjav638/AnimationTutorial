import React from 'react';
import MagneticCircle from './animations/MagneticCircle';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MagicList from './animations/MagicList/MagicList';
import { Button, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import ThemeSwitch from './animations/ThemeSwitch';
import PinGesture from './animations/PinGesture';
import DoubleTap from './animations/DoubleTap';
import Checklist from './animations/CheckList/Checklist';
import CustomHeader from './animations/CustomHeader';
// import Letters from './animations/Letters';

const animationData = [
  {
    name: 'Magnetic Circle',
    component: <MagneticCircle />,
  },
  {
    name: 'Magic List',
    component: <MagicList />,
  },
  {
    name:'Theme Switch',
    component:<ThemeSwitch/>
  },
  {
    name: 'PinGesture',
    component: <PinGesture />,
  },
  {
    name: 'Double Tap',
    component: <DoubleTap />,
  },
  {
    name:'CheckList',
    component:<Checklist/>
  },
  // {
  //   name: 'Letters',
  //   component: <Letters/>
  // },
  {
    name:'Header',
    component:<CustomHeader/>
  }
  
];

const App = () => {
  const [selectedAnimation, setSelectedAnimation] = React.useState('');

  return (
    <View style={{ flex: 1}}>
      {selectedAnimation ? (
        <GestureHandlerRootView
          style={{ flex: 1,width:Dimensions.get('window').width,   justifyContent: 'center'}}
        >
          {
            animationData.find(item => item.name === selectedAnimation)
              ?.component
          }
          <TouchableOpacity style={{
            position: 'absolute',
            top: 20,
            left: 10,
            zIndex: 100,
          }}
            onPress={() => setSelectedAnimation('')}
          >
            <Image
              source={require('./assets/back.png')}
              style={{ width: 20, height: 20, alignSelf: 'center' }}
              tintColor={"rgba(256,0,256,0.6)"}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </GestureHandlerRootView>
      ) : (
        <>
        <Text style={{ fontSize: 30, marginVertical: 20,color:'#000',textAlign:'center' }}>Choose Animations</Text>
          <FlatList
          style={{
            flex:1,
            marginBottom:20
          }}
            contentContainerStyle={{flexGrow:1,rowGap:10,width:Dimensions.get('window').width,paddingHorizontal:10}}
            keyExtractor={(item, index) => item.name + index.toString()}
            data={animationData}
            renderItem={({ item }) => (
              <TouchableOpacity style={{
                backgroundColor: 'lightblue',
                borderRadius: 10,
                justifyContent: 'center',
                width: '100%',
                alignItems: 'center',
              }}  onPress={
                () => setSelectedAnimation(item.name)
              }>
                <Text style={{ fontSize: 20, padding: 10 }}>{item.name}</Text>

              </TouchableOpacity>
            )}
          />
          </>
      )}
    </View>
  );
};

export default App;
