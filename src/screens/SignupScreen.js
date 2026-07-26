import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/colors';
import { InputField } from '../components/InputField';
import { PrimaryButton, TextButton } from '../components/Button';
import { useApp } from '../context/AppContext';

export default function SignupScreen({ navigation }) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch({ type: 'LOGIN', payload: { name, email } });
      navigation.replace('App');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your reading journey with ReadWell</Text>
        </View>

        <View style={styles.form}>
          <InputField label="Full Name" value={name} onChangeText={setName} placeholder="Enter your full name" icon="person-outline" autoCapitalize="words" error={errors.name} />
          <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" icon="mail-outline" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
          <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Create a password" icon="lock-closed-outline" secureTextEntry error={errors.password} />
          <InputField label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm your password" icon="lock-closed-outline" secureTextEntry error={errors.confirmPassword} />
          <PrimaryButton title="Create Account" onPress={handleSignup} loading={loading} style={styles.signupButton} />
        </View>

        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TextButton title="Sign In" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.xxxxl },
  header: { paddingTop: SPACING.xxxxl, marginBottom: SPACING.xxl },
  backButton: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  titleSection: { marginBottom: SPACING.xxxl },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 22 },
  form: { marginBottom: SPACING.xxl },
  signupButton: { marginTop: SPACING.sm },
  loginLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { color: COLORS.textSecondary, fontSize: 14 },
});
