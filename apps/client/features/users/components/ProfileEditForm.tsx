import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { COLORS } from '@/constants/theme';
import { type EducationLevel } from '@/features/users/data/types';

type Props = {
  name: string;
  setName: (v: string) => void;
  major: string;
  setMajor: (v: string) => void;
  about: string;
  setAbout: (v: string) => void;
  educationLevel: EducationLevel;
  onOpenEducation: () => void;

  strengths: string[];
  needs: string[];

  onAddStrength: () => void;
  onAddNeed: () => void;

  onRemoveStrength: (value: string) => void;
  onRemoveNeed: (value: string) => void;
};

export default function ProfileEditForm({
  name,
  setName,
  major,
  setMajor,
  about,
  setAbout,
  educationLevel,
  onOpenEducation,
  strengths,
  needs,
  onAddStrength,
  onAddNeed,
  onRemoveStrength,
  onRemoveNeed,
}: Props) {
  return (
    <View style={styles.form}>
      <Text style={styles.label}>Name*</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Education Level*</Text>
      <Pressable style={styles.dropdown} onPress={onOpenEducation}>
        <Text style={styles.dropdownText}>{educationLevel}</Text>
        <Feather name="chevron-down" size={18} color={COLORS.textSecondary} />
      </Pressable>

      <Text style={styles.label}>Major*</Text>
      <TextInput value={major} onChangeText={setMajor} style={styles.input} />

      <Text style={styles.label}>About</Text>
      <TextInput
        value={about}
        onChangeText={setAbout}
        style={[styles.input, styles.textArea]}
        multiline
      />

      <Text style={styles.label}>Strengths*</Text>
      <View style={styles.tagRow}>
        {strengths.map((t) => (
          <View key={t} style={styles.tag}>
            <Text style={styles.tagText}>{t}</Text>
            <Pressable
              hitSlop={8}
              onPress={() => onRemoveStrength(t)}
              style={styles.tagX}
            >
              <Feather name="x" size={14} color={COLORS.textSecondary} />
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.plus} onPress={onAddStrength}>
          <Feather name="plus" size={16} color={COLORS.textPrimary} />
        </Pressable>
      </View>

      <Text style={styles.label}>Needs Help With*</Text>
      <View style={styles.tagRow}>
        {needs.map((t) => (
          <View key={t} style={styles.tag}>
            <Text style={styles.tagText}>{t}</Text>
            <Pressable
              hitSlop={8}
              onPress={() => onRemoveNeed(t)}
              style={styles.tagX}
            >
              <Feather name="x" size={14} color={COLORS.textSecondary} />
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.plus} onPress={onAddNeed}>
          <Feather name="plus" size={16} color={COLORS.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { padding: 20 },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.card,
  },
  dropdownText: { color: COLORS.textPrimary },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, alignItems: 'center' },

  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    borderRadius: 8,
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 12, marginRight: 6 },
  tagX: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  plus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});