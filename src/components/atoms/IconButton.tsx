import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

type IconButtonProps = {
  name: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  onPress: () => void;
  disabled?: boolean;
};

const IconButton: React.FC<IconButtonProps> = ({
  name,
  size = 24,
  color = colors.textPrimary,
  backgroundColor = colors.surface,
  style,
  onPress,
  disabled,
}) => (
  <TouchableOpacity
    style={[
      styles.container,
      { backgroundColor },
      disabled ? styles.disabled : null,
      style,
    ]}
    onPress={onPress}
    disabled={disabled}>
    <Icon name={name} size={size} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    marginHorizontal: spacing.sm,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default IconButton;

