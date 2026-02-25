// features/requests/screens/RequestsScreen.tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import RequestCard from '../components/RequestCard';
import RequestSection from '../components/RequestSection';
import { isLoggedIn } from '@/shared/store/auth';
import PeerlyButton from '@/shared/components/ui/PeerlyButton';
import { router } from 'expo-router';
import {
  useRequests,
  setRequestStatus,
  deleteRequest,
} from '../store/requestsStore';
import type { Request } from '../data/mockRequests';

export default function RequestsScreen() {
  const currentUserId = '1';

  const requests = useRequests(); // shared in-memory state

  if (!isLoggedIn) {
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
            onPress={() => router.push('/login')}
            style={{ marginTop: 20, width: 200 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const isInvolved = (r: Request) =>
    r.requester_id === currentUserId ||
    r.receiver_id === currentUserId;

  // Active Sessions (ACCEPTED)
  const activeSessions = requests.filter(
    (r) => r.status === 'ACCEPTED' && isInvolved(r),
  );

  // Incoming (Pending & I am receiver)
  const incoming = requests.filter(
    (r) =>
      r.status === 'PENDING' &&
      r.receiver_id === currentUserId,
  );

  // Outgoing (Pending & I am requester)
  const outgoing = requests.filter(
    (r) =>
      r.status === 'PENDING' &&
      r.requester_id === currentUserId,
  );

  // Completed
  const completed = requests.filter(
    (r) => r.status === 'COMPLETED' && isInvolved(r),
  );

  // Canceled / Declined
  const canceledOrDeclined = requests.filter(
    (r) =>
      ['DECLINED', 'CANCELED'].includes(r.status) &&
      isInvolved(r),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.pageTitle}>All Requests and Offers</Text>

      <ScrollView contentContainerStyle={styles.container}>

        <RequestSection title="Active Sessions" count={activeSessions.length}>
          {activeSessions.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              currentUserId={currentUserId}
              context="active"
              onChangeStatus={setRequestStatus}
              onDelete={deleteRequest}
            />
          ))}
        </RequestSection>

        <RequestSection title="Incoming" count={incoming.length}>
          {incoming.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              currentUserId={currentUserId}
              context="incoming"
              onChangeStatus={setRequestStatus}
              onDelete={deleteRequest}
            />
          ))}
        </RequestSection>

        <RequestSection title="Outgoing" count={outgoing.length}>
          {outgoing.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              currentUserId={currentUserId}
              context="outgoing"
              onChangeStatus={setRequestStatus}
              onDelete={deleteRequest}
            />
          ))}
        </RequestSection>

        <RequestSection title="Completed Sessions" count={completed.length}>
          {completed.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              currentUserId={currentUserId}
              context="completed"
              onChangeStatus={setRequestStatus}
              onDelete={deleteRequest}
            />
          ))}
        </RequestSection>

        <RequestSection
          title="Canceled / Declined"
          count={canceledOrDeclined.length}
        >
          {canceledOrDeclined.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              currentUserId={currentUserId}
              context="history"
              onChangeStatus={setRequestStatus}
              onDelete={deleteRequest}
            />
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
    textAlign: 'center',
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