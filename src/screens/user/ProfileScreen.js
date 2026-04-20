/**
 * Profile screen: shows the logged-in user's profile from the API.
 */

import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import ErrorMessage from '../../components/ErrorMessage';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { formatRoleLabel, getApiErrorMessage } from '../../utils/helpers';

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '—'}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, refreshProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      await refreshProfile();
    } catch (e) {
      setError(getApiErrorMessage(e, 'Unable to load profile.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshProfile]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Header title="Profile" showBack onBackPress={() => navigation.goBack()} />
        <LoadingSpinner message="Loading profile…" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Header title="Profile" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.deepTeal}
          />
        }
      >
        <ErrorMessage message={error} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <Row label="Full name" value={user?.fullName} />
          <Row label="Email" value={user?.email} />
          <Row label="Phone" value={user?.phone} />
          <Row label="Role" value={formatRoleLabel(user?.role)} />
          <Row label="Address" value={user?.address} />
          <Row label="Gender" value={user?.gender} />
        </View>

        <View style={styles.actions}>
          <CustomButton title="Edit profile" onPress={() => navigation.navigate('EditProfile')} />
          <View style={styles.gap} />
          <CustomButton
            title="Change password"
            variant="outline"
            onPress={() => navigation.navigate('ChangePassword')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightGray },
  scroll: { padding: 16, paddingBottom: 28 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 10 },
  row: { paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  rowLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '700' },
  rowValue: { marginTop: 4, fontSize: 15, color: colors.textPrimary, fontWeight: '600' },
  actions: { marginTop: 14 },
  gap: { height: 12 },
});
