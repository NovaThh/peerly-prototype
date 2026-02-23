import { useLocalSearchParams } from 'expo-router';
import OtherUserProfileScreen from '@/features/users/screens/OtherUserProfileScreen';

export default function UserProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <OtherUserProfileScreen userId={id} />;
}