import { useMemo, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { MOCK_USERS, type EducationLevel } from '@/features/home/data/mockUsers';
import Feather from '@expo/vector-icons/Feather';
import PeerlyButton from '@/shared/components/ui/PeerlyButton';
import { router } from 'expo-router';

import ProfileEditForm from '../components/ProfileEditForm';
import PhotoActionSheet from '../components/PhotoActionSheet';
import EducationLevelModal from '../components/EducationLevelModal';
import AddTagModal from '../components/AddTagModal';

const EDUCATION_LEVELS: EducationLevel[] = ['MBO', 'HBO', 'WO', 'Master HBO', 'Master WO'];

export default function EditProfileScreen() {
  const user = useMemo(() => MOCK_USERS.find((u) => u.id === '1'), []);
  if (!user) return null;

  const [name, setName] = useState(user.name);
  const [major, setMajor] = useState(user.major);
  const [about, setAbout] = useState(user.description ?? '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(user.education_level);
  const [strengths, setStrengths] = useState<string[]>(user.strengths);
  const [needs, setNeeds] = useState<string[]>(user.needs_help_with);

  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [tagTitle, setTagTitle] = useState('Enter a strength');
  const [tagValue, setTagValue] = useState('');
  const [tagError, setTagError] = useState('');
  const [tagTarget, setTagTarget] = useState<'strengths' | 'needs'>('strengths');

  const openTag = (target: 'strengths' | 'needs') => {
    setTagTarget(target);
    setTagTitle(target === 'strengths' ? 'Enter a strength' : 'Enter a weakness');
    setTagValue('');
    setTagError('');
    setTagOpen(true);
  };

  const addTag = () => {
    const trimmed = tagValue.trim();
    if (!trimmed) return setTagError('Value is required.');
    if (!/^[a-zA-Z0-9 ]+$/.test(trimmed))
      return setTagError('Only letters and spaces allowed.');

    if (tagTarget === 'strengths')
      setStrengths((prev) => [...prev, trimmed]);
    else
      setNeeds((prev) => [...prev, trimmed]);

    setTagOpen(false);
  };

  const handleSave = () => {
    user.name = name;
    user.major = major;
    user.description = about;
    user.education_level = educationLevel;
    user.strengths = strengths;
    user.needs_help_with = needs;

    router.replace('/profile');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: user.profile_image_url }} style={styles.image} />
            <Pressable style={styles.backButton} onPress={() => router.replace('/profile')}>
              <Feather name="arrow-left" size={22} />
            </Pressable>
            <Pressable style={styles.photoEdit} onPress={() => setPhotoSheetOpen(true)}>
              <Feather name="edit-2" size={16} color={COLORS.textOnDark} />
            </Pressable>
          </View>

          <ProfileEditForm
            name={name}
            setName={setName}
            major={major}
            setMajor={setMajor}
            about={about}
            setAbout={setAbout}
            educationLevel={educationLevel}
            onOpenEducation={() => setEduOpen(true)}
            strengths={strengths}
            needs={needs}
            onAddStrength={() => openTag('strengths')}
            onAddNeed={() => openTag('needs')}
          />
        </ScrollView>

        <View style={styles.bottom}>
          <View style={styles.row}>
            <PeerlyButton title="Save" backgroundColor={COLORS.buttonGreen} textColor="#fff" style={{ flex: 1 }} onPress={handleSave} />
            <PeerlyButton title="Cancel" backgroundColor={COLORS.red} textColor="#fff" style={{ flex: 1, marginLeft: 6 }} onPress={() => router.replace('/profile')} />
          </View>

          {/* TODO: implement real api */}
          <PeerlyButton
            title="Delete Account"
            backgroundColor="transparent"
            textColor={COLORS.red}
            borderColor={COLORS.red}
            style={{ marginTop: 10 }}
          />
        </View>

        <PhotoActionSheet visible={photoSheetOpen} onClose={() => setPhotoSheetOpen(false)} />

        <EducationLevelModal
          visible={eduOpen}
          levels={EDUCATION_LEVELS}
          onSelect={(lvl) => {
            setEducationLevel(lvl);
            setEduOpen(false);
          }}
          onClose={() => setEduOpen(false)}
        />

        <AddTagModal
          visible={tagOpen}
          title={tagTitle}
          value={tagValue}
          error={tagError}
          onChange={(v) => {
            setTagValue(v);
            setTagError('');
          }}
          onClose={() => setTagOpen(false)}
          onSubmit={addTag}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  imageContainer: { height: 220 },
  image: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 16, left: 16 },
  photoEdit: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: COLORS.background },
  row: { flexDirection: 'row' },
});