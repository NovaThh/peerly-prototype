// app/index.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '@/shared/store/auth';
import { View } from 'react-native';

export default function Index() {
  const { loggedInUserId, hydrated } = useAuth();

  if (!hydrated) return <View style={{ flex: 1 }} />;

  return loggedInUserId ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}