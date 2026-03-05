import { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSection from '../components/ProfileSection';
import TagList from '../components/TagList';
import AboutText from '../components/AboutText';
import PeerlyButton from '@/shared/components/ui/PeerlyButton';
import { MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { logout } from '@/shared/store/auth';
import { router } from 'expo-router';
import { setRequestStatus, deleteRequest } from '@/features/requests/store/requestsStore';
import { useUsers } from '@/features/users/store/usersStore';
import type { RequestStatus } from '@/features/requests/data/types';
import StudySessionSchedulePlaceholder from '../components/StudySessionSchedulePlaceholder';

type RequestContext =
  | 'incoming'
  | 'outgoing'
  | 'active'
  | 'completed'
  | 'history'
  | undefined;

type Props = {
  userId: string;
  mode?: 'other' | 'self';
  requestContext?: RequestContext;
  requestId?: string;
};

export default function UserProfileScreen({
  userId,
  mode = 'other',
  requestContext,
  requestId,
}: Props) {
  const insets = useSafeAreaInsets();
  const users = useUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  const isSelf = mode === 'self';

  const isIncomingView = !isSelf && requestContext === 'incoming';
  const isActiveView = !isSelf && requestContext === 'active';
  const isOutgoingView = !isSelf && requestContext === 'outgoing';
  const isCompletedView = !isSelf && requestContext === 'completed';
  const isHistoryView = !isSelf && requestContext === 'history';

  const bottomBarHeight = useMemo(() => {
    // approximate heights for spacing the ScrollView content
    if (isSelf) return 88; // self actions row
    if (isActiveView) return 140; // actions row + complete button
    if (isIncomingView) return 88;
    if (isOutgoingView) return 88;
    if (isCompletedView) return 110; // actions row + label
    if (isHistoryView) return 88;
    return 88; // default (chat/request/offer)
  }, [isSelf, isActiveView, isIncomingView, isOutgoingView, isCompletedView, isHistoryView]);

  const withRequest = async (status: RequestStatus, cb?: () => void) => {
    if (!requestId) return;
    await setRequestStatus(requestId, status);
    cb?.();
  };

  const handleChat = () => {
    console.log('Chat from profile with', user.name, 'requestId:', requestId);
  };

  const handleAccept = () => withRequest('ACCEPTED', () => router.back());
  const handleDecline = () => withRequest('DECLINED', () => router.back());
  const handleCancel = () => withRequest('CANCELED', () => router.back());
  const handleDelete = async () => {
    if (!requestId) return;
    await deleteRequest(requestId);
    router.back();
  };

  const handleComplete = () => {
    console.log('Complete Clicked');
  };

  const handleSchedule = () => {
    if (!requestId) return;
    router.push({
      pathname: '/requests/schedule-session',
      params: { requestId },
    });
  };

  const bottomPad = 12 + insets.bottom;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: bottomBarHeight + bottomPad + 20,
          }}
        >
          <ProfileHeader user={user} showBack={!isSelf} />

          <ProfileSection title="About">
            <AboutText text={user.description} />
          </ProfileSection>

          <ProfileSection title="Strengths">
            <TagList items={user.strengths} />
          </ProfileSection>

          <ProfileSection title="Needs Help With">
            <TagList items={user.needs_help_with} />
          </ProfileSection>

          {(isActiveView || isCompletedView) && (
            <ProfileSection title="Study Session Schedule">
              <StudySessionSchedulePlaceholder />
            </ProfileSection>
          )}

          {isSelf && (
            <ProfileSection title={`Token(s): ${user.token_balance}`}>
              <View />
            </ProfileSection>
          )}
        </ScrollView>

        {/* SELF ACTIONS */}
        {isSelf && (
          <View style={[styles.selfActions, { paddingBottom: bottomPad }]}>
            <PeerlyButton
              title="Edit"
              backgroundColor="transparent"
              textColor={COLORS.textPrimary}
              borderColor={COLORS.textMuted}
              style={styles.halfButton}
              icon={<Feather name="edit-2" size={16} color={COLORS.textPrimary} />}
              onPress={() => router.push('/profile/edit')}
            />

            <PeerlyButton
              title="Logout"
              backgroundColor="transparent"
              textColor={COLORS.red}
              borderColor={COLORS.red}
              style={styles.halfButton}
              icon={<Feather name="log-out" size={16} color={COLORS.red} />}
              onPress={() => {
                logout();
                router.replace('/home');
              }}
            />
          </View>
        )}

        {/* INCOMING */}
        {!isSelf && isIncomingView && (
          <View style={[styles.bottomActions, { paddingBottom: bottomPad }]}>
            <View style={styles.actionsRow}>
              <PeerlyButton
                title="Chat"
                backgroundColor={COLORS.buttonBlack}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                icon={<MaterialIcons name="chat-bubble-outline" size={14} color={COLORS.textOnDark} />}
                onPress={handleChat}
              />
              <PeerlyButton
                title="Accept"
                backgroundColor={COLORS.buttonGreen}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                onPress={handleAccept}
              />
              <PeerlyButton
                title="Decline"
                backgroundColor={COLORS.red}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                onPress={handleDecline}
              />
            </View>
          </View>
        )}

        {/* ACTIVE */}
        {!isSelf && isActiveView && !isIncomingView && (
          <View style={[styles.bottomActions, { paddingBottom: bottomPad }]}>
            <View style={styles.actionsRow}>
              <PeerlyButton
                title="Chat"
                backgroundColor={COLORS.buttonBlack}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                icon={<MaterialIcons name="chat-bubble-outline" size={14} color={COLORS.textOnDark} />}
                onPress={handleChat}
              />
              <PeerlyButton
                title="Schedule"
                backgroundColor={COLORS.buttonYellow}
                textColor={COLORS.textPrimary}
                style={styles.actionButton}
                onPress={handleSchedule}
              />
              <PeerlyButton
                title="Cancel"
                backgroundColor={COLORS.red}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                onPress={handleCancel}
              />
            </View>

            <PeerlyButton
              title="Complete the Session"
              backgroundColor={COLORS.buttonGreen}
              textColor={COLORS.textOnDark}
              style={styles.completeButton}
              onPress={handleComplete}
            />
          </View>
        )}

        {/* OUTGOING */}
        {!isSelf && isOutgoingView && !isIncomingView && !isActiveView && (
          <View style={[styles.bottomActions, { paddingBottom: bottomPad }]}>
            <View style={styles.actionsRow}>
              <PeerlyButton
                title="Chat"
                backgroundColor={COLORS.buttonBlack}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                icon={<MaterialIcons name="chat-bubble-outline" size={14} color={COLORS.textOnDark} />}
                onPress={handleChat}
              />
              <PeerlyButton
                title="Cancel"
                backgroundColor={COLORS.red}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                onPress={handleCancel}
              />
            </View>
          </View>
        )}

        {/* COMPLETED */}
        {!isSelf && isCompletedView && !isIncomingView && !isActiveView && !isOutgoingView && (
          <View style={[styles.bottomActions, { paddingBottom: bottomPad }]}>
            <View style={styles.actionsRow}>
              <PeerlyButton
                title="Chat"
                backgroundColor={COLORS.buttonBlack}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                icon={<MaterialIcons name="chat-bubble-outline" size={14} color={COLORS.textOnDark} />}
                onPress={handleChat}
              />
              <PeerlyButton
                title="Schedule"
                backgroundColor={COLORS.searchBar}
                textColor={COLORS.textMuted}
                style={styles.actionButton}
                disabled
              />
              <PeerlyButton
                title="Cancel"
                backgroundColor={COLORS.searchBar}
                textColor={COLORS.textMuted}
                style={styles.actionButton}
                disabled
              />
            </View>
            <Text style={styles.completedText}>COMPLETED ✓</Text>
          </View>
        )}

        {/* HISTORY */}
        {!isSelf && isHistoryView && !isIncomingView && !isActiveView && !isOutgoingView && !isCompletedView && (
          <View style={[styles.bottomActions, { paddingBottom: bottomPad }]}>
            <View style={styles.actionsRow}>
              <PeerlyButton
                title="Delete"
                backgroundColor={COLORS.red}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                onPress={handleDelete}
              />
            </View>
          </View>
        )}

        {/* DEFAULT */}
        {!isSelf && !isIncomingView && !isActiveView && !isOutgoingView && !isCompletedView && !isHistoryView && (
          <View style={[styles.bottomActions, { paddingBottom: bottomPad }]}>
            <View style={styles.actionsRow}>
              <PeerlyButton
                title="Chat"
                backgroundColor={COLORS.buttonBlack}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                icon={<MaterialIcons name="chat-bubble-outline" size={14} color={COLORS.textOnDark} />}
                onPress={handleChat}
              />
              <PeerlyButton
                title="Request"
                backgroundColor={COLORS.buttonYellow}
                textColor={COLORS.textPrimary}
                style={styles.actionButton}
              />
              <PeerlyButton
                title="Offer"
                backgroundColor={COLORS.buttonGreen}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.background,
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionButton: {
    flex: 1,
    marginHorizontal: 2.5,
  },

  completeButton: {
    marginTop: 8,
  },

  completedText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.buttonGreen,
  },

  selfActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: COLORS.background,
  },

  halfButton: {
    flex: 1,
    marginHorizontal: 6,
  },
});