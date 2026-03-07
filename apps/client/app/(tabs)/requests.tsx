import { router } from 'expo-router';
import { useAuth } from '@/shared/store/auth';
import RequestsScreen from '@/features/requests/screens/RequestsScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import PeerlyButton from '@/shared/components/ui/PeerlyButton';
import { COLORS } from '@/constants/theme';

export default function RequestsRoute() {
  const { loggedInUserId, hydrated } = useAuth();

  if (!hydrated) return null;

  if (!loggedInUserId) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.title}>Please log in</Text>
          <Text style={styles.subtitle}>
            You need an account to manage requests and offers.
          </Text>

          <PeerlyButton
            title="Go to Login"
            backgroundColor={COLORS.buttonGreen}
            textColor={COLORS.textOnDark}
            onPress={() => router.push('/(auth)/login')}
            style={{ marginTop: 20, width: 200 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return <RequestsScreen />;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});