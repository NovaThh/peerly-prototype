import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { COLORS } from '@/constants/theme';
import type { Request, RequestStatus } from '../data/mockRequests';
import { MOCK_USERS } from '@/features/home/data/mockUsers';
import RequestActionsMenu, {
  RequestAction,
} from './RequestActionsMenu';
import { router } from 'expo-router';

type CardContext = 'active' | 'incoming' | 'outgoing' | 'completed' | 'history';

type Props = {
  request: Request;
  currentUserId: string;
  context: CardContext;
  onChangeStatus: (id: string, status: RequestStatus) => void;
  onDelete?: (id: string) => void;
};

export default function RequestCard({
  request,
  currentUserId,
  context,
  onChangeStatus,
  onDelete,
}: Props) {
  const isRequester = request.requester_id === currentUserId;
  const otherUserId = isRequester ? request.receiver_id : request.requester_id;
  const otherUser = MOCK_USERS.find((u) => u.id === otherUserId);
  if (!otherUser) return null;

  const { status, subject, type } = request;
  const isOffer = type === 'OFFER';

  // -------- subtitle text --------
  let subtitleText = '';

  if (status === 'ACCEPTED') {
    subtitleText = `Active session: ${subject}`;
  } else if (status === 'COMPLETED') {
    subtitleText = `Completed: ${subject}`;
  } else if (status === 'CANCELED') {
    if (isRequester) {
      if (isOffer) {
        subtitleText = `You canceled your offer to help with: ${subject}`;
      } else {
        subtitleText = `You canceled your request for help with: ${subject}`;
      }
    } else {
      if (isOffer) {
        subtitleText = `They canceled their offer to help with: ${subject}`;
      } else {
        subtitleText = `They canceled their request for help with: ${subject}`;
      }
    }
  } else if (status === 'DECLINED') {
    if (isRequester) {
      if (isOffer) {
        subtitleText = `They declined your offer to help with: ${subject}`;
      } else {
        subtitleText = `They declined your request for help with: ${subject}`;
      }
    } else {
      if (isOffer) {
        subtitleText = `You declined their offer to help with: ${subject}`;
      } else {
        subtitleText = `You declined their request for help with: ${subject}`;
      }
    }
  } else {
    // PENDING
    if (isRequester) {
      if (isOffer) {
        subtitleText = `Offer to help with: ${subject}`;
      } else {
        subtitleText = `Request for help with: ${subject}`;
      }
    } else {
      if (isOffer) {
        subtitleText = `Offer to help with: ${subject}`;
      } else {
        subtitleText = `Requested help for: ${subject}`;
      }
    }
  }

  // -------- actions for dropdown --------
  const actions: RequestAction[] = [];

  const handleChat = () => {
    console.log('Chat with', otherUser.name, 'for request', request.id);
  };

  const handleAccept = () => {
    onChangeStatus(request.id, 'ACCEPTED');
  };

  const handleDecline = () => {
    onChangeStatus(request.id, 'DECLINED');
  };

  const handleCancel = () => {
    onChangeStatus(request.id, 'CANCELED');
  };

  const handleDelete = () => {
    if (onDelete) onDelete(request.id);
  };

  const handleCardPress = () => {
    // Navigate to that user's profile; pass context + requestId
    router.push({
      pathname: '/users/[id]',
      params: {
        id: otherUserId,
        context,        // 'incoming' | 'outgoing' | ...
        requestId: request.id,
      },
    });
  };

  // Incoming section: PENDING → Chat, Accept, Decline
  if (context === 'incoming' && status === 'PENDING') {
    actions.push(
      { label: 'Chat', onPress: handleChat },
      { label: 'Accept', onPress: handleAccept },
      { label: 'Decline', onPress: handleDecline },
    );
  }

  // Outgoing section: PENDING → Chat, Cancel
  if (context === 'outgoing' && status === 'PENDING') {
    actions.push(
      { label: 'Chat', onPress: handleChat },
      { label: 'Cancel', onPress: handleCancel },
    );
  }

  // Active Sessions: ACCEPTED → Chat, Cancel
  if (context === 'active' && status === 'ACCEPTED') {
    actions.push(
      { label: 'Chat', onPress: handleChat },
      { label: 'Cancel', onPress: handleCancel },
    );
  }

  // Completed Sessions: COMPLETED → Chat, Delete
  if (context === 'completed' && status === 'COMPLETED') {
    actions.push(
      { label: 'Chat', onPress: handleChat },
      { label: 'Delete', onPress: handleDelete },
    );
  }

  // Canceled / Declined section: → Delete
  if (
    context === 'history' &&
    (status === 'CANCELED' || status === 'DECLINED')
  ) {
    actions.push({ label: 'Delete', onPress: handleDelete });
  }

  return (
    <Pressable style={styles.card} onPress={handleCardPress}>
      <Image source={{ uri: otherUser.profile_image_url }} style={styles.avatar} />

      <View style={styles.content}>
        <Text style={styles.name}>{otherUser.name}</Text>
        <Text style={styles.subtitle}>{subtitleText}</Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.status, getStatusStyle(status)]}>{status}</Text>
        <RequestActionsMenu actions={actions} />
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatar: { width: 52, height: 52, borderRadius: 12, marginRight: 14 },
  content: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  right: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
  },
});