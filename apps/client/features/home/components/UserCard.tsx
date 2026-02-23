import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '@/constants/theme';
import type { User } from '../data/mockUsers';

type Props = {
  user: User;
};

export default function UserCard({ user }: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: user.profile_image_url }}
        style={styles.avatar}
      />

      <View style={styles.content}>
        <Text style={styles.nameLine}>
          {user.name}{' '}
          <Text style={styles.meta}>
            ({user.education_level}-{user.major})
          </Text>
        </Text>

        <Text
          style={styles.line}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          <Text style={styles.label}>Good at: </Text>
          {user.strengths.join(', ')}
        </Text>

        <Text
          style={styles.line}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          <Text style={styles.label}>Need help: </Text>
          {user.needs_help_with.join(', ')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 12,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  nameLine: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  meta: {
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  label: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  line: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
});