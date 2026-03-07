import { Redirect } from 'expo-router';
import { useAuth } from '@/shared/store/auth';
import RequestsScreen from '@/features/requests/screens/RequestsScreen';

export default function RequestsRoute() {
  const { loggedInUserId, hydrated } = useAuth();

  if (!hydrated) return null;
  if (!loggedInUserId) return <Redirect href="/(auth)/login" />;

  return <RequestsScreen />;
}