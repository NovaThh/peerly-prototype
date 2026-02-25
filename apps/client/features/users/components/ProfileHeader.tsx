import { View, Text, StyleSheet, Image } from 'react-native';
import type { User } from '@/features/home/data/mockUsers';
import BackButton from '@/shared/components/ui/BackButton';
import { router } from 'expo-router';

type BackToType = Parameters<typeof router.replace>[0];

type Props = {
  user: User;
  showBack?: boolean;
  backTo?: BackToType;   // ← properly typed
};

export default function ProfileHeader({
  user,
  showBack = true,
  backTo,
}: Props) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profile_image_url }} style={styles.image} />

      <View style={styles.bottomScrim} />

      {showBack && backTo && (
        <BackButton to={backTo} />
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

  bottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 95,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  nameContainer: { position: 'absolute', bottom: 20, left: 20 },
  name: { color: '#fff', fontSize: 28, fontWeight: '700' },
  meta: { color: '#fff', fontSize: 14 },
});