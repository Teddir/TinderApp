import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import AppText from '../components/atoms/AppText';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import UserListItem from '../components/molecules/UserListItem';
import { useLikedPeople } from '../hooks/useLikedPeople';
import IconButton from '../components/atoms/IconButton';
import { useUserIdentifier } from '../hooks/useUserIdentifier';
import { useFeedbackSummary } from '../hooks/useFeedbackSummary';

const MatchesScreen: React.FC = () => {
  const userIdentifier = useUserIdentifier();
  const { data, isLoading, isError, refetch } =
    useLikedPeople(userIdentifier ?? undefined);
  const { data: summary } = useFeedbackSummary(userIdentifier ?? undefined);
  const likedPeople = data?.list ?? [];
  const likedTotal = summary?.likesCount ?? likedPeople.length;
  const passedTotal = summary?.passedCount ?? 0;
  const remainingTotal = summary?.remainingCount ?? likedPeople.length;
  const isInitialLoading = !userIdentifier || (isLoading && !likedPeople.length);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <AppText style={styles.emptyTitle}>No matches yet</AppText>
      <AppText style={styles.emptySubtitle}>
        Keep exploring profiles to start new conversations.
      </AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        <SummaryBlock label="Total Remaining" value={remainingTotal} />
        <SummaryBlock label="Total Likes" value={likedTotal} />
        <SummaryBlock label="Total Passed" value={passedTotal} />
      </View>

      {isError && (
        <View style={styles.errorBanner}>
          <AppText style={styles.errorText}>
            Could not load liked people.
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

      <AppText style={styles.sectionTitle}>Matches</AppText>
      {isInitialLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.like} />
        </View>
      ) : (
        <FlatList
          data={likedPeople}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <UserListItem person={item} />}
          contentContainerStyle={
            likedPeople.length === 0 ? styles.emptyList : undefined
          }
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

type SummaryBlockProps = {
  label: string;
  value: number;
};

const SummaryBlock: React.FC<SummaryBlockProps> = ({ label, value }) => (
  <View style={styles.summaryBlock}>
    <AppText style={styles.summaryValue}>{value}</AppText>
    <AppText style={styles.summaryLabel}>{label}</AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  summaryBlock: {
    flex: 1,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: 18,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryLabel: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtitle: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loader: {
    paddingVertical: spacing.xl,
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
});

export default MatchesScreen;

