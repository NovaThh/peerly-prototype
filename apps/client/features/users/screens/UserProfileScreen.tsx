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
import { setRequestStatus, deleteRequest, setRequestSchedule, findRequest, useRequests } from '@/features/requests/store/requestsStore';
import { useUsers } from '@/features/users/store/usersStore';
import { addRequest, hasPendingBetween } from '@/features/requests/store/requestsStore';
import { createRequest } from '@/features/requests/helper/createRequest';
import type { RequestStatus } from '@/features/requests/data/types';
import StudySessionSchedulePlaceholder from '../components/StudySessionSchedulePlaceholder';
import { getLoggedInUserId } from '@/shared/store/auth';
import { Alert } from 'react-native';
import SubjectPickerModal from '@/features/requests/components/SubjectPickerModal';
import { useState } from 'react';
import { requireAuth } from '@/shared/utils/requireAuth';
import { Share } from 'react-native';

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

  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [pendingType, setPendingType] = useState<'REQUEST' | 'OFFER' | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const subjectOptions = useMemo(() => {
    if (!pendingType) return [];
    return pendingType === 'REQUEST' ? user.strengths : user.needs_help_with;
  }, [pendingType, user.strengths, user.needs_help_with]);

  const handleChat = () => {
    const me = requireAuth();
    if (!me) return;
    console.log('To be implemented ... Chat from profile with', user.name);
  };

  const handleAccept = () => {
    const me = requireAuth();
    if (!me) return;
    withRequest('ACCEPTED', () => router.back());
  };
  const handleDecline = () => withRequest('DECLINED', () => router.back());
  const handleCancel = () => withRequest('CANCELED', () => router.back());
  const handleDelete = async () => {
    if (!requestId) return;
    await deleteRequest(requestId);
    router.back();
  };

  const handleComplete = async () => {
    //TODO: for final product, we need both users to complete
    await withRequest('COMPLETED', () => router.back());
  };

  const handleSchedule = () => {
    if (!requestId) return;
    router.push({
      pathname: '/requests/schedule-session',
      params: { requestId },
    });
  };

  const me = getLoggedInUserId();

  const handleSend = async (type: 'REQUEST' | 'OFFER') => {
    if (!me) {
      router.push('/login');
      return;
    }

    if (me === userId) return; // can't request yourself

    // optional duplicate prevention
    if (hasPendingBetween?.(me, userId, type)) {
      Alert.alert('Already sent', 'You already have a pending invitation with this user.');
      return;
    }

    const newReq = createRequest({
      requesterId: me,
      receiverId: userId,
      type,
      subject: 'General', // later you can let user choose
    });

    await addRequest(newReq);

    // Take sender to Requests tab (optional but makes it feel like it worked)
    router.push('/requests');
  };

  const bottomPad = 12 + insets.bottom;

  const handleShareProfile = async () => {
    try {
      //TODO: uncomment this once we have an official domain from Jan Willem, now its google :D
      // const profileUrl = `https://peerly.saxion.online/users/${user.id}`;
      const profileUrl = `https://google.com`;

      await Share.share({
        message: `Hey! Connect with me on Peerly to exchange academic knowledge.\n\n${profileUrl}`,
        title: `Peerly profile - ${user.name}`,
      });
    } catch (error) {
      console.log('Share error', error);
    }
  };

  const requests = useRequests();

  const currentRequest = useMemo(() => {
    if (!requestId) return null;
    return requests.find((r) => r.id === requestId) ?? null;
  }, [requests, requestId]);

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
              <StudySessionSchedulePlaceholder scheduledDatetime={currentRequest?.scheduled_datetime} />
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
          <View style={[styles.selfActions, { paddingBottom: 20 }]}>
            <PeerlyButton
              title="Share"
              backgroundColor="transparent"
              textColor={COLORS.textPrimary}
              borderColor={COLORS.textMuted}
              style={styles.thirdButton}
              icon={<Feather name="share" size={16} color={COLORS.textPrimary} />}
              onPress={handleShareProfile}
            />
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
                onPress={() => {
                  const me = requireAuth();
                  if (!me) return;
                  setPendingType('REQUEST');
                  setSelectedSubject(null);
                  setSubjectModalOpen(true);
                }}
              />

              <PeerlyButton
                title="Offer"
                backgroundColor={COLORS.buttonGreen}
                textColor={COLORS.textOnDark}
                style={styles.actionButton}
                onPress={() => {
                  const me = requireAuth();
                  if (!me) return;
                  setPendingType('OFFER');
                  setSelectedSubject(null);
                  setSubjectModalOpen(true);
                }}
              />
            </View>
          </View>
        )}
      </View>
      <SubjectPickerModal
        visible={subjectModalOpen}
        title={
          pendingType === 'REQUEST'
            ? 'Pick a subject to request help with'
            : 'Pick a subject to offer help with'
        }
        options={subjectOptions}
        selected={selectedSubject}
        onSelect={setSelectedSubject}
        onClose={() => setSubjectModalOpen(false)}
        confirmLabel={pendingType === 'REQUEST' ? 'Send Request' : 'Send Offer'}
        onConfirm={async () => {
          const me = getLoggedInUserId();
          if (!me || !pendingType || !selectedSubject) return;

          if (me === userId) return;

          await addRequest(
            createRequest({
              requesterId: me,
              receiverId: userId,
              type: pendingType,
              subject: selectedSubject,
            })
          );

          setSubjectModalOpen(false);
          router.push('/requests');
        }}
      />
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

  thirdButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});