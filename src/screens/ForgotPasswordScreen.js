import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView,
} from 'react-native';
import { COLORS, SPACING, TYPE } from '../theme';
import { Header, Field, PrimaryButton, TextButton, Icon3D } from '../components/ui';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!email.trim()) return setError('Enter your email address');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address');
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.root}>
        <Header title="Check your email" onBack={() => navigation.goBack()} />
        <View style={styles.done}>
          <View style={styles.iconWrap}>
            <Icon3D name="check" size={78} />
          </View>
          <Text style={styles.doneTitle}>Reset link sent</Text>
          <Text style={styles.doneMsg}>
            If an account exists for{'\n'}
            <Text style={styles.email}>{email}</Text>{'\n'}
            we've sent a link to reset your password.
          </Text>
          <PrimaryButton
            title="Back to Sign in"
            onPress={() => navigation.goBack()}
            style={styles.cta}
          />
          <TextButton
            title="Didn't get it? Send again"
            onPress={() => setSent(false)}
            color={COLORS.textSecondary}
            style={{ marginTop: SPACING.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Forgot Password" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.blurb}>
            Enter the email you signed up with and we'll send you a link to set a new password.
          </Text>
          <Field
            label="Email"
            value={email}
            onChangeText={(t) => { setEmail(t); setError(''); }}
            placeholder="you@example.com"
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />
          <PrimaryButton title="Send reset link" onPress={submit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl },
  blurb: { ...TYPE.bodyLg, color: COLORS.textSecondary, marginBottom: SPACING.xl, lineHeight: 23 },
  done: { flex: 1, alignItems: 'center', paddingHorizontal: SPACING.xl, paddingTop: SPACING.huge },
  iconWrap: {
    width: 128, height: 128, borderRadius: 64,
    backgroundColor: COLORS.successSurface,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  doneTitle: { ...TYPE.h1, color: COLORS.textPrimary, textAlign: 'center' },
  doneMsg: {
    ...TYPE.bodyLg, color: COLORS.textSecondary,
    textAlign: 'center', marginTop: SPACING.md, lineHeight: 24,
  },
  email: { color: COLORS.primary, fontWeight: '700' },
  cta: { alignSelf: 'stretch', marginTop: SPACING.xxl },
});
