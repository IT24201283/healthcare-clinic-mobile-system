/**
 * Centered loading indicator for full-screen or section loading states.
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

export default function LoadingSpinner({ message }) {
  return (
    <View style={styles.container} accessibilityLabel="Loading">
      <ActivityIndicator size="large" color={colors.deepTeal} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    marginTop: 12,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
