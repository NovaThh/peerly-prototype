import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function PhotoActionSheet({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <Pressable style={styles.row} onPress={onClose}>
            <Text>Upload from Gallery</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row} onPress={onClose}>
            <Text>Camera</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.card, paddingVertical: 8 },
  row: { padding: 16 },
  divider: { height: 1, backgroundColor: '#E5E5E5' },
});