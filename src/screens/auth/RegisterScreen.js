/**
 * Register screen: collects profile basics + role, validates, then calls the API.
 */

import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { ROLE_OPTIONS } from '../../constants/roles';
import { getApiErrorMessage } from '../../utils/helpers';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  validateRole,
} from '../../utils/validators';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('patient');

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleChips = useMemo(() => ROLE_OPTIONS, []);

  const validateForm = () => {
    const nextErrors = {};

    const vName = validateRequired(fullName, 'Full name');
    if (!vName.valid) nextErrors.fullName = vName.message;

    const vEmail = validateEmail(email);
    if (!vEmail.valid) nextErrors.email = vEmail.message;

    const vPass = validatePassword(password);
    if (!vPass.valid) nextErrors.password = vPass.message;

    const vConfirm = validateConfirmPassword(password, confirmPassword);
    if (!vConfirm.valid) nextErrors.confirmPassword = vConfirm.message;

    const vPhone = validatePhone(phone);
    if (!vPhone.valid) nextErrors.phone = vPhone.message;

    const vRole = validateRole(role);
    if (!vRole.valid) nextErrors.role = vRole.message;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    setApiError('');
    if (!validateForm()) return;

    try {
      setLoading(true);
      const result = await signUp({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.replace(/\s/g, ''),
        role,
      });

      if (!result.autoLoggedIn) {
        navigation.navigate('Login', {
          message: 'Account created. You can log in now.',
        });
      }
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Unable to register.'));
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
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            All fields are required. Your backend should store the role you pick.
          </Text>

          <ErrorMessage message={apiError} />

          <View style={styles.card}>
            <CustomInput
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Aisha Khan"
              error={errors.fullName}
            />
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
            <CustomInput
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter password"
              secureTextEntry
              autoCapitalize="none"
              error={errors.confirmPassword}
            />
            <CustomInput
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g. 03001234567"
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <Text style={styles.fieldLabel}>Role</Text>
            <View style={styles.roleRow}>
              {roleChips.map((item) => {
                const selected = item.value === role;
                return (
                  <Pressable
                    key={item.value}
                    onPress={() => setRole(item.value)}
                    style={[styles.roleChip, selected && styles.roleChipSelected]}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.roleText, selected && styles.roleTextSelected]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.role ? <Text style={styles.roleError}>{errors.role}</Text> : null}

            <CustomButton title="Register" onPress={onSubmit} loading={loading} />

            <View style={styles.row}>
              <Text style={styles.muted}>Already have an account? </Text>
              <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Log in
              </Text>
            </View>
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
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  roleChip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  roleChipSelected: {
    borderColor: colors.deepTeal,
    backgroundColor: colors.softCyan,
  },
  roleText: { color: colors.textSecondary, fontWeight: '600', fontSize: 13 },
  roleTextSelected: { color: colors.deepTeal },
  roleError: { marginTop: 8, color: colors.error, fontSize: 13 },
  row: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap' },
  link: { color: colors.deepTeal, fontWeight: '700' },
  muted: { color: colors.textSecondary },
});
