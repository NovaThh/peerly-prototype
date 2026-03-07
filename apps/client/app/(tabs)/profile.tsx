import { Redirect } from 'expo-router';
import { useAuth } from '@/shared/store/auth';
import UserProfileScreen from '@/features/users/screens/UserProfileScreen';

export default function ProfileRoute() {
  const { loggedInUserId, hydrated } = useAuth();

  if (!hydrated) return null;
  if (!loggedInUserId) return <Redirect href="/(auth)/login" />;

  return <UserProfileScreen userId={loggedInUserId} mode="self" />;
}