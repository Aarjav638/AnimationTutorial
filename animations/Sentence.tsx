import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const SENTENCES = [
  'You can\'t hack the driver without copying the primary ascii microchip!',
  'try to hack the pci trasnsmitter, maybe it will calculate the optical firewall!',
  'if we calculate the monitor, we can get to the xml capacitor through the solid state vga monitor!',
  'try to calculate the udp monitor, maybe it will navigate the cross-platform protocol!',
  'if we quantify the firewall, we can get to the css program through the bluetooth ascii transmitter!',
  'try to reboot the pci pixel, maybe it will program the auxiliary application!',
  'You can\'t index the sensor without synthesizeing the optical smtp array!',
  'try to synthesize the ascii transmitter, maybe it will calculate the back-end card!',
  'If we quantify the circuit,  we can get to the hdd matrix through the mobile gb array!'
];

const BACKGROUND_COLORS = ['#8c2be5', '#021e41', '#02a7ff', '#411f00','#ffa600','#103c68','#fcf2cb','#ff7064','#2d2d44'];
const TEXT_COLORS = ['#310047', '#00a7ff', '#051e3e', '#ffa80a','#412204','#fff0cf','#103d6a','#2d2b4a','#ff7063'];
const MAX_WORDS = Math.max(
  ...SENTENCES.map(sentence => sentence.split(' ').length),
);

const Sentence: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState<string[]>(SENTENCES[0].split(' '));

  const animations = Array(MAX_WORDS)
    .fill(null)
    .map(() => useSharedValue(0));
  const translateYAnim = Array(MAX_WORDS)
    .fill(null)
    .map(() => useSharedValue(30));
  const opacityAnim = useSharedValue(1);

  const backgroundColorAnim = useSharedValue(0);

  useEffect(() => {
    animateWords();
  }, [currentIndex]);

  const animateWords = () => {
    words.forEach((_, index) => {
      animations[index].value = withDelay(
        index * 100,
        withTiming(1, {duration: 500}),
      );
      translateYAnim[index].value = withDelay(
        index * 120,
        withTiming(0, {duration: 500}),
      );
    });

    const totalduration  = words.length * 500 + 1500;

    opacityAnim.value = withDelay(totalduration, withTiming(0, {duration: 500}));

    backgroundColorAnim.value = withDelay(
      totalduration + 500,
      withTiming(currentIndex + 1, {duration: 1500}, isFinished => {
        if (isFinished) {
          runOnJS(goToNextSentence)();
        }
      }),
    );
  };

  const goToNextSentence = () => {
    const nextIndex = (currentIndex + 1) % SENTENCES.length;
    if (nextIndex === 0) {
      backgroundColorAnim.value = 0;
    }
    setWords(SENTENCES[nextIndex].split(' '));
    setCurrentIndex(nextIndex);
    animations.forEach(value => (value.value = 0));
    translateYAnim.forEach(value => (value.value = 30));
    opacityAnim.value = 1;
  };

  const backgroundColorStyle = useAnimatedStyle(() => {
    const inputRange = Array.from({length: SENTENCES.length}, (_, i) => i);
    const repeatedColors = Array.from(
      {length: SENTENCES.length},
      (_, i) => BACKGROUND_COLORS[i % BACKGROUND_COLORS.length],
    );
    const interpolatedColor = interpolateColor(
      backgroundColorAnim.value,
      inputRange,
      repeatedColors,
    );

    return {
      backgroundColor: interpolatedColor,
    };
  });

  const opacityStyles = useAnimatedStyle(() => ({opacity: opacityAnim.value}));

  return (
    <Animated.View style={[styles.container, backgroundColorStyle]}>
      <Animated.View style={opacityStyles}>
        <View style={styles.sentenceContainer}>
          {Array(MAX_WORDS)
            .fill(' ')
            .map((_, index) => {
              const animatedStyle = useAnimatedStyle(() => ({
                transform: [
                  {translateY: translateYAnim[index].value},
                  {scaleY: animations[index].value},
                ],
                opacity: animations[index].value,
              }));

              return (
                <Animated.Text
                  key={`word-${index}`}
                  style={[
                    styles.word,
                    {
                    marginRight:index !== words.length  ?6: 0,
                    },
                    animatedStyle,
                    {color: TEXT_COLORS[currentIndex]},
                  ]}>
                  {words[index] || ''}
                </Animated.Text>
              );
            })}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  sentenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
  },
  word: {
    fontSize: Dimensions.get('window').width * 0.13,
    fontWeight: '900',
    textTransform:'uppercase',
    lineHeight:60,
    letterSpacing: -2,
  },
});

export default Sentence;
