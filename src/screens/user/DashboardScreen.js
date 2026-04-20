/**
 * Role-based home / dashboard.
 * Shows quick actions for auth/profile now, and placeholder cards for future modules.
 */

import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { isAdmin } from '../../constants/roles';
import { formatRoleLabel } from '../../utils/helpers';

function DashboardCard({ title, description, onPress, disabled = false }) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.card,
        disabled && styles.cardDisabled,
        pressed && !disabled && styles.cardPressed,
      ]}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{description}</Text>
      {!disabled ? <Text style={styles.cardCta}>Open →</Text> : null}
    </Pressable>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();

  const roleLabel = useMemo(() => formatRoleLabel(user?.role), [user?.role]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.top}>
          <Text style={styles.hello}>Hello,</Text>
          <Text style={styles.name}>{user?.fullName || 'User'}</Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{roleLabel}</Text>
          </View>
          <Text style={styles.helper}>
            This dashboard changes slightly by role. Admin users can open the user list.
          </Text>
        </View>

        <DashboardCard
          title="My profile"
          description="View your details pulled from GET /api/users/profile."
          onPress={() => navigation.navigate('Profile')}
        />

        {isAdmin(user?.role) ? (
          <DashboardCard
            title="User management"
            description="Browse users from GET /api/users (admin-only on the backend)."
            onPress={() => navigation.navigate('AdminUserList')}
          />
        ) : null}

        <DashboardCard
          title="Appointments (coming soon)"
          description="Hook this card to your appointments module later without rewriting auth."
          disabled
        />

        <DashboardCard
          title="Medical records (coming soon)"
          description="Another placeholder for your next coursework milestone."
          disabled
        />

        <View style={styles.footer}>
          <CustomButton title="Log out" variant="outline" onPress={signOut} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightGray },
  scroll: { padding: 18, paddingBottom: 28 },
  top: { marginBottom: 12 },
  hello: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  name: { fontSize: 28, fontWeight: '900', color: colors.deepTeal, marginTop: 4 },
  pill: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: colors.softCyan,
    borderColor: colors.teal,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: { color: colors.deepTeal, fontWeight: '800', fontSize: 12 },
  helper: { marginTop: 10, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  card: {
    marginTop: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.deepTeal,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardDisabled: { opacity: 0.55 },
  cardPressed: { transform: [{ scale: 0.99 }] },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  cardText: { marginTop: 6, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  cardCta: { marginTop: 10, color: colors.deepTeal, fontWeight: '800' },
  footer: { marginTop: 16 },
});
