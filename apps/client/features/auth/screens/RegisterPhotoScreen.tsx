import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';

import { COLORS } from '@/constants/theme';
import PhotoActionSheet from '@/features/users/components/PhotoActionSheet';
import {
  getRegisterProfileImage,
  setRegisterProfileImage,
} from '@/features/auth/store/registerStore';

export default function RegisterPhotoScreen() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(
    getRegisterProfileImage(),
  );

  const handleOpenSheet = () => {
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
  };

  // TODO: when PhotoActionSheet supports returning a URI,
  // wire its callback to call setPhoto(uri) below.
  const setPhoto = (uri: string | null) => {
    setPhotoUri(uri);
    setRegisterProfileImage(uri);
  };

  const goNext = () => {
    router.push('/register/profile');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Back */}
        <Pressable
          onPress={() => router.replace('/register/credentials')}
          style={styles.back}
        >
          <Feather
            name="arrow-left"
            size={22}
            color={COLORS.textPrimary}
          />
        </Pressable>

        <Text style={styles.title}>Register</Text>

        <View style={styles.centerArea}>
          <Text style={styles.heading}>Upload your profile picture</Text>

          <Pressable
            style={styles.photoBox}
            onPress={handleOpenSheet}
          >
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={styles.photoImage}
              />
            ) : (
              <View style={styles.placeholderShape} />
            )}

            <View style={styles.photoEdit}>
              <Feather
                name="edit-2"
                size={16}
                color={COLORS.textOnDark}
              />
            </View>
          </Pressable>

          <Pressable onPress={goNext}>
            <Text style={styles.skip}>Skip →</Text>
          </Pressable>
        </View>

        <PhotoActionSheet
          visible={sheetOpen}
          onClose={handleCloseSheet}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  back: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 40,
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: COLORS.textPrimary,
  },
  photoBox: {
    width: 200,
    height: 200,
    borderRadius: 18,
    backgroundColor: COLORS.searchBar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderShape: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#DDD',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  photoEdit: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skip: {
    marginTop: 20,
    color: COLORS.textPrimary,
    textDecorationLine: 'underline',
  },
});