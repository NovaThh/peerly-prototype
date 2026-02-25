import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';

import { COLORS } from '@/constants/theme';
import PeerlyButton from '@/shared/components/ui/PeerlyButton';
import {
  setRegisterCredentials,
} from '@/features/auth/store/registerStore';

function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Name is required.';
  if (!/^[A-Za-z ]+$/.test(trimmed)) {
    return 'Name can only contain letters and spaces.';
  }
  if (trimmed.length < 2) {
    return 'Name must be at least 2 characters.';
  }
  if (!/[aeiouAEIOU]/.test(trimmed)) {
    return 'Name must contain at least one vowel.';
  }
  return null;
}

function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Email is required.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(trimmed)) return 'Please enter a valid email address.';
  return null;
}

export default function RegisterCredentialsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const handleNext = () => {
    let hasError = false;

    const nErr = validateName(name);
    setNameError(nErr);
    if (nErr) hasError = true;

    const eErr = validateEmail(email);
    setEmailError(eErr);
    if (eErr) hasError = true;

    if (!password.trim()) {
      setPasswordError('Password is required.');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (!confirm.trim()) {
      setConfirmError('Please confirm your password.');
      hasError = true;
    } else if (confirm !== password) {
      setConfirmError('Passwords do not match.');
      hasError = true;
    } else {
      setConfirmError(null);
    }

    if (hasError) return;

    setRegisterCredentials({ name, email, password });
    router.push('/register/photo');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Back */}
        <Pressable
          onPress={() => router.replace('/login')}
          style={styles.back}
        >
          <Feather
            name="arrow-left"
            size={22}
            color={COLORS.textPrimary}
          />
        </Pressable>

        <Text style={styles.title}>Register</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={name}
            onChangeText={(v) => {
              setName(v);
              setNameError(null);
            }}
            placeholder="Value"
            style={styles.input}
          />
          {nameError && <Text style={styles.error}>{nameError}</Text>}

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setEmailError(null);
            }}
            placeholder="Value"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          {emailError && <Text style={styles.error}>{emailError}</Text>}

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              setPasswordError(null);
            }}
            placeholder="Value"
            secureTextEntry
            style={styles.input}
          />
          {passwordError && (
            <Text style={styles.error}>{passwordError}</Text>
          )}

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            value={confirm}
            onChangeText={(v) => {
              setConfirm(v);
              setConfirmError(null);
            }}
            placeholder="Value"
            secureTextEntry
            style={styles.input}
          />
          {confirmError && (
            <Text style={styles.error}>{confirmError}</Text>
          )}

          <PeerlyButton
            title="Next"
            backgroundColor={COLORS.buttonGreen}
            textColor={COLORS.textOnDark}
            onPress={handleNext}
            style={{ marginTop: 10 }}
          />

          <Pressable onPress={() => router.replace('/login')}>
            <Text style={styles.link}>Login here →</Text>
          </Pressable>
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
  container: {
    flex: 1,
    padding: 20,
  },
  back: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 40,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  label: {
    color: COLORS.textPrimary,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  error: {
    color: COLORS.red,
    marginBottom: 8,
    fontSize: 13,
  },
  link: {
    textAlign: 'center',
    marginTop: 15,
    color: COLORS.textPrimary,
    textDecorationLine: 'underline',
  },
});