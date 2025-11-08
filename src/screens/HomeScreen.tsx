import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { usePeople } from '../hooks/usePeople';
import { useFeedbackMutation } from '../hooks/useFeedbackMutation';
import { useUserIdentifier } from '../hooks/useUserIdentifier';
import SwipeDeck, {
  SwipeDeckHandle,
} from '../components/templates/SwipeDeck';
import IconButton from '../components/atoms/IconButton';
import AppText from '../components/atoms/AppText';
import { usePeopleStore } from '../state/peopleStore';
import { Person } from '../types/person';
import Icon from 'react-native-vector-icons/FontAwesome6';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const deckRef = useRef<SwipeDeckHandle>(null);
  const userIdentifier = useUserIdentifier();
  const { data, isLoading, isError, refetch } = usePeople(userIdentifier ?? undefined);
  const feedbackMutation = useFeedbackMutation();
  const setPeople = usePeopleStore(state => state.setPeople);
  const allPeople = usePeopleStore(state => state.people);
  const currentIndex = usePeopleStore(state => state.currentIndex);

  useEffect(() => {
    if (data?.list && allPeople.length === 0) {
      setPeople(data.list);
    }
  }, [allPeople.length, data?.list, setPeople]);

  const hasCards = currentIndex < allPeople.length;
  const isInitialLoading =
    !userIdentifier || (isLoading && !allPeople.length);

  const handleSwipe = useCallback(
    (person: Person, direction: 'left' | 'right') => {
      if (!userIdentifier) {
        return;
      }

      feedbackMutation.mutate({
        personId: String(person.id),
        direction: direction === 'left' ? 'dislike' : 'like',
        userIdentifier,
      });
    },
    [feedbackMutation, userIdentifier],
  );

  if (isInitialLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.like} />
        <AppText style={styles.loaderText}>Loading profiles…</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="fire" size={24} color={colors.like} />
        <AppText style={{ fontSize: 24, fontWeight: '700', marginLeft: spacing.sm }}>Tinder Clone</AppText>
      </View>
      {isError && (
        <View style={styles.errorBanner}>
          <AppText style={styles.errorText}>
            We couldn&apos;t refresh recommendations.
          </AppText>
          <IconButton
            name="refresh-ccw"
            size={22}
            backgroundColor="rgba(255,255,255,0.08)"
            style={styles.errorAction}
            onPress={() => refetch()}
          />
        </View>
      )}
      <View style={styles.deckContainer}>
        <SwipeDeck ref={deckRef} onSwipe={handleSwipe} />
      </View>
      <View style={styles.actions}>
        <IconButton
          name="x"
          size={28}
          color={colors.dislike}
          backgroundColor="rgba(255,255,255,0.15)"
          onPress={() => deckRef.current?.swipeLeft()}
          disabled={!hasCards}
        />
        <IconButton
          name="heart"
          size={30}
          color={colors.like}
          backgroundColor="rgba(255,255,255,0.18)"
          onPress={() => deckRef.current?.swipeRight()}
          disabled={!hasCards}
        />
      </View>
      {feedbackMutation.isError && (
        <AppText style={styles.feedbackError}>
          We couldn&apos;t save that swipe. Try again later.
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 59, 48, 0.18)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  errorAction: {
    marginHorizontal: 0,
  },
  deckContainer: {
    flex: 1,
    maxHeight: width * 1.2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  feedbackError: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
});

export default HomeScreen;

