import { useLocalSearchParams } from 'expo-router';
import UserProfileScreen from '@/features/users/screens/UserProfileScreen';

export default function UserProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <UserProfileScreen userId={id} mode="other" />;
}