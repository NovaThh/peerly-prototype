import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { COLORS } from '@/constants/theme';
import type { Request } from '../data/mockRequests';
import { MOCK_USERS } from '@/features/home/data/mockUsers';

type Props = { request: Request; currentUserId: string };

export default function RequestCard({ request, currentUserId }: Props) {
  const isRequester = request.requester_id === currentUserId;
  const otherUserId = isRequester ? request.receiver_id : request.requester_id;
  const otherUser = MOCK_USERS.find((u) => u.id === otherUserId);
  if (!otherUser) return null;

  const subtitleText = isRequester ? `Request for: ${request.subject}` : `Incoming request: ${request.subject}`;

  return (
    <Pressable style={styles.card}>
      <Image source={{ uri: otherUser.profile_image_url }} style={styles.avatar} />

      <View style={styles.content}>
        <Text style={styles.name}>{otherUser.name}</Text>
        <Text style={styles.subtitle}>{subtitleText}</Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.status, getStatusStyle(request.status)]}>{request.status}</Text>
      </View>
    </Pressable>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'ACCEPTED':
      return { color: COLORS.buttonYellow };
    case 'PENDING':
      return { color: COLORS.textSecondary };
    case 'DECLINED':
      return { color: COLORS.red };
    case 'CANCELED':
      return { color: COLORS.textMuted };
    case 'COMPLETED':
      return { color: COLORS.buttonGreen };
    default:
      return { color: COLORS.textPrimary };
  }
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' },
  avatar: { width: 52, height: 52, borderRadius: 12, marginRight: 14 },
  content: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  right: { marginLeft: 8 },
  status: { fontSize: 13, fontWeight: '600' },
});