import { Tabs } from "expo-router";
import { COLORS } from "@/constants/theme";
import Feather from '@expo/vector-icons/Feather';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={COLORS.textPrimary} />
          ),
        }}
      />
    </Tabs>
  );
}