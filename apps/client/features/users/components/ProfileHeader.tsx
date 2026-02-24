import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import type { User } from '@/features/home/data/mockUsers';

type Props = {
  user: User;
  showBack?: boolean;
};

export default function ProfileHeader({ user, showBack = true }: Props) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profile_image_url }} style={styles.image} />
      <View style={styles.overlay} />

      {showBack && (
        <Pressable style={styles.backButton} onPress={() => router.replace('/home')}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </Pressable>
      )}

      <View style={styles.nameContainer}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.meta}>
          {user.education_level} - {user.major}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 260, position: 'relative' },
  image: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  nameContainer: { position: 'absolute', bottom: 20, left: 20 },
  name: { color: '#fff', fontSize: 28, fontWeight: '700' },
  meta: { color: '#fff', fontSize: 14 },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});