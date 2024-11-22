import React from 'react';
import MagneticCircle from './animations/MagneticCircle';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MagicList from './animations/MagicList/MagicList';
import {  Dimensions, FlatList, Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import ThemeSwitch from './animations/ThemeSwitch';
import PinGesture from './animations/PinGesture';
import DoubleTap from './animations/DoubleTap';
import Checklist from './animations/CheckList/Checklist';
import CustomHeader from './animations/CustomHeader';
import FlatlistAnim from './animations/FlatlistAnim';
import Letters from './animations/Letters';

import * as Sentry from '@sentry/react-native';
import Sentence from './animations/Sentence';
import Favourites from './animations/Favourites';
const animationData = [
  {
    name: 'Magnetic Circle',
    component: <MagneticCircle />,
    backgroundColor: '#A0B8CF',
  },
  {
    name: 'Magic List',
    component: <MagicList />,
    backgroundColor: '#E4E09C',
  },
  {
    name: 'Theme Switch',
    component: <ThemeSwitch />,
    backgroundColor: '#D0D0F0',
  },
  {
    name: 'PinGesture',
    component: <PinGesture />,
    backgroundColor: '#F0E6AA',
  },
  {
    name: 'Double Tap',
    component: <DoubleTap />,
    backgroundColor: '#D5EFEA',
  },
  {
    name: 'CheckList',
    component: <Checklist />,
    backgroundColor: '#D0EFD0',
  },
  {
    name: 'Header',
    component: <CustomHeader />,
    backgroundColor: '#EFE4C0',
  },
  {
    name: 'Flatlist Animation',
    component: <FlatlistAnim />,
    backgroundColor: '#E2E2B5', 
  },
  {
    name: 'Letters',
    component: <Letters />,
    backgroundColor: '#E8D7AD', 
  },
  {
    name: 'Sentence',
    component: <Sentence />,
    backgroundColor: '#E8C3C8',
  },
  {
    name: 'Favourites',
    component: <Favourites />,
    backgroundColor: '#E2E2E8',
  }
];





Sentry.init({
  dsn: "https://c37efd4dc68824ed1a14dd50c5bbf8c6@o4508255419236352.ingest.us.sentry.io/4508330739302400",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  // profilesSampleRate is relative to tracesSampleRate.
  // Here, we'll capture profiles for 100% of transactions.
  profilesSampleRate: 1.0,
});

const App = () => {
  const [selectedAnimation, setSelectedAnimation] = React.useState('');

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:'#f8f8f8'}}>
      <StatusBar barStyle="dark-content" backgroundColor={'#f8f8f8'}/>
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
            contentContainerStyle={{flexGrow:1,rowGap:14,width:Dimensions.get('window').width,paddingHorizontal:10}}
            keyExtractor={(item, index) => item.name + index.toString()}
            data={animationData}
            renderItem={({ item }) => (
              <TouchableOpacity style={{
                backgroundColor: item.backgroundColor,
                borderRadius: 10,
                justifyContent: 'center',
                width: '95%',
                alignItems: 'center',
                elevation:10,
                alignSelf:"center",
                shadowRadius:20,
                shadowOffset:{
                  height:40,
                  width:20
                }
              }}  onPress={
                () => setSelectedAnimation(item.name)
              }>
                <Text style={{ fontSize: 20, padding: 10 }}>{item.name}</Text>

              </TouchableOpacity>
            )}
          />
          </>
      )}
    </SafeAreaView>
  );
};

export default Sentry.wrap(App);
