// features/users/screens/UserProfileScreen.tsx
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { MOCK_USERS } from '@/features/home/data/mockUsers';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSection from '../components/ProfileSection';
import TagList from '../components/TagList';
import AboutText from '../components/AboutText';
import PeerlyButton from '@/shared/components/ui/PeerlyButton';
import { MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { logout } from '@/shared/store/auth';
import { router } from 'expo-router';
import {
  setRequestStatus,
  deleteRequest,
} from '@/features/requests/store/requestsStore';
import type { RequestStatus } from '@/features/requests/data/mockRequests';
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
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) return null;

  const isSelf = mode === 'self';

  const isIncomingView = !isSelf && requestContext === 'incoming';
  const isActiveView = !isSelf && requestContext === 'active';
  const isOutgoingView = !isSelf && requestContext === 'outgoing';
  const isCompletedView = !isSelf && requestContext === 'completed';
  const isHistoryView = !isSelf && requestContext === 'history';

  const backTo: Parameters<typeof router.replace>[0] =
    isSelf
      ? '/home'
      : requestContext
        ? '/requests'
        : '/home';

  const withRequest = (status: RequestStatus, cb?: () => void) => {
    if (!requestId) return;
    setRequestStatus(requestId, status);
    if (cb) cb();
  };

  const handleChat = () => {
    console.log('Chat from profile with', user.name, 'requestId:', requestId);
    // TODO: navigate to chat screen
  };

  const handleAccept = () => {
    withRequest('ACCEPTED', () => router.replace('/requests'));
  };

  const handleDecline = () => {
    withRequest('DECLINED', () => router.replace('/requests'));
  };

  const handleCancel = () => {
    withRequest('CANCELED', () => router.replace('/requests'));
  };

  const handleDelete = () => {
    if (!requestId) return;
    deleteRequest(requestId);
    router.replace('/requests');
  };

  const handleComplete = () => {
    console.log('Complete Clicked');
    // if both users click complete, proceed to:
    // withRequest('COMPLETED', () => router.replace('/requests'));
  };

  const handleSchedule = () => {
    if (!requestId) return;
    router.push({
      pathname: '/schedule-session',
      params: { requestId },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: isSelf ? 40 : 140,
          }}
        >
          <ProfileHeader user={user} showBack={!isSelf} backTo={backTo} />

          <ProfileSection title="About">
            <AboutText text={user.description} />
          </ProfileSection>

          <ProfileSection title="Strengths">
            <TagList items={user.strengths} />
          </ProfileSection>

          <ProfileSection title="Needs Help With">
            <TagList items={user.needs_help_with} />
          </ProfileSection>

          {/* Active + Completed sessions: Study Session Schedule placeholder */}
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

        {isSelf && (
          <View style={styles.selfActions}>
            <PeerlyButton
              title="Edit"
              backgroundColor="transparent"
              textColor={COLORS.textPrimary}
              borderColor={COLORS.textMuted}
              style={styles.halfButton}
              icon={
                <Feather
                  name="edit-2"
                  size={16}
                  color={COLORS.textPrimary}
                />
              }
              onPress={() => router.push('/edit')}
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

        {/* OTHER USER – INCOMING REQUEST VIEW: Chat / Accept / Decline */}
        {!isSelf && isIncomingView && (
          <View style={styles.bottomActions}>
            <View style={styles.actionsRow}>
              <PeerlyButton
                title="Chat"
                backgroundColor={COLORS.buttonBlack}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                icon={
                  <MaterialIcons
                    name="chat-bubble-outline"
                    size={14}
                    color={COLORS.textOnDark}
                  />
                }
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

        {/* OTHER USER – ACTIVE: Chat / Schedule / Cancel + Complete button */}
        {!isSelf && isActiveView && !isIncomingView && (
          <View style={styles.bottomActions}>
            <View style={styles.actionsRow}>
              <PeerlyButton
                title="Chat"
                backgroundColor={COLORS.buttonBlack}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                icon={
                  <MaterialIcons
                    name="chat-bubble-outline"
                    size={14}
                    color={COLORS.textOnDark}
                  />
                }
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

        {/* OTHER USER – OUTGOING: Chat / Cancel */}
        {!isSelf &&
          isOutgoingView &&
          !isIncomingView &&
          !isActiveView && (
            <View style={styles.bottomActions}>
              <View style={styles.actionsRow}>
                <PeerlyButton
                  title="Chat"
                  backgroundColor={COLORS.buttonBlack}
                  textColor={COLORS.textOnDark}
                  style={styles.actionButton}
                  icon={
                    <MaterialIcons
                      name="chat-bubble-outline"
                      size={14}
                      color={COLORS.textOnDark}
                    />
                  }
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

        {/* OTHER USER – COMPLETED:
            Same layout as Active, but Schedule/Cancel disabled + "COMPLETED ✓" label */}
        {!isSelf &&
          isCompletedView &&
          !isIncomingView &&
          !isActiveView &&
          !isOutgoingView && (
            <View style={styles.bottomActions}>
              <View style={styles.actionsRow}>
                <PeerlyButton
                  title="Chat"
                  backgroundColor={COLORS.buttonBlack}
                  textColor={COLORS.textOnDark}
                  style={styles.actionButton}
                  icon={
                    <MaterialIcons
                      name="chat-bubble-outline"
                      size={14}
                      color={COLORS.textOnDark}
                    />
                  }
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

        {/* OTHER USER – HISTORY (Canceled / Declined): Delete only */}
        {!isSelf &&
          isHistoryView &&
          !isIncomingView &&
          !isActiveView &&
          !isOutgoingView &&
          !isCompletedView && (
            <View style={styles.bottomActions}>
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

        {/* OTHER USER – DEFAULT VIEW: Chat / Request / Offer */}
        {!isSelf &&
          !isIncomingView &&
          !isActiveView &&
          !isOutgoingView &&
          !isCompletedView &&
          !isHistoryView && (
            <View style={styles.bottomActions}>
              <View style={styles.actionsRow}>
                <PeerlyButton
                  title="Chat"
                  backgroundColor={COLORS.buttonBlack}
                  textColor={COLORS.textOnDark}
                  style={styles.actionButton}
                  icon={
                    <MaterialIcons
                      name="chat-bubble-outline"
                      size={14}
                      color={COLORS.textOnDark}
                    />
                  }
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

  // Bottom area is a column so we can add multiple rows (e.g. Complete / Completed label)
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },

  // Row that lays out the main action buttons horizontally
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
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  halfButton: {
    flex: 1,
    marginHorizontal: 6,
  },
});