// features/users/components/StudySessionSchedulePlaceholder.tsx
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';

export default function StudySessionSchedulePlaceholder() {
  return (
    <View style={styles.scheduleRow}>
      <View style={styles.scheduleField}>
        <Text style={styles.scheduleFieldLabel}>DD</Text>
      </View>
      <View style={styles.scheduleField}>
        <Text style={styles.scheduleFieldLabel}>MM</Text>
      </View>
      <View style={styles.scheduleField}>
        <Text style={styles.scheduleFieldLabel}>YYYY</Text>
      </View>
      <View style={[styles.scheduleField, { flex: 1.2 }]}>
        <Text style={styles.scheduleFieldLabel}>HH:MM AM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  scheduleField: {
    flex: 0.8,
    borderWidth: 1,
    borderColor: COLORS.searchBar,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  scheduleFieldLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
});