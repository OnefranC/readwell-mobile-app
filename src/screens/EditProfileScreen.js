import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPE } from '../theme';
import { Header, Field, PrimaryButton, Avatar, Banner } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function EditProfileScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.user?.name || '');
  const [email, setEmail] = useState(state.user?.email || '');
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const save = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name cannot be empty';
    if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email address';
    setErrors(e);
    if (Object.keys(e).length) return;

    dispatch({ type: 'UPDATE_PROFILE', payload: { name: name.trim(), email: email.trim() } });
    setSaved(true);
    setTimeout(() => navigation.goBack(), 700);
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Edit Profile" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {saved ? (
            <Banner tone="success" message="Profile updated" style={{ marginBottom: SPACING.lg }} />
          ) : null}

          <View style={styles.avatarRow}>
            <View>
              <Avatar name={name || 'L'} uri={state.user?.avatar} size={96} />
              <Pressable
                style={styles.camera}
                accessibilityRole="button"
                accessibilityLabel="Change photo"
              >
                <Ionicons name="camera" size={15} color={COLORS.textInverse} />
              </Pressable>
            </View>
            <Text style={styles.avatarHint}>Tap the camera to change your photo</Text>
          </View>

          <Field
            label="Full Name"
            value={name}
            onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: null })); }}
            placeholder="Your name"
            icon="person-outline"
            autoCapitalize="words"
            error={errors.name}
          />
          <Field
            label="Email"
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: null })); }}
            placeholder="you@example.com"
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            hint="Used for sign-in and reminders"
          />

          <PrimaryButton title="Save changes" onPress={save} style={{ marginTop: SPACING.md }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingBottom: SPACING.huge },
  avatarRow: { alignItems: 'center', marginBottom: SPACING.xxl },
  camera: {
    position: 'absolute', bottom: 0, right: 0,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: COLORS.background,
  },
  avatarHint: { ...TYPE.small, color: COLORS.textSecondary, marginTop: SPACING.md },
});
