// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { COLORS } from '@/constants/theme';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { isLoggedIn } from '@/shared/store/auth';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      {/* Visible tabs */}
      <Tabs.Screen
        name="requests"
        options={{
          tabBarIcon: () => (
            <Entypo name="text-document" size={24} color="black" />
          ),
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ size }) => (
            <Feather name="home" size={size} color={COLORS.textPrimary} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size }) => (
            <Feather name="user" size={size} color={COLORS.textPrimary} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // prototype guard
            if (!isLoggedIn) {
              e.preventDefault();
              router.push('/login');
            }
          },
        }}
      />

      {/* Hidden / internal routes – no tab icon */}

      {/* user profile detail */}
      <Tabs.Screen
        name="users/[id]"
        options={{ href: null }}
      />

      {/* edit profile */}
      <Tabs.Screen
        name="edit"
        options={{ href: null }}
      />

      {/* schedule session */}
      <Tabs.Screen
        name="schedule-session"
        options={{ href: null }}
      />

      {/* auth flows */}
      <Tabs.Screen
        name="register/credentials"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="register/photo"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="register/profile"
        options={{ href: null }}
      />
    </Tabs>
  );
}