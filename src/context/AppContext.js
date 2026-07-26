import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@readwell_state';

const AppContext = createContext();

const initialState = {
  user: null,
  isLoggedIn: false,
  hasCompletedOnboarding: false,
  progress: {
    completedLessons: [],
    completedTopics: {},
    quizScores: {},
    wordsLearned: 0,
    streak: 0,
    lastActiveDate: null,
    timeSpent: 0,
  },
  settings: {
    notifications: true,
    soundEffects: true,
    darkMode: false,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    case 'LOGOUT':
      return { ...initialState, hasCompletedOnboarding: state.hasCompletedOnboarding };
    case 'COMPLETE_ONBOARDING':
      return { ...state, hasCompletedOnboarding: true };
    case 'COMPLETE_TOPIC': {
      const { lessonId, topicIndex } = action.payload;
      const current = state.progress.completedTopics[lessonId] || [];
      if (current.includes(topicIndex)) return state;
      const updatedTopics = { ...state.progress.completedTopics, [lessonId]: [...current, topicIndex] };
      return { ...state, progress: { ...state.progress, completedTopics: updatedTopics } };
    }
    case 'COMPLETE_LESSON': {
      const { lessonId } = action.payload;
      if (state.progress.completedLessons.includes(lessonId)) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          completedLessons: [...state.progress.completedLessons, lessonId],
          wordsLearned: state.progress.wordsLearned + (action.payload.words || 0),
        },
      };
    }
    case 'SAVE_QUIZ_SCORE': {
      const { lessonId, score, total } = action.payload;
      const existing = state.progress.quizScores[lessonId] || { best: 0, attempts: 0 };
      return {
        ...state,
        progress: {
          ...state.progress,
          quizScores: {
            ...state.progress.quizScores,
            [lessonId]: {
              best: Math.max(existing.best, score),
              attempts: existing.attempts + 1,
              lastScore: score,
              lastTotal: total,
            },
          },
        },
      };
    }
    case 'UPDATE_STREAK': {
      const today = new Date().toDateString();
      const lastActive = state.progress.lastActiveDate;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      let newStreak = state.progress.streak;
      if (lastActive === today) {
        return state;
      } else if (lastActive === yesterday) {
        newStreak = state.progress.streak + 1;
      } else {
        newStreak = 1;
      }
      return {
        ...state,
        progress: { ...state.progress, streak: newStreak, lastActiveDate: today },
      };
    }
    case 'ADD_TIME_SPENT':
      return {
        ...state,
        progress: { ...state.progress, timeSpent: state.progress.timeSpent + action.payload },
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'LOAD_STATE':
      return { ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        const saved = JSON.parse(raw);
        dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...saved } });
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
