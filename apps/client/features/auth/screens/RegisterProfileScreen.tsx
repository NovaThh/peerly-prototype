import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { COLORS } from '@/constants/theme';
import {
  MOCK_USERS,
  type EducationLevel,
  type User,
} from '@/features/home/data/mockUsers';
import ProfileEditForm from '@/features/users/components/ProfileEditForm';
import PeerlyButton from '@/shared/components/ui/PeerlyButton';
import EducationLevelModal from '@/features/users/components/EducationLevelModal';
import AddTagModal from '@/features/users/components/AddTagModal';
import {
  getRegisterCredentials,
  getRegisterProfileImage,
} from '@/features/auth/store/registerStore';
import { login } from '@/shared/store/auth';

const EDUCATION_LEVELS: EducationLevel[] = [
  'MBO',
  'HBO',
  'WO',
  'Master HBO',
  'Master WO',
];

export default function RegisterProfileScreen() {
  const creds = getRegisterCredentials();

  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [about, setAbout] = useState('');
  const [educationLevel, setEducationLevel] =
    useState<EducationLevel>('HBO');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [needs, setNeeds] = useState<string[]>([]);

  const [eduOpen, setEduOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [tagTitle, setTagTitle] = useState('Enter a strength');
  const [tagValue, setTagValue] = useState('');
  const [tagError, setTagError] = useState('');
  const [tagTarget, setTagTarget] = useState<'strengths' | 'needs'>(
    'strengths',
  );

  const [error, setError] = useState<string | null>(null);

  const openTag = (target: 'strengths' | 'needs') => {
    setTagTarget(target);
    setTagTitle(
      target === 'strengths'
        ? 'Enter a strength'
        : 'Enter a weakness',
    );
    setTagValue('');
    setTagError('');
    setTagOpen(true);
  };

  const addTag = () => {
    const trimmed = tagValue.trim();
    if (!trimmed) {
      setTagError('Value is required.');
      return;
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) {
      setTagError('Only letters and spaces allowed.');
      return;
    }

    if (tagTarget === 'strengths') {
      setStrengths((prev) => [...prev, trimmed]);
    } else {
      setNeeds((prev) => [...prev, trimmed]);
    }
    setTagOpen(false);
  };

  const handleSave = () => {
    if (!creds) {
      setError('Something went wrong. Please start registration again.');
      return;
    }

    const trimmedName = name.trim();
    const trimmedMajor = major.trim();

    if (!trimmedName || !trimmedMajor || !strengths.length || !needs.length) {
      setError('Please fill in all required fields marked with *.');
      return;
    }

    if (!/[aeiouAEIOU]/.test(trimmedName) || trimmedName.length < 2) {
      setError(
        'Name must be at least 2 characters and contain a vowel.',
      );
      return;
    }

    setError(null);

    const newId = (MOCK_USERS.length + 1).toString();
    const profileImageUrl =
      getRegisterProfileImage() ??
      'https://placekitten.com/400/400'; // placeholder

    const newUser: User = {
      id: newId,
      name: trimmedName,
      email: creds.email,
      password: creds.password,
      major: trimmedMajor,
      education_level: educationLevel,
      strengths,
      needs_help_with: needs,
      description: about,
      token_balance: 0,
      created_at: new Date().toISOString(),
      profile_image_url: profileImageUrl,
    };

    // prototype-level mutation
    MOCK_USERS.push(newUser);

    login();
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <ProfileEditForm
            name={name}
            setName={(v) => {
              setName(v);
              setError(null);
            }}
            major={major}
            setMajor={(v) => {
              setMajor(v);
              setError(null);
            }}
            about={about}
            setAbout={setAbout}
            educationLevel={educationLevel}
            onOpenEducation={() => setEduOpen(true)}
            strengths={strengths}
            needs={needs}
            onAddStrength={() => openTag('strengths')}
            onAddNeed={() => openTag('needs')}
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </ScrollView>

        <View style={styles.bottom}>
          <PeerlyButton
            title="Save"
            backgroundColor={COLORS.buttonGreen}
            textColor={COLORS.textOnDark}
            style={{ flex: 1 }}
            onPress={handleSave}
          />
        </View>

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
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 13,
    paddingHorizontal: 20,
    marginTop: 8,
  },
});