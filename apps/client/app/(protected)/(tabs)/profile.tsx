import UserProfileScreen from '@/features/users/screens/UserProfileScreen';
import { getLoggedInUserId } from '@/shared/store/auth';

export default function ProfileScreen() {
  const userId = getLoggedInUserId();
  if (!userId) return null;

  return <UserProfileScreen userId={userId} mode="self" />;

}