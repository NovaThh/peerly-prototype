import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { COLORS } from "@/constants/theme";

export default function HomeScreen(){
    return (
        <SafeAreaView style={styles.container}>
            <Header />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});