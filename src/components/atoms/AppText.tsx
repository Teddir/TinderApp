import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

const AppText: React.FC<TextProps> = ({ style, children, ...rest }) => (
  <Text style={[styles.text, style]} {...rest}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  text: {
    color: colors.textPrimary,
    fontFamily: 'System',
  },
});

export default AppText;

