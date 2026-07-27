import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CURRICULUM, COURSES } from '../constants/data';

const STORAGE_KEY = '@readwell/v2';
const AppContext = createContext(null);

const XP_PER_LESSON = 50;
const XP_PER_PERFECT_QUIZ = 100;

export const initialState = {
  hydrated: false,
  user: null,                 // { name, email, avatar }
  isLoggedIn: false,
  isGuest: false,
  hasOnboarded: false,

  // onboarding selections
  language: null,
  goal: null,

  // learning
  activeCourseId: 'english',
  completedLessons: {},       // { [courseId]: string[] }
  lessonScores: {},           // { [lessonId]: { correct, total } }
  currentLessonId: null,

  // gamification
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  daysActive: 0,
  minutesLearned: 0,
  earnedBadges: [],
  dailyGoalMinutes: 30,
  todayMinutes: 0,

  // library
  wishlist: [],
  recentSearches: [],

  // commerce
  plan: 'free',               // 'free' | 'pro'
  subscription: null,         // { startedAt, nextBilling, method }
  paymentMethods: [],

  // prefs
  settings: {
    audioSupport: true,
    notifications: true,
    dailyReminder: true,
    reminderTime: '10:00 AM',
    readAloud: false,
    highContrast: false,
    textSize: 'Large',
  },

  notificationsRead: [],
};

function todayStr() {
  return new Date().toDateString();
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, hydrated: true };

    case 'HYDRATE_EMPTY':
      return { ...state, hydrated: true };

    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'SET_GOAL':
      return { ...state, goal: action.payload };

    case 'COMPLETE_ONBOARDING':
      return { ...state, hasOnboarded: true };

    case 'LOGIN':
      return { ...state, user: action.payload, isLoggedIn: true, isGuest: false };

    case 'CONTINUE_AS_GUEST':
      return { ...state, isGuest: true, isLoggedIn: false, user: { name: 'Guest' } };

    case 'LOGOUT':
      return {
        ...initialState,
        hydrated: true,
        hasOnboarded: state.hasOnboarded,
        language: state.language,
      };

    case 'UPDATE_PROFILE':
      return { ...state, user: { ...(state.user || {}), ...action.payload } };

    case 'SET_ACTIVE_COURSE':
      return { ...state, activeCourseId: action.payload };

    case 'START_LESSON':
      return { ...state, currentLessonId: action.payload };

    case 'COMPLETE_LESSON': {
      const { courseId, lessonId, minutes = 5, correct, total } = action.payload;
      const done = state.completedLessons[courseId] || [];
      const already = done.includes(lessonId);
      const nextDone = already ? done : [...done, lessonId];

      // streak
      const today = todayStr();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      let streak = state.streak;
      let daysActive = state.daysActive;
      let todayMinutes = state.todayMinutes;
      if (state.lastActiveDate !== today) {
        streak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
        daysActive = state.daysActive + 1;
        todayMinutes = 0;
      }

      const perfect = total > 0 && correct === total;
      const gainedXp = already ? 0 : XP_PER_LESSON + (perfect ? XP_PER_PERFECT_QUIZ : 0);

      return {
        ...state,
        completedLessons: { ...state.completedLessons, [courseId]: nextDone },
        lessonScores: total
          ? { ...state.lessonScores, [lessonId]: { correct, total } }
          : state.lessonScores,
        xp: state.xp + gainedXp,
        streak,
        daysActive,
        lastActiveDate: today,
        minutesLearned: state.minutesLearned + minutes,
        todayMinutes: todayMinutes + minutes,
      };
    }

    case 'AWARD_BADGE':
      if (state.earnedBadges.includes(action.payload)) return state;
      return { ...state, earnedBadges: [...state.earnedBadges, action.payload] };

    case 'TOGGLE_WISHLIST': {
      const id = action.payload;
      const has = state.wishlist.includes(id);
      return {
        ...state,
        wishlist: has ? state.wishlist.filter((w) => w !== id) : [...state.wishlist, id],
      };
    }

    case 'ADD_RECENT_SEARCH': {
      const q = String(action.payload || '').trim();
      if (!q) return state;
      const next = [q, ...state.recentSearches.filter((s) => s.toLowerCase() !== q.toLowerCase())];
      return { ...state, recentSearches: next.slice(0, 8) };
    }

    case 'CLEAR_RECENT_SEARCHES':
      return { ...state, recentSearches: [] };

    case 'ADD_PAYMENT_METHOD': {
      const exists = state.paymentMethods.some((m) => m.id === action.payload.id);
      return {
        ...state,
        paymentMethods: exists ? state.paymentMethods : [...state.paymentMethods, action.payload],
      };
    }

    case 'SUBSCRIBE': {
      const now = new Date();
      const next = new Date(now.getTime() + 30 * 86400000);
      return {
        ...state,
        plan: 'pro',
        subscription: {
          startedAt: now.toISOString(),
          nextBilling: next.toISOString(),
          method: action.payload?.method || null,
        },
      };
    }

    case 'CANCEL_SUBSCRIPTION':
      return { ...state, plan: 'free', subscription: null };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'MARK_NOTIFICATIONS_READ':
      return { ...state, notificationsRead: action.payload };

    case 'ADD_MINUTES':
      return {
        ...state,
        minutesLearned: state.minutesLearned + action.payload,
        todayMinutes: state.todayMinutes + action.payload,
      };

    default:
      return state;
  }
}

export function AppProvider({ children, seed }) {
  const [state, dispatch] = useReducer(reducer, seed ? { ...initialState, ...seed, hydrated: true } : initialState);

  // hydrate once
  useEffect(() => {
    if (seed) return;
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!alive) return;
        if (raw) {
          try {
            dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) });
          } catch {
            dispatch({ type: 'HYDRATE_EMPTY' });
          }
        } else {
          dispatch({ type: 'HYDRATE_EMPTY' });
        }
      })
      .catch(() => alive && dispatch({ type: 'HYDRATE_EMPTY' }));
    return () => { alive = false; };
  }, [seed]);

  // persist (skip the pre-hydration render so we never clobber saved state)
  useEffect(() => {
    if (!state.hydrated) return;
    const { ...persist } = state;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persist)).catch(() => {});
  }, [state]);

  /* ---------- derived selectors ---------- */

  const selectors = useMemo(() => {
    const courseProgress = (courseId) => {
      const curriculum = CURRICULUM[courseId];
      const course = COURSES.find((c) => c.id === courseId);
      const total = curriculum
        ? curriculum.modules.reduce((n, m) => n + m.lessons.length, 0)
        : (course?.totalLessons || 0);
      const done = (state.completedLessons[courseId] || []).length;
      return {
        done,
        total,
        percent: total ? Math.round((done / total) * 100) : 0,
      };
    };

    const nextLesson = (courseId) => {
      const curriculum = CURRICULUM[courseId];
      if (!curriculum) return null;
      const done = state.completedLessons[courseId] || [];
      for (const mod of curriculum.modules) {
        for (const lesson of mod.lessons) {
          if (!done.includes(lesson.id)) return { ...lesson, moduleId: mod.id, moduleTitle: mod.title };
        }
      }
      return null;
    };

    const isLessonUnlocked = (courseId, lessonId) => {
      const curriculum = CURRICULUM[courseId];
      if (!curriculum) return true;
      const done = state.completedLessons[courseId] || [];
      const flat = curriculum.modules.flatMap((m) => m.lessons.map((l) => l.id));
      const idx = flat.indexOf(lessonId);
      if (idx <= 0) return true;
      // unlocked if the previous lesson is done, or this one already is
      return done.includes(flat[idx - 1]) || done.includes(lessonId);
    };

    const level = Math.max(1, Math.floor(state.xp / 1000) + 1);
    const xpIntoLevel = state.xp % 1000;

    return { courseProgress, nextLesson, isLessonUnlocked, level, xpIntoLevel };
  }, [state.completedLessons, state.xp]);

  /* ---------- action helpers ---------- */

  const actions = useMemo(() => ({
    completeLesson: (payload) => {
      dispatch({ type: 'COMPLETE_LESSON', payload });
      // badge rules
      const done = (state.completedLessons[payload.courseId] || []).length + 1;
      if (done >= 1) dispatch({ type: 'AWARD_BADGE', payload: 'first-word' });
      if (state.streak + 1 >= 7) dispatch({ type: 'AWARD_BADGE', payload: 'streak-7' });
    },
    isPro: () => state.plan === 'pro',
  }), [state.completedLessons, state.streak, state.plan]);

  const value = useMemo(
    () => ({ state, dispatch, ...selectors, ...actions }),
    [state, selectors, actions]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
