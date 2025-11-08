import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  ImageBackground,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  Pressable,
  Easing,
} from 'react-native';
import { PanResponderInstance } from 'react-native';
import colors from '../../theme/colors';
import ProfileMeta from '../molecules/ProfileMeta';
import { Person } from '../../types/person';

type TinderCardProps = {
  person: Person;
  animatedStyle?: StyleProp<ViewStyle>;
  panHandlers?: PanResponderInstance['panHandlers'];
  isTopCard?: boolean;
  testID?: string;
};

const AUTO_ADVANCE_DURATION = 4000;

const TinderCard: React.FC<TinderCardProps> = ({
  person,
  animatedStyle,
  panHandlers,
  isTopCard = false,
  testID,
}) => {
  const pictures = useMemo(
    () => (person.pictures && person.pictures.length ? person.pictures : ['']),
    [person.pictures],
  );
  const [pictureIndex, setPictureIndex] = useState(0);
  const [segmentWidth, setSegmentWidth] = useState(0);
  const progressValuesRef = useRef<Animated.Value[]>([]);
  if (progressValuesRef.current.length !== pictures.length) {
    progressValuesRef.current = pictures.map(
      (_, index) => progressValuesRef.current[index] ?? new Animated.Value(0),
    );
  }
  const progressValues = progressValuesRef.current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearScheduledAdvance = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    setPictureIndex(0);
    progressValues.forEach(value => value.setValue(0));
    clearScheduledAdvance();
  }, [person.id, progressValues, clearScheduledAdvance]);

  const startProgressForIndex = useCallback(
    (index: number) => {
      progressValues.forEach((value, idx) => {
        value.stopAnimation();
        if (idx < index) {
          value.setValue(1);
        } else if (idx === index) {
          value.setValue(0);
        } else {
          value.setValue(0);
        }
      });

      const activeValue = progressValues[index];
      if (activeValue) {
        Animated.timing(activeValue, {
          toValue: 1,
          duration: AUTO_ADVANCE_DURATION,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      }
    },
    [progressValues],
  );

  useEffect(() => {
    if (!isTopCard || pictures.length <= 1) {
      clearScheduledAdvance();
      progressValues.forEach(value => {
        value.stopAnimation();
        value.setValue(0);
      });
      return;
    }

    startProgressForIndex(pictureIndex);

    clearScheduledAdvance();
    timeoutRef.current = setTimeout(() => {
      setPictureIndex(current =>
        current >= pictures.length - 1 ? 0 : current + 1,
      );
    }, AUTO_ADVANCE_DURATION);

    return () => {
      progressValues[pictureIndex]?.stopAnimation();
    };
  }, [
    clearScheduledAdvance,
    isTopCard,
    pictureIndex,
    pictures.length,
    progressValues,
    startProgressForIndex,
  ]);

  useEffect(
    () => () => {
      clearScheduledAdvance();
      progressValues.forEach(value => value.stopAnimation());
    },
    [clearScheduledAdvance, progressValues],
  );

  const currentImage = pictures[pictureIndex] ?? pictures[0];
  const progressFillStyles = useMemo(
    () =>
      pictures.map((_, index) => ({
        width:
          segmentWidth === 0
            ? 0
            : progressValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0, segmentWidth],
              }),
        opacity:
          index < pictureIndex
            ? 1
            : index === pictureIndex
            ? 0.95
            : 0.2,
      })),
    [pictures, progressValues, segmentWidth, pictureIndex],
  );

  return (
    <Animated.View
      style={[styles.card, animatedStyle]}
      {...(isTopCard && panHandlers ? panHandlers : {})}
      testID={testID}>
      <ImageBackground
        source={{ uri: currentImage }}
        style={styles.image}
        imageStyle={styles.imageBorder}>
        <View style={styles.overlay} />
        {pictures.length > 1 && (
          <View style={styles.progressContainer}>
            {pictures.map((_, index) => (
              <View
                key={`${person.id}-${index}`}
                style={styles.progressSegment}
                onLayout={
                  segmentWidth === 0
                    ? event =>
                        setSegmentWidth(event.nativeEvent.layout.width)
                    : undefined
                }>
                <Animated.View
                  style={[styles.progressFill, progressFillStyles[index]]}
                />
              </View>
            ))}
          </View>
        )}
        {isTopCard && pictures.length > 1 && (
          <View style={styles.imageNavigator}>
            {pictures.map((_, index) => (
              <Pressable
                key={`${person.id}-tap-${index}`}
                style={styles.tapZone}
                onPress={() => setPictureIndex(index)}
                testID={`image-zone-${index}`}
                onLongPress={() => setPictureIndex(index)}
              />
            ))}
          </View>
        )}
        <View style={styles.metaContainer}>
          <ProfileMeta person={person} />
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
    borderRadius: 16,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageBorder: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    borderRadius: 16,
  },
  progressContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
  },
  imageNavigator: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  tapZone: {
    flex: 1,
  },
  metaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default TinderCard;

