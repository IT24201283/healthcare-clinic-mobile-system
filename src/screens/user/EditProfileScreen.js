/**
 * Edit profile screen: PUT /api/users/profile
 */

import React, { useEffect, useState } from 'react';
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
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import * as userService from '../../services/userService';
import { getApiErrorMessage } from '../../utils/helpers';
import { validateEmail, validatePhone, validateRequired } from '../../utils/validators';

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateLocalUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('prefer_not_to_say');

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName || '');
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setAddress(user.address || '');
    setGender(user.gender || 'prefer_not_to_say');
  }, [user]);

  const validateForm = () => {
    const next = {};
    const v1 = validateRequired(fullName, 'Full name');
    if (!v1.valid) next.fullName = v1.message;
    const v2 = validateEmail(email);
    if (!v2.valid) next.email = v2.message;
    const v3 = validatePhone(phone);
    if (!v3.valid) next.phone = v3.message;
    const v4 = validateRequired(address, 'Address');
    if (!v4.valid) next.address = v4.message;
    const v5 = validateRequired(gender, 'Gender');
    if (!v5.valid) next.gender = v5.message;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSave = async () => {
    setApiError('');
    setSuccess('');
    if (!validateForm()) return;

    try {
      setLoading(true);
      const updated = await userService.updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.replace(/\s/g, ''),
        address: address.trim(),
        gender,
      });
      await updateLocalUser(updated);
      setSuccess('Profile updated successfully.');
    } catch (e) {
      setApiError(getApiErrorMessage(e, 'Unable to update profile.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Header title="Edit profile" showBack onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.subtitle}>
            These fields map to PUT /api/users/profile in your Express API.
          </Text>

          <ErrorMessage message={apiError} />
          {success ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <CustomInput label="Full name" value={fullName} onChangeText={setFullName} error={errors.fullName} />
            <CustomInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <CustomInput
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              error={errors.phone}
            />
            <CustomInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Street, city"
              multiline
              numberOfLines={3}
              error={errors.address}
            />

            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.genderRow}>
              {GENDERS.map((g) => {
                const selected = g.value === gender;
                return (
                  <Pressable
                    key={g.value}
                    onPress={() => setGender(g.value)}
                    style={[styles.chip, selected && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {g.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.gender ? <Text style={styles.genderError}>{errors.gender}</Text> : null}

            <CustomButton title="Save changes" onPress={onSave} loading={loading} />
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
  fieldLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  genderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  chipSelected: { borderColor: colors.deepTeal, backgroundColor: colors.softCyan },
  chipText: { color: colors.textSecondary, fontWeight: '700', fontSize: 12 },
  chipTextSelected: { color: colors.deepTeal },
  genderError: { color: colors.error, marginBottom: 10, fontSize: 13 },
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
