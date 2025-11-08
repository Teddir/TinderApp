import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../components/atoms/AppText';
import colors from '../theme/colors';
import Icon from 'react-native-vector-icons/FontAwesome6';

const SplashScreen: React.FC = () => (
  <View style={styles.container}>
    <Icon name="fire" size={32} color={colors.like} />  
    <AppText style={styles.logo}>Tinder Clone</AppText>
    <AppText style={styles.subtitle}>Find your next match</AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 12,
    color: colors.textSecondary,
  },
});

export default SplashScreen;

