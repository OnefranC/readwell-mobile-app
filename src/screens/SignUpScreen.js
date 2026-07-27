import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPE } from '../theme';
import { Field, PrimaryButton, TextButton, Header } from '../components/ui';
import { useApp } from '../context/AppContext';

const strengthOf = (pw) => {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
};
const LABELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const BARS = [COLORS.error, COLORS.error, COLORS.warning, COLORS.success, COLORS.success];

export default function SignUpScreen({ navigation }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };

  const strength = strengthOf(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Enter your full name';
    else if (form.name.trim().length < 2) e.name = 'Name is too short';

    if (!form.email.trim()) e.email = 'Enter your email';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';

    if (!form.password) e.password = 'Create a password';
    else if (form.password.length < 6) e.password = 'Use at least 6 characters';

    if (!form.confirm) e.confirm = 'Re-enter your password';
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match';

    if (!accepted) e.terms = 'Please accept the Terms to continue';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch({ type: 'LOGIN', payload: { name: form.name.trim(), email: form.email.trim() } });
      navigation.replace('Main');
    }, 1100);
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Create Account" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sub}>Start your reading journey with ReadWell.</Text>

          <Field
            label="Full Name"
            value={form.name}
            onChangeText={set('name')}
            placeholder="Enter your full name"
            icon="person-outline"
            autoCapitalize="words"
            error={errors.name}
          />
          <Field
            label="Email"
            value={form.email}
            onChangeText={set('email')}
            placeholder="you@example.com"
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Field
            label="Password"
            value={form.password}
            onChangeText={set('password')}
            placeholder="Create a password"
            icon="lock-closed-outline"
            secureTextEntry
            error={errors.password}
            style={{ marginBottom: SPACING.sm }}
          />

          {form.password ? (
            <View style={styles.strengthRow}>
              <View style={styles.bars}>
                {[0, 1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.bar,
                      { backgroundColor: i < strength ? BARS[strength] : COLORS.surfaceSunken },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.strengthLabel, { color: BARS[strength] }]}>{LABELS[strength]}</Text>
            </View>
          ) : null}

          <Field
            label="Confirm Password"
            value={form.confirm}
            onChangeText={set('confirm')}
            placeholder="Re-enter your password"
            icon="lock-closed-outline"
            secureTextEntry
            error={errors.confirm}
          />

          <Pressable
            onPress={() => { setAccepted((a) => !a); setErrors((e) => ({ ...e, terms: null })); }}
            style={styles.termsRow}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: accepted }}
            accessibilityLabel="Accept terms and privacy policy"
          >
            <View style={[styles.box, accepted && styles.boxOn]}>
              {accepted ? <Ionicons name="checkmark" size={14} color={COLORS.textInverse} /> : null}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </Pressable>
          {errors.terms ? <Text style={styles.termsError}>{errors.terms}</Text> : null}

          <PrimaryButton
            title="Create Account"
            onPress={submit}
            loading={loading}
            style={{ marginTop: SPACING.lg }}
          />

          <View style={styles.signinRow}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TextButton title="Sign In" onPress={() => navigation.goBack()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingBottom: SPACING.huge },
  sub: { ...TYPE.bodyLg, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg, gap: SPACING.md },
  bars: { flexDirection: 'row', gap: 4, flex: 1 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { ...TYPE.small, fontWeight: '600', minWidth: 62, textAlign: 'right' },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, marginTop: SPACING.xs },
  box: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 1.6,
    borderColor: COLORS.borderStrong, alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  boxOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  termsText: { ...TYPE.small, color: COLORS.textSecondary, flex: 1, lineHeight: 19 },
  link: { color: COLORS.primary, fontWeight: '600' },
  termsError: { ...TYPE.small, color: COLORS.error, marginTop: 6 },
  signinRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.xl },
  signinText: { ...TYPE.small, color: COLORS.textSecondary },
});
