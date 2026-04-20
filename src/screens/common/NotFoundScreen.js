/**
 * Simple "not found" / error route screen (reusable via navigation).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import EmptyState from '../../components/EmptyState';
import { colors } from '../../constants/colors';

export default function NotFoundScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const message =
    route.params?.message ||
    'The screen or item you opened does not exist (or you do not have access).';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.pad}>
        <Text style={styles.title}>Not found</Text>
        <Text style={styles.subtitle}>{message}</Text>

        <View style={styles.box}>
          <EmptyState
            icon="🧭"
            title="Let’s go back"
            message="Use the button below to return to your dashboard."
          />
        </View>

        <CustomButton title="Go to dashboard" onPress={() => navigation.navigate('Dashboard')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightGray },
  pad: { flex: 1, padding: 18 },
  title: { fontSize: 28, fontWeight: '900', color: colors.deepTeal },
  subtitle: { marginTop: 8, fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  box: { marginTop: 14, marginBottom: 14 },
});
