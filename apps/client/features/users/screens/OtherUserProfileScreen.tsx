import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { MOCK_USERS } from '@/features/home/data/mockUsers';
import { Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import PeerlyButton from '@/shared/components/ui/PeerlyButton';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  userId: string;
};

export default function OtherUserProfileScreen({ userId }: Props) {
  const user = MOCK_USERS.find((u) => u.id === userId);

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Top Image Section */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: user.profile_image_url }} style={styles.image} />
            <View style={styles.overlay} />

            <Pressable
              style={styles.backButton}
              onPress={() => router.replace('/home')}
            >
              <Feather name="arrow-left" size={22} color="#fff" />
            </Pressable>

            <View style={styles.nameContainer}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.meta}>
                {user.education_level} - {user.major}
              </Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.sectionText}>{user.description}</Text>
          </View>

          {/* Strengths */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Strengths</Text>
            <View style={styles.tagContainer}>
              {user.strengths.map((s, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Needs Help */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Needs Help With</Text>
            <View style={styles.tagContainer}>
              {user.needs_help_with.map((s, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    height: 260,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  nameContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  name: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  meta: {
    color: '#fff',
    fontSize: 14,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  sectionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 2.5,
  },
});