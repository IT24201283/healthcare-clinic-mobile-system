/**
 * Welcome / landing screen for guests.
 * Routes to Login or Register.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../constants/colors';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.badge}>Healthcare</Text>
          <Text style={styles.title}>ClinicCare</Text>
          <Text style={styles.subtitle}>
            Manage your account securely. Other clinic modules can plug in later
            without changing this flow.
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Get started</Text>
          <Text style={styles.panelText}>
            Log in if you already have an account, or register as a patient,
            doctor, receptionist, or admin (depending on your coursework rules).
          </Text>

          <View style={styles.actions}>
            <CustomButton title="Log in" onPress={() => navigation.navigate('Login')} />
            <View style={styles.gap} />
            <CustomButton
              title="Create account"
              variant="outline"
              onPress={() => navigation.navigate('Register')}
            />
          </View>
        </View>

        <Text style={styles.footer}>University project • Authentication module</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  scroll: {
    padding: 20,
    paddingBottom: 28,
  },
  header: {
    marginTop: 10,
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.softCyan,
    color: colors.deepTeal,
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.deepTeal,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  panelText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  actions: {
    marginTop: 6,
  },
  gap: {
    height: 12,
  },
  footer: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
  },
});
