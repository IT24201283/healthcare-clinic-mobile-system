/**
 * Splash / bootstrap screen.
 * Waits until AuthContext finishes reading storage, then routes to Auth or Main.
 */

import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';

export default function SplashScreen() {
  const navigation = useNavigation();
  const { bootstrapping, isAuthenticated } = useAuth();

  useEffect(() => {
    if (bootstrapping) return;
    const next = isAuthenticated ? 'Main' : 'Auth';
    navigation.replace(next);
  }, [bootstrapping, isAuthenticated, navigation]);

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <Text style={styles.title}>ClinicCare</Text>
        <Text style={styles.subtitle}>
          Appointment & Medical Record Management
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome</Text>
        <Text style={styles.cardText}>
          A calm, professional experience for patients and clinic staff.
        </Text>

        <View style={styles.loaderRow}>
          <ActivityIndicator size="large" color={colors.deepTeal} />
          <Text style={styles.loaderText}>
            {bootstrapping ? 'Preparing your session…' : 'Continuing…'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.softCyan,
    padding: 22,
    justifyContent: 'center',
  },
  hero: {
    marginBottom: 18,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.deepTeal,
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.deepTeal,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  loaderRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
