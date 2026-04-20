/**
 * Change password screen: PUT /api/users/change-password
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
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import * as userService from '../../services/userService';
import { getApiErrorMessage } from '../../utils/helpers';
import {
  validateConfirmPassword,
  validatePassword,
  validateRequired,
} from '../../utils/validators';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const next = {};
    const v0 = validateRequired(currentPassword, 'Current password');
    if (!v0.valid) next.currentPassword = v0.message;
    const v1 = validatePassword(newPassword);
    if (!v1.valid) next.newPassword = v1.message;
    const v2 = validateConfirmPassword(newPassword, confirmPassword);
    if (!v2.valid) next.confirmPassword = v2.message;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    setApiError('');
    setSuccess('');
    if (!validateForm()) return;

    try {
      setLoading(true);
      await userService.changePassword({ currentPassword, newPassword });
      setSuccess('Password updated. For security, you will be logged out.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        signOut();
      }, 900);
    } catch (e) {
      setApiError(getApiErrorMessage(e, 'Unable to change password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Header title="Change password" showBack onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.subtitle}>
            Sends current + new password to PUT /api/users/change-password.
          </Text>

          <ErrorMessage message={apiError} />
          {success ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <CustomInput
              label="Current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
              error={errors.currentPassword}
            />
            <CustomInput
              label="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
              error={errors.newPassword}
            />
            <CustomInput
              label="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              error={errors.confirmPassword}
            />

            <CustomButton title="Update password" onPress={onSubmit} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightGray },
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 28 },
  subtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  successBox: {
    backgroundColor: '#ECFDF3',
    borderColor: colors.success,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  successText: { color: colors.darkSlate, fontSize: 14, lineHeight: 20 },
});
