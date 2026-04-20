/**
 * Admin user list: GET /api/users
 * Non-admin users see a friendly "not allowed" empty state.
 */

import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { isAdmin } from '../../constants/roles';
import * as userService from '../../services/userService';
import { formatRoleLabel, getApiErrorMessage } from '../../utils/helpers';

export default function AdminUserListScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  const allowed = isAdmin(user?.role);

  const load = useCallback(async () => {
    if (!allowed) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    setError('');
    try {
      const list = await userService.fetchUsers();
      setUsers(list);
    } catch (e) {
      setError(getApiErrorMessage(e, 'Unable to load users.'));
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [allowed]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  if (!allowed) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Header title="Users" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.pad}>
          <EmptyState
            icon="🔒"
            title="Admin only"
            message="This screen is meant for admin accounts. Your backend should also block non-admins."
            actionLabel="Back to dashboard"
            onAction={() => navigation.navigate('Dashboard')}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Header title="Users" showBack onBackPress={() => navigation.goBack()} />
        <LoadingSpinner message="Loading users…" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Header title="Users" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.pad}>
        <ErrorMessage message={error} />

        <FlatList
          style={styles.list}
          data={users}
          keyExtractor={(item) => String(item.id)}
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
          ListEmptyComponent={
            <EmptyState
              icon="👥"
              title="No users found"
              message="Your API returned an empty list, or the response shape did not match the parser."
              actionLabel="Try again"
              onAction={() => {
                setLoading(true);
                load();
              }}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate('UserDetails', { userId: item.id })
              }
              activeOpacity={0.85}
            >
              <Text style={styles.itemTitle}>{item.fullName || 'Unnamed user'}</Text>
              <Text style={styles.itemSub}>{item.email}</Text>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{formatRoleLabel(item.role)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightGray },
  pad: { flex: 1, paddingHorizontal: 16, paddingBottom: 16 },
  list: { flex: 1 },
  item: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  itemTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  itemSub: { marginTop: 4, fontSize: 13, color: colors.textSecondary },
  pill: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: colors.softCyan,
    borderColor: colors.teal,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: { color: colors.deepTeal, fontWeight: '800', fontSize: 12 },
});
