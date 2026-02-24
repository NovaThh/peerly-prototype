import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { MOCK_REQUESTS } from '../data/mockRequests';
import RequestCard from '../components/RequestCard';
import RequestSection from '../components/RequestSection';
import { isLoggedIn } from '@/shared/store/auth';
import PeerlyButton from '@/shared/components/ui/PeerlyButton';
import { router } from 'expo-router';

export default function RequestsScreen() {
  const currentUserId = '1';

  //TODO: refactor this with real authentication after integrating database
  //NOT LOGGED IN VIEW
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.title}>Please log in</Text>
          <Text style={styles.subtitle}>
            You need an account to manage requests.
          </Text>

          <PeerlyButton
            title="Go to Login"
            backgroundColor={COLORS.buttonGreen}
            textColor={COLORS.textOnDark}
            onPress={() => router.push('/login')}
            style={{ marginTop: 20, width: 200 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  //LOGGED IN VIEW
  const active = MOCK_REQUESTS.filter(
    r =>
      r.status === 'ACCEPTED' &&
      (r.requester_id === currentUserId ||
        r.receiver_id === currentUserId)
  );

  const incoming = MOCK_REQUESTS.filter(
    r =>
      r.status === 'PENDING' &&
      r.receiver_id === currentUserId
  );

  const inProgress = MOCK_REQUESTS.filter(
    r =>
      ['PENDING', 'DECLINED', 'CANCELED'].includes(r.status) &&
      (r.requester_id === currentUserId ||
        r.receiver_id === currentUserId)
  );

  const completed = MOCK_REQUESTS.filter(
    r =>
      r.status === 'COMPLETED' &&
      (r.requester_id === currentUserId ||
        r.receiver_id === currentUserId)
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.pageTitle}>All Requests</Text>
      <ScrollView contentContainerStyle={styles.container}>

        <RequestSection title="Active Requests" count={active.length}>
          {active.map(r => (
            <RequestCard key={r.id} request={r} currentUserId={currentUserId} />
          ))}
        </RequestSection>

        <RequestSection title="Requests In Progress" count={inProgress.length}>
          {inProgress.map(r => (
            <RequestCard key={r.id} request={r} currentUserId={currentUserId} />
          ))}
        </RequestSection>

        <RequestSection title="Incoming Requests" count={incoming.length}>
          {incoming.map(r => (
            <RequestCard key={r.id} request={r} currentUserId={currentUserId} />
          ))}
        </RequestSection>

        <RequestSection title="Completed Requests" count={completed.length}>
          {completed.map(r => (
            <RequestCard key={r.id} request={r} currentUserId={currentUserId} />
          ))}
        </RequestSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center'
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