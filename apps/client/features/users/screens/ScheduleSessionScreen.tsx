// features/requests/screens/ScheduleSessionScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS } from '@/constants/theme';
import PeerlyButton from '@/shared/components/ui/PeerlyButton';
import BackButton from '@/shared/components/ui/BackButton';

export default function ScheduleSessionScreen() {
  const { requestId } = useLocalSearchParams<{ requestId?: string }>();

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const [error, setError] = useState<string | null>(null);

  const buildDate = () => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    const hRaw = parseInt(hour, 10);
    const min = parseInt(minute, 10);

    if (!d || !m || !y || isNaN(hRaw) || isNaN(min)) return null;

    let h24 = hRaw % 12;
    if (ampm === 'PM') h24 += 12;

    // Interpret picked time as UTC, not local.
    const date = new Date(Date.UTC(y, m - 1, d, h24, min, 0, 0));
    if (isNaN(date.getTime())) return null;
    return date;
  };

  const handleHourChange = (text: string) => {
    setError(null);

    if (text === '') {
      setHour('');
      return;
    }

    let h = parseInt(text, 10);
    if (isNaN(h)) return;

    // clamp to 0–23
    if (h < 0) h = 0;
    if (h > 23) h = 23;

    // if user types 12–23 while AM is selected, auto-switch to PM
    if (h >= 12 && ampm === 'AM') {
      setAmpm('PM');
    }

    setHour(h.toString().padStart(2, '0'));
  };

  const handleMinuteChange = (text: string) => {
    setError(null);

    if (text === '') {
      setMinute('');
      return;
    }

    let m = parseInt(text, 10);
    if (isNaN(m)) return;

    // clamp to 0–59
    if (m < 0) m = 0;
    if (m > 59) m = 59;

    setMinute(m.toString().padStart(2, '0'));
  };

  const handleSave = () => {
    // basic empty check
    if (!day || !month || !year || !hour || !minute) {
      setError('Please fill in all date and time fields.');
      return;
    }

    const date = buildDate();
    if (!date) {
      setError('Please enter a valid date and time.');
      return;
    }

    const now = new Date();
    if (date.getTime() <= now.getTime()) {
      setError('Date and time must be in the future.');
      return;
    }

    setError(null);

    console.log(
      'Save schedule for request',
      requestId,
      '=>',
      date.toISOString(),
    );
    // TODO: connect to request store, e.g. setRequestSchedule(requestId, date.toISOString())
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerRow}>
          <BackButton to="/requests" />
          <Text style={styles.title}>Schedule Study Session</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.dateRow}>
            {/* DD first */}
            <TextInput
              style={styles.dateInput}
              placeholder="DD"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              maxLength={2}
              value={day}
              onChangeText={(val) => {
                setError(null);
                setDay(val);
              }}
            />
            <TextInput
              style={styles.dateInput}
              placeholder="MM"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              maxLength={2}
              value={month}
              onChangeText={(val) => {
                setError(null);
                setMonth(val);
              }}
            />
            <TextInput
              style={[styles.dateInput, { flex: 1.5 }]}
              placeholder="YYYY"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              maxLength={4}
              value={year}
              onChangeText={(val) => {
                setError(null);
                setYear(val);
              }}
            />
          </View>

          <Text style={[styles.label, { marginTop: 24 }]}>Time</Text>
          <View style={styles.timeRow}>
            <TextInput
              style={styles.timeInput}
              placeholder="HH"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              maxLength={2}
              value={hour}
              onChangeText={handleHourChange}
            />
            <Text style={styles.timeSeparator}>:</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="MM"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              maxLength={2}
              value={minute}
              onChangeText={handleMinuteChange}
            />
            <View style={styles.ampmContainer}>
              <PeerlyButton
                title="AM"
                backgroundColor={
                  ampm === 'AM' ? COLORS.buttonYellow : 'transparent'
                }
                textColor={
                  ampm === 'AM' ? COLORS.textPrimary : COLORS.textSecondary
                }
                style={styles.ampmButton}
                borderColor={COLORS.searchBar}
                onPress={() => {
                  setError(null);
                  setAmpm('AM');
                }}
              />
              <PeerlyButton
                title="PM"
                backgroundColor={
                  ampm === 'PM' ? COLORS.buttonYellow : 'transparent'
                }
                textColor={
                  ampm === 'PM' ? COLORS.textPrimary : COLORS.textSecondary
                }
                style={styles.ampmButton}
                borderColor={COLORS.searchBar}
                onPress={() => {
                  setError(null);
                  setAmpm('PM');
                }}
              />
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <View className="bottomButtons" style={styles.bottomButtons}>
          <PeerlyButton
            title="Save"
            backgroundColor={COLORS.buttonGreen}
            textColor={COLORS.textOnDark}
            style={styles.bottomButton}
            onPress={handleSave}
          />
          <PeerlyButton
            title="Cancel"
            backgroundColor={COLORS.red}
            textColor={COLORS.textOnDark}
            style={styles.bottomButton}
            onPress={handleCancel}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    marginLeft: 50,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    marginRight: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.searchBar,
    backgroundColor: COLORS.card,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeInput: {
    width: 64,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.searchBar,
    backgroundColor: COLORS.card,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  timeSeparator: {
    marginHorizontal: 6,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  ampmContainer: {
    marginLeft: 12,
    flexDirection: 'row',
  },
  ampmButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  errorText: {
    marginTop: 10,
    fontSize: 13,
    color: COLORS.red,
  },
});