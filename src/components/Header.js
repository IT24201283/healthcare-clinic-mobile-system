/**
 * Simple top bar with optional back button and right action (e.g. logout).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightLabel,
  onRightPress,
}) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.row}>
        <View style={styles.left}>
          {showBack ? (
            <Pressable
              onPress={onBackPress}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backText}>‹ Back</Text>
            </Pressable>
          ) : (
            <View style={styles.backPlaceholder} />
          )}
        </View>

        <View style={styles.center}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.right}>
          {rightLabel && onRightPress ? (
            <Pressable
              onPress={onRightPress}
              style={styles.rightBtn}
              accessibilityRole="button"
            >
              <Text style={styles.rightText}>{rightLabel}</Text>
            </Pressable>
          ) : (
            <View style={styles.rightPlaceholder} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  left: {
    width: 88,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 88,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  backText: {
    color: colors.deepTeal,
    fontSize: 16,
    fontWeight: '600',
  },
  backPlaceholder: {
    height: 28,
  },
  rightBtn: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  rightText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
  rightPlaceholder: {
    height: 28,
  },
});
