import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Person } from '../../types/person';
import AppText from '../atoms/AppText';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

type UserListItemProps = {
  person: Person;
};

const UserListItem: React.FC<UserListItemProps> = ({ person }) => (
  <View style={styles.container}>
    {person.pictures.length > 0 && person.pictures[0]?.trim() !== '' ? (
      <View style={styles.avatarContainer}>
        <Image source={{ uri: person.pictures[0] }} style={styles.avatar} />
      </View>
    ) : (
      <View style={styles.avatarContainer}>
        <AppText style={styles.name}>(No pictures)</AppText>
      </View>
    )}
    <View style={styles.details}>
      <AppText style={styles.name}>
        {person.name}, {person.age}
      </AppText>
      <AppText style={styles.location}>{person.location}</AppText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  details: {
    marginLeft: spacing.md,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  location: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default UserListItem;

