import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import AppText from '../atoms/AppText';

type NavigationBarProps = {
  activeTab: 'home' | 'matches';
  onChange: (tab: 'home' | 'matches') => void;
};

const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  onChange,
}) => (
  <View style={styles.container}>
    <NavItem
      label="Discover"
      icon="fire"
      isActive={activeTab === 'home'}
      onPress={() => onChange('home')}
    />
    <NavItem
      label="Matches"
      icon="users"
      isActive={activeTab === 'matches'}
      onPress={() => onChange('matches')}
    />
  </View>
);

type NavItemProps = {
  label: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.item, isActive && styles.activeItem]}
    onPress={onPress}>
    <Icon
      name={icon}
      size={24}
      color={isActive ? colors.like : colors.textSecondary}
    />
    <AppText style={[styles.label, isActive && styles.activeLabel]}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  item: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  activeItem: {
    transform: [{ scale: 1.05 }],
  },
  label: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeLabel: {
    color: colors.like,
    fontWeight: '600',
  },
});

export default NavigationBar;

