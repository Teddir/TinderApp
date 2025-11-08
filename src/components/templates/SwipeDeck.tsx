import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
} from 'react-native';
import colors from '../../theme/colors';
import TinderCard from '../organisms/TinderCard';
import { Person } from '../../types/person';
import { usePeopleStore } from '../../state/peopleStore';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.28;

export type SwipeDeckHandle = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

type SwipeDeckProps = {
  onSwipe?: (person: Person, direction: 'left' | 'right') => void;
};

const SwipeDeck = forwardRef<SwipeDeckHandle, SwipeDeckProps>(
  ({ onSwipe }, ref) => {
    const people = usePeopleStore(state => state.people);
    const currentIndex = usePeopleStore(state => state.currentIndex);
    const recordSwipe = usePeopleStore(state => state.recordSwipe);
    const position = useRef(new Animated.ValueXY()).current;
    const isAnimating = useRef(false);

    const currentPerson = people[currentIndex];
    const nextPerson = people[currentIndex + 1];

    const resetCardPosition = useCallback(() => {
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
        bounciness: 10,
      }).start(() => {
        isAnimating.current = false;
      });
    }, [position]);

    const advanceCard = useCallback(
      (person: Person | undefined, direction: 'left' | 'right') => {
        if (!person) {
          isAnimating.current = false;
          return;
        }

        recordSwipe(person, direction);
        if (onSwipe) {
          onSwipe(person, direction);
        }
        position.setValue({ x: 0, y: 0 });
        isAnimating.current = false;
      },
      [onSwipe, position, recordSwipe],
    );

    const animateOffScreen = useCallback(
      (direction: 'left' | 'right', gesture?: PanResponderGestureState) => {
        if (!currentPerson || isAnimating.current) {
          return;
        }
        isAnimating.current = true;
        Animated.timing(position, {
          toValue: {
            x: direction === 'right' ? screenWidth * 1.4 : -screenWidth * 1.4,
            y: gesture?.dy ?? 0,
          },
          duration: 220,
          useNativeDriver: true,
        }).start(() => {
          advanceCard(currentPerson, direction);
        });
      },
      [advanceCard, currentPerson, position],
    );

    useImperativeHandle(
      ref,
      () => ({
        swipeLeft: () => animateOffScreen('left'),
        swipeRight: () => animateOffScreen('right'),
      }),
      [animateOffScreen],
    );

    const panResponder = useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: (_event, gestureState) =>
            Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4,
          onPanResponderMove: Animated.event(
            [null, { dx: position.x, dy: position.y }],
            { useNativeDriver: false },
          ),
          onPanResponderRelease: (_event, gestureState) => {
            const { dx } = gestureState;
            if (Math.abs(dx) > SWIPE_THRESHOLD) {
              const direction = dx > 0 ? 'right' : 'left';
              animateOffScreen(direction, gestureState);
            } else {
              resetCardPosition();
            }
          },
          onPanResponderTerminate: resetCardPosition,
        }),
      [animateOffScreen, position.x, position.y, resetCardPosition],
    );

    useEffect(() => {
      position.setValue({ x: 0, y: 0 });
      isAnimating.current = false;
    }, [currentPerson, position]);

    const rotate = position.x.interpolate({
      inputRange: [-screenWidth, 0, screenWidth],
      outputRange: ['-12deg', '0deg', '12deg'],
      extrapolate: 'clamp',
    });

    const animatedCardStyle = {
      transform: [
        ...position.getTranslateTransform(),
        {
          rotate,
        },
      ],
    };

    return (
      <View style={styles.container}>
        {nextPerson && (
          <TinderCard
            person={nextPerson}
            animatedStyle={[styles.nextCard, { transform: [{ scale: 0.95 }] }]}
            testID="next-card"
          />
        )}
        {currentPerson ? (
          <TinderCard
            person={currentPerson}
            animatedStyle={animatedCardStyle}
            panHandlers={panResponder.panHandlers}
            isTopCard
            testID="current-card"
          />
        ) : (
          <View style={styles.placeholder}>
            <Animated.Text style={styles.placeholderText}>
              You are all caught up!
            </Animated.Text>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nextCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  placeholder: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '500',
  },
});

export default SwipeDeck;

