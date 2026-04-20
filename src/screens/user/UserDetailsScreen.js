/**
 * Admin: view a single user from GET /api/users/:id
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { isAdmin } from '../../constants/roles';
import * as userService from '../../services/userService';
import { formatRoleLabel, getApiErrorMessage } from '../../utils/helpers';

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '—'}</Text>
    </View>
  );
}

export default function UserDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user: me } = useAuth();

  const userId = route.params?.userId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [details, setDetails] = useState(null);

  const allowed = isAdmin(me?.role);

  const load = useCallback(async () => {
    if (!allowed || !userId) {
      setLoading(false);
      return;
    }
    setError('');
    try {
      const u = await userService.fetchUserById(userId);
      setDetails(u);
    } catch (e) {
      setError(getApiErrorMessage(e, 'Unable to load user.'));
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }, [allowed, userId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  if (!allowed) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Header title="User details" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.pad}>
          <EmptyState
            icon="🔒"
            title="Admin only"
            message="Only administrators should view other user records."
            actionLabel="Go back"
            onAction={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!userId) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Header title="User details" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.pad}>
          <EmptyState
            icon="❓"
            title="Missing user id"
            message="This screen expects navigation params: { userId }."
            actionLabel="Back to list"
            onAction={() => navigation.navigate('AdminUserList')}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Header title="User details" showBack onBackPress={() => navigation.goBack()} />
        <LoadingSpinner message="Loading user…" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Header title="User details" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <ErrorMessage message={error} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>
          <Row label="User id" value={details?.id} />
          <Row label="Full name" value={details?.fullName} />
          <Row label="Email" value={details?.email} />
          <Row label="Phone" value={details?.phone} />
          <Row label="Role" value={formatRoleLabel(details?.role)} />
          <Row label="Address" value={details?.address} />
          <Row label="Gender" value={details?.gender} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightGray },
  pad: { padding: 16, flex: 1 },
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
});
