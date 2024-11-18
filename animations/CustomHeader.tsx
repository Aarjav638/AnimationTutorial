import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TabItem from './TabItems'
import Animated, {  FadeInRight,  FadeOutRight } from 'react-native-reanimated'

const Data=[
    {
        icon: 'LifeBuoy' as 'LifeBuoy',
        label:'Buoy'
    },
    {
        icon: 'Fish' as 'Fish',
        label:'Settings'
    },
    
    {
        icon: 'Sailboat' as 'Sailboat',
        label:'Sail'
    },
    {
        icon: 'Ship' as 'Ship',
        label:'Ship it'
    },
    {
        icon: 'Settings' as 'Settings',
        label:'Manage it'
    },

]

const BackgroundColor= ['pink','yellow','aqua','seagreen','pink']

const CustomHeader = (
    
) => {

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    

  return (
    <View style={styles.container}>
      <TabItem 
        data={Data}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        activeBackgroundColor={'#000'}
        inactiveBackgroundColor={'#bdbdbd'}
        activeColor={'#fff'}
        inactiveColor={'#f8f8f8'}
        />
        <Animated.View
         entering={
            FadeInRight.springify().damping(80).stiffness(200)
         }
         exiting={
            FadeOutRight.springify().damping(80).stiffness(200)  
         }
        style={{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:BackgroundColor[selectedIndex],
            margin:10,
            borderRadius:10

        }}
        />
    </View>
  )
}

export default CustomHeader

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})