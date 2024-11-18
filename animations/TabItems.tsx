import {StyleSheet,View, Pressable} from 'react-native';
import React from 'react';
import {icons} from 'lucide-react-native';
import Animated, {  FadeInRight, FadeOutRight, LinearTransition } from 'react-native-reanimated';
import { MotiView } from 'moti';
type IconName = keyof typeof icons;

type tabItem = {
  icon: IconName;
  label: string;
};

type TabItemProps = {
  data: tabItem[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  activeBackgroundColor: string;
  inactiveBackgroundColor: string;
  activeColor: string;
  inactiveColor: string;
};

const TabItem = ({
  data,
  selectedIndex,
  setSelectedIndex,
  activeBackgroundColor,
  inactiveBackgroundColor,
  activeColor,
  inactiveColor,
}: TabItemProps) => {
  const Icon = ({name,color}: {name: IconName,color:string}) => {
    const IconComponent = icons[name];
    return <IconComponent size={20} color={color}/>;
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        gap:5,
        justifyContent:'flex-end',
        padding:10,
      }}>
      {data.map((item, index) => {
        const isSelected = selectedIndex === index;
        const backgroundColor = isSelected
          ? activeBackgroundColor
          : inactiveBackgroundColor;

        return (
          <MotiView
            key={index}
            animate={{ backgroundColor,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                overflow: 'hidden',
                flexDirection: 'row',
             }}
            layout={LinearTransition.springify().damping(80).stiffness(200)}
            
          >
            <Pressable
              onPress={() => setSelectedIndex(index)}
              style={{
                
                flexDirection: 'row',
                gap: 5,
              }}
            >
              <Icon name={item.icon} color={isSelected?activeColor:inactiveColor} />
              {isSelected && (
                <Animated.Text
                  entering={FadeInRight.springify().damping(80).stiffness(200)}
                  exiting={FadeOutRight.springify().damping(80).stiffness(200)}
                  style={{ color: activeColor, marginLeft: 5 }}
                >
                  {item.label}
                </Animated.Text>
              )}
            </Pressable>
          </MotiView>
        );
      })}
    </View>
  );
};

export default TabItem;

