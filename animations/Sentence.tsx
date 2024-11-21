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
  'React Native makes mobile app development easy and fun.',
  'Animations bring your app to life.',
  'Let’s code and create magic!',
  'Smooth transitions make animations more polished.',
  'React Native makes mobile app development easy and fun.',
  'Animations bring your app to life.',
  'Let’s code and create magic!',
  'Smooth transitions make animations more polished.',
];

const BACKGROUND_COLORS = ['#F5B7B1', '#D5DBDB', '#F0E68C', '#AED6F1'];
const TEXT_COLORS = ['#1C2833', '#E74C3C', '#85C1AE', '#154360'];
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

    opacityAnim.value = withDelay(3000, withTiming(0, {duration: 1500}));

    backgroundColorAnim.value = withDelay(
      4000,
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
                    animatedStyle,
                    {color: TEXT_COLORS[currentIndex]},
                  ]}>
                  {words[index] || ''}
                  {
                    index !== words.length  ? " ": ''
                  }
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
    padding: 10,
  },
  word: {
    fontSize: 50,
    fontWeight: '800',
    textTransform:'uppercase',
  },
});

export default Sentence;
