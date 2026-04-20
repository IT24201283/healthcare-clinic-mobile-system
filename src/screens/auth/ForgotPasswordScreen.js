/**
 * Forgot password screen.
 * Calls POST /api/auth/forgot-password if your backend supports it.
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import ErrorMessage from '../../components/ErrorMessage';
import { colors } from '../../constants/colors';
import * as authService from '../../services/authService';
import { getApiErrorMessage } from '../../utils/helpers';
import { validateEmail } from '../../utils/validators';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setApiError('');
    setInfo('');

    const v = validateEmail(email);
    setErrors(v.valid ? {} : { email: v.message });
    if (!v.valid) return;

    try {
      setLoading(true);
      await authService.forgotPassword({ email: email.trim() });
      setInfo(
        'If this email exists in the system, reset instructions will be sent.'
      );
    } catch (err) {
      const msg = getApiErrorMessage(err);
      // Many student backends do not implement this route yet — keep UX friendly.
      if (err?.response?.status === 404) {
        setInfo(
          'This demo endpoint may not exist on your backend yet. Ask your examiner, or implement POST /api/auth/forgot-password in Express.'
        );
      } else {
        setApiError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Forgot password</Text>
          <Text style={styles.subtitle}>
            Enter your email. If your backend supports password reset emails, this
            screen will call your API.
          </Text>

          <ErrorMessage message={apiError} />

          {info ? (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{info}</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <CustomInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <CustomButton title="Send request" onPress={onSubmit} loading={loading} />

            <Text style={styles.back} onPress={() => navigation.navigate('Login')}>
              Back to login
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightGray },
  flex: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 28 },
  title: { fontSize: 28, fontWeight: '800', color: colors.deepTeal },
  subtitle: { marginTop: 8, fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  card: {
    marginTop: 12,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoBox: {
    marginTop: 12,
    backgroundColor: '#EFF6FF',
    borderColor: colors.info,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  infoText: { color: colors.darkSlate, fontSize: 14, lineHeight: 20 },
  back: { marginTop: 14, color: colors.deepTeal, fontWeight: '700' },
});
