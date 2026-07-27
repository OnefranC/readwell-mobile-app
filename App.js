import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './src/context/AppContext';
import { COLORS } from './src/theme';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

import MainTabs from './src/navigation/AppNavigator';

import SearchScreen from './src/screens/SearchScreen';
import CourseDetailScreen from './src/screens/CourseDetailScreen';
import CurriculumScreen from './src/screens/CurriculumScreen';
import LessonScreen from './src/screens/LessonScreen';
import QuizScreen from './src/screens/QuizScreen';
import LessonCompleteScreen from './src/screens/LessonCompleteScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PlansScreen from './src/screens/PlansScreen';
import PaymentDetailsScreen from './src/screens/PaymentDetailsScreen';
import PaymentSuccessScreen from './src/screens/PaymentSuccessScreen';
import ManageSubscriptionScreen from './src/screens/ManageSubscriptionScreen';

const RootStack = createStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.surface,
    primary: COLORS.primary,
    text: COLORS.textPrimary,
    border: COLORS.border,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <RootStack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false, cardStyle: { backgroundColor: COLORS.background } }}
          >
            {/* entry */}
            <RootStack.Screen name="Splash" component={SplashScreen} />
            <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
            <RootStack.Screen name="SignIn" component={SignInScreen} />
            <RootStack.Screen name="SignUp" component={SignUpScreen} />
            <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

            {/* app shell */}
            <RootStack.Screen name="Main" component={MainTabs} />

            {/* discovery + learning */}
            <RootStack.Screen name="Search" component={SearchScreen} />
            <RootStack.Screen name="CourseDetail" component={CourseDetailScreen} />
            <RootStack.Screen name="Curriculum" component={CurriculumScreen} />
            <RootStack.Screen name="Lesson" component={LessonScreen} />
            <RootStack.Screen name="Quiz" component={QuizScreen} />
            <RootStack.Screen name="LessonComplete" component={LessonCompleteScreen} />
            <RootStack.Screen name="Leaderboard" component={LeaderboardScreen} />

            {/* account */}
            <RootStack.Screen name="Notifications" component={NotificationsScreen} />
            <RootStack.Screen name="Profile" component={ProfileScreen} />
            <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
            <RootStack.Screen name="Settings" component={SettingsScreen} />

            {/* commerce */}
            <RootStack.Screen name="Plans" component={PlansScreen} />
            <RootStack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
            <RootStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
            <RootStack.Screen name="ManageSubscription" component={ManageSubscriptionScreen} />
          </RootStack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
