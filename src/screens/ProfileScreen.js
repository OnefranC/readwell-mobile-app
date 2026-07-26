import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/colors';
import { useApp } from '../context/AppContext';

export default function ProfileScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const { user, settings } = state;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => { dispatch({ type: 'LOGOUT' }); navigation.replace('Login'); } },
    ]);
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Edit Profile', screen: null },
    { icon: 'notifications-outline', title: 'Notifications', toggle: true, value: settings.notifications, onValueChange: (v) => dispatch({ type: 'UPDATE_SETTINGS', payload: { notifications: v } }) },
    { icon: 'volume-high-outline', title: 'Sound Effects', toggle: true, value: settings.soundEffects, onValueChange: (v) => dispatch({ type: 'UPDATE_SETTINGS', payload: { soundEffects: v } }) },
    { icon: 'moon-outline', title: 'Dark Mode', toggle: true, value: settings.darkMode, onValueChange: (v) => dispatch({ type: 'UPDATE_SETTINGS', payload: { darkMode: v } }) },
    { icon: 'help-circle-outline', title: 'Help & Support', screen: null },
    { icon: 'document-text-outline', title: 'Terms of Service', screen: null },
    { icon: 'shield-checkmark-outline', title: 'Privacy Policy', screen: null },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Profile</Text>
        </Animated.View>

        <Animated.View style={[styles.profileCard, SHADOWS.md, { opacity: fadeAnim }]}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.profileName}>{user?.name || 'Learner'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'learner@readwell.com'}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.menuSection, { opacity: fadeAnim }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon} size={22} color={COLORS.primary} />
                </View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              {item.toggle ? (
                <Switch value={item.value} onValueChange={item.onValueChange} trackColor={{ false: COLORS.border, true: COLORS.primaryLight }} thumbColor={item.value ? COLORS.primary : COLORS.textTertiary} />
              ) : (
                <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View style={[styles.dangerSection, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.version}>ReadWell v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxxxxl, paddingBottom: SPACING.xl },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary },
  profileCard: { marginHorizontal: SPACING.xxl, backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.xl, padding: SPACING.xxl, alignItems: 'center', marginBottom: SPACING.xxxl },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.primarySurface, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  profileName: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  profileEmail: { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  editButton: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.primary },
  editButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  menuSection: { marginHorizontal: SPACING.xxl, backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.lg, marginBottom: SPACING.xxxl, ...SHADOWS.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.lg, paddingHorizontal: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  menuIcon: { width: 36, height: 36, borderRadius: RADIUS.sm, backgroundColor: COLORS.primarySurface, alignItems: 'center', justifyContent: 'center' },
  menuItemTitle: { fontSize: 16, fontWeight: '500', color: COLORS.textPrimary },
  dangerSection: { marginHorizontal: SPACING.xxl, marginBottom: SPACING.xxl },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg, backgroundColor: COLORS.errorSurface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.error + '30' },
  logoutText: { fontSize: 16, fontWeight: '600', color: COLORS.error },
  version: { textAlign: 'center', fontSize: 13, color: COLORS.textTertiary },
});
