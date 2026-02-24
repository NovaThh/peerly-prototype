import { View, ScrollView, StyleSheet } from 'react-native';
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

type Props = {
  userId: string;
  mode?: 'other' | 'self';
};

export default function UserProfileScreen({ userId, mode = 'other' }: Props) {
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) return null;

  const isSelf = mode === 'self';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: isSelf ? 40 : 120 }}>
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
              icon={<Feather name="edit-2" size={16} color={COLORS.textPrimary} />}
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

        {!isSelf && (
          <View style={styles.bottomActions}>
            <PeerlyButton
              title="Chat"
              backgroundColor={COLORS.buttonBlack}
              textColor={COLORS.textOnDark}
              style={styles.actionButton}
              icon={<MaterialIcons name="chat-bubble-outline" size={14} color={COLORS.textOnDark} />}
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
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  actionButton: { flex: 1, marginHorizontal: 2.5 },
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