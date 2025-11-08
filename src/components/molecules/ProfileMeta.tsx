import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../atoms/AppText';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { Person } from '../../types/person';

type ProfileMetaProps = {
  person: Person;
};

const ProfileMeta: React.FC<ProfileMetaProps> = ({ person }) => (
  <View style={styles.container}>
    <AppText style={styles.name}>
      {person.name}, {person.age}
    </AppText>
    <AppText style={styles.location}>{person.location}</AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  name: {
    fontSize: 28,
    fontWeight: '600',
  },
  location: {
    marginTop: spacing.xs,
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default ProfileMeta;

