import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Nunito_800ExtraBold, Nunito_400Regular } from "@expo-google-fonts/nunito";
import { View } from "react-native";
import { useEffect } from "react";

import { initUsers } from "@/features/users/store/usersStore";
import { loadRequests } from "@/features/requests/store/requestsStore";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_800ExtraBold,
    Nunito_400Regular,
  });

  useEffect(() => {
    initUsers();
    loadRequests();
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}