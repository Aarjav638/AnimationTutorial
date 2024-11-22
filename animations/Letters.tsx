import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  withRepeat,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

const Letters = () => {
  const GRID_SIZE = 8;
  const LETTER_ROWS = 6;
  const LETTER_COLS = 6;
  const Word: (keyof typeof LetterGrid)[] = ['H', 'E', 'L', 'L', 'O'];

  const LetterGrid = {
    H: [
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
    ],
    E: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ],
    L: [
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ],
    O: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ],
  };

  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [highlightedGrid, setHighlightedGrid] = useState(
    Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(0)),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLetterIndex(prevIndex => {
        return prevIndex === Word.length - 1 ? 0 : prevIndex + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentLetter = Word[currentLetterIndex];
    const letterShape = LetterGrid[currentLetter];
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));
    const startRow = Math.floor((GRID_SIZE - LETTER_ROWS) / 2);
    const startCol = Math.floor((GRID_SIZE - LETTER_COLS) / 2);

    for (let i = 0; i < letterShape.length; i++) {
      for (let j = 0; j < letterShape[i].length; j++) {
        newGrid[startRow + i][startCol + j] = letterShape[i][j];
      }
    }

    setHighlightedGrid(newGrid);
  }, [currentLetterIndex]);

  return (
    <View style={styles.container}>
      {highlightedGrid.map((row, rowIndex) => (
        <View key={rowIndex} style={{flexDirection: 'row'}}>
          {row.map((cell: number, colIndex: number) => {
            const borderWidth = useSharedValue(0);

            useEffect(() => {
              borderWidth.value = withRepeat(
                withTiming(4, {duration: 1000, easing: Easing.ease}),
                -1,
                true,
              );
            }, []);

            const animatedStyle = useAnimatedStyle(() => {
              return {
                transform: [
                  {rotateX: cell ? '15deg' : '0deg'},
                  {rotateY: cell ? '10deg' : '0deg'},
                  {perspective: 1000},
                ],
                borderStartWidth: cell ? borderWidth.value : 0,
              };
            });

            return (
              <Animated.View
                key={colIndex}
                style={[
                  styles.cell,
                  {
                    backgroundColor: cell ? 'pink' : 'lightpink',
                    borderColor: 'purple',
                  },
                  animatedStyle,
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default Letters;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cell: {
    width: 20,
    height: 20,
    margin: 5,
    borderRadius: 20,
    backgroundColor: 'pink',
    shadowColor: 'puple',
  },
});
