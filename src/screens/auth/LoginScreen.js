/**
 * Login screen: email + password with validation and API integration.
 */

import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { getApiErrorMessage } from '../../utils/helpers';
import {
  runValidators,
  validateEmail,
  validatePassword,
} from '../../utils/validators';

export default function LoginScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const successHint = useMemo(() => route.params?.message || '', [route.params]);

  const validateForm = () => {
    const nextErrors = {};
    const e1 = validateEmail(email);
    if (!e1.valid) nextErrors.email = e1.message;
    const e2 = validatePassword(password);
    if (!e2.valid) nextErrors.password = e2.message;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    setApiError('');
    if (!validateForm()) return;

    try {
      setLoading(true);
      await signIn(email.trim(), password);
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Unable to log in.'));
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
          <Text style={styles.title}>Log in</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to access your dashboard.
          </Text>

          {successHint ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{successHint}</Text>
            </View>
          ) : null}

          <ErrorMessage message={apiError} />

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
            <CustomInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 6 characters"
              secureTextEntry
              autoCapitalize="none"
              error={errors.password}
            />

            <CustomButton title="Log in" onPress={onSubmit} loading={loading} />

            <View style={styles.row}>
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                Forgot password?
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.muted}>New here? </Text>
              <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
                Create an account
              </Text>
            </View>
          </View>

          <Text style={styles.hint}>
            Viva tip: validation runs locally first; only valid forms call the API.
          </Text>
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
  row: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap' },
  link: { color: colors.deepTeal, fontWeight: '700' },
  muted: { color: colors.textSecondary },
  hint: { marginTop: 14, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
  successBox: {
    marginTop: 12,
    backgroundColor: '#ECFDF3',
    borderColor: colors.success,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  successText: { color: colors.darkSlate, fontSize: 14, lineHeight: 20 },
});
