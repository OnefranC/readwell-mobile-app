import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../theme';
import { Field, PrimaryButton, SecondaryButton, TextButton, Banner } from '../components/ui';
import { useApp } from '../context/AppContext';

const SOCIALS = [
  { id: 'facebook', label: 'Sign in with Facebook', icon: 'logo-facebook', bg: '#3B5BF5', fg: '#FFFFFF' },
  { id: 'google', label: 'Sign in with Google', icon: 'logo-google', bg: '#FFFFFF', fg: COLORS.textPrimary, border: true },
  { id: 'apple', label: 'Sign in with Apple', icon: 'logo-apple', bg: '#F6F8F9', fg: COLORS.textPrimary, border: true },
];

export default function SignInScreen({ navigation }) {
  const { dispatch } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = 'Enter your username or email';
    if (!password) e.password = 'Enter your password';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    setFormError('');
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // demo: any well-formed credential signs in
      const name = username.includes('@') ? username.split('@')[0] : username;
      dispatch({
        type: 'LOGIN',
        payload: { name: name.charAt(0).toUpperCase() + name.slice(1), email: username },
      });
      navigation.replace('Main');
    }, 1100);
  };

  const guest = () => {
    dispatch({ type: 'CONTINUE_AS_GUEST' });
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Welcome!</Text>

          {formError ? (
            <Banner tone="error" message={formError} style={{ marginBottom: SPACING.lg }} />
          ) : null}

          <Field
            value={username}
            onChangeText={(t) => { setUsername(t); if (errors.username) setErrors({ ...errors, username: null }); }}
            placeholder="Username"
            autoCapitalize="none"
            autoComplete="username"
            error={errors.username}
            testID="signin-username"
          />
          <Field
            value={password}
            onChangeText={(t) => { setPassword(t); if (errors.password) setErrors({ ...errors, password: null }); }}
            placeholder="Password"
            secureTextEntry
            autoComplete="password"
            error={errors.password}
            style={{ marginBottom: SPACING.sm }}
            testID="signin-password"
          />

          <TextButton
            title="Forgot Password"
            onPress={() => navigation.navigate('ForgotPassword')}
            color={COLORS.textPrimary}
            style={styles.forgot}
          />

          <PrimaryButton title="Sign in" onPress={submit} loading={loading} />

          <Text style={styles.or}>or</Text>

          <SecondaryButton
            title="Create Account"
            onPress={() => navigation.navigate('SignUp')}
            style={styles.createBtn}
          />

          <View style={styles.socials}>
            {SOCIALS.map((s) => (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                accessibilityLabel={s.label}
                onPress={submit}
                style={({ pressed }) => [
                  styles.social,
                  { backgroundColor: s.bg },
                  s.border && styles.socialBorder,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Ionicons name={s.icon} size={20} color={s.fg} style={styles.socialIcon} />
                <Text style={[styles.socialLabel, { color: s.fg }]}>{s.label}</Text>
              </Pressable>
            ))}
          </View>

          <TextButton
            title="Skip for Later"
            onPress={guest}
            color={COLORS.textSecondary}
            style={styles.skip}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFDFB' },
  scroll: { padding: SPACING.xl, paddingBottom: SPACING.huge },
  title: {
    ...TYPE.h1,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  forgot: { alignSelf: 'flex-start', marginBottom: SPACING.lg },
  or: { ...TYPE.body, color: COLORS.textSecondary, textAlign: 'center', marginVertical: SPACING.lg },
  createBtn: {
    backgroundColor: COLORS.primarySurfaceSoft,
    borderColor: COLORS.primary,
    borderWidth: 1.2,
  },
  socials: { marginTop: SPACING.xxl, gap: SPACING.md },
  social: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.lg,
  },
  socialBorder: { borderWidth: 1, borderColor: COLORS.border },
  socialIcon: { position: 'absolute', left: SPACING.lg },
  socialLabel: { ...TYPE.bodyLg, fontWeight: '600' },
  skip: { alignSelf: 'center', marginTop: SPACING.xxl },
});
