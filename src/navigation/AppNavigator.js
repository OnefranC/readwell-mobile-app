import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import LearningScreen from '../screens/LearningScreen';
import WishlistScreen from '../screens/WishlistScreen';
import AchievementsScreen from '../screens/AchievementsScreen';

const Tab = createBottomTabNavigator();

const TAB_META = {
  Home: { icon: 'home-outline', active: 'home', label: 'Home' },
  Learning: { icon: 'play-circle-outline', active: 'play-circle', label: 'Learning' },
  Wishlist: { icon: 'heart-outline', active: 'heart', label: 'Wishlist' },
  Achievements: { icon: 'person-outline', active: 'person', label: 'Achievement' },
};

/** Custom tab bar so the active pill matches the Figma treatment. */
function TabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.bar}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TAB_META[route.name] || { icon: 'ellipse-outline', label: route.name };
        const { options } = descriptors[route.key];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={meta.label}
            testID={options.tabBarTestID}
          >
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Ionicons
                name={focused ? meta.active : meta.icon}
                size={22}
                color={focused ? COLORS.primary : COLORS.textSecondary}
              />
            </View>
            <Text
              style={[styles.label, focused && styles.labelActive]}
              numberOfLines={1}
            >
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Learning" component={LearningScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.sm,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxl : SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  iconWrap: {
    width: 46, height: 30, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: COLORS.primarySurface },
  label: { ...TYPE.caption, color: COLORS.textSecondary, fontSize: 11 },
  labelActive: { color: COLORS.primary },
});
