# ReadWell

Expo SDK 53 project (React Native 0.76.9, New Architecture enabled). A reading app for adult learners: multi-language courses, letter-tracing lessons, quizzes, gamified progress, and a Pro subscription.

## Commands

```bash
npm install             # install dependencies
npx expo start          # dev server (Metro)
npx expo start --android
npx expo start --ios
npx expo start --web
```

> `npm install` may fail on the `ngrok` postinstall in restricted networks.
> Use `npm install --ignore-scripts` if the binary download is blocked.

### Quality & tooling

```bash
npm run lint            # ESLint (flat config: eslint.config.mjs)
npm run lint:fix        # ESLint with --fix
npm run typecheck       # TypeScript tsc --noEmit
npm test                # Jest (jest-expo preset)
npm run generate-assets # Regenerate placeholder PNGs in assets/
```

## Structure

- `App.js` — root stack: entry flow → `Main` tabs → detail/commerce screens
- `src/theme/` — **single source of truth** for colour, spacing, radius, type, shadow
- `src/components/ui/` — design-system primitives (`Button`, `Field`, `Card`, `Chip`,
  `ProgressBar`, `Icon3D`, `Avatar`, `EmptyState`, `Banner`, `Skeleton`, `Header`)
- `src/components/` — composite overlays: `AchievementModal`, `ShareSheet`, `GooglePaySheet`
- `src/constants/data.js` — courses, curriculum, quizzes, badges, leaderboard, plans
- `src/context/AppContext.js` — reducer + AsyncStorage persistence + derived selectors
- `src/navigation/AppNavigator.js` — bottom tabs (Home / Learning / Wishlist / Achievement)
- `src/screens/` — 26 screens (see below)
- `assets/images/` — HD photography (hero, onboarding, course thumbnails)
- `assets/icons3d/` — 20 3D icons with real alpha channels

### Screen map

| Flow | Screens |
|---|---|
| Entry | Splash, Onboarding (3 steps), SignIn, SignUp, ForgotPassword |
| Tabs | Home, Learning, Wishlist, Achievements |
| Discovery | Search (browse / results / empty), CourseDetail |
| Learning | Curriculum, Lesson (tracing), Quiz, LessonComplete |
| Social | Leaderboard, Notifications |
| Account | Profile, EditProfile, Settings |
| Commerce | Plans, PaymentDetails, PaymentSuccess, ManageSubscription |

## Design system

Import everything from `src/theme`:

```js
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS } from '../theme';
```

- **Primary** deep teal `#0F766E` — buttons, headings, active tabs
- **Accent** turquoise `#2DD4BF` — XP, pills, selected toggles
- **Canvas** `#F6F8F9` with white cards
- Type scale runs `display → h1…h4 → bodyLg/body → small → caption`
- `src/constants/colors.js` is a deprecated re-export kept for compatibility

### 3D icons

`<Icon3D name="trophy" size={40} />` renders from `assets/icons3d/`. Available:
`book star medal target audio bolt cap pencil globe crown rocket lock check bell chat sun heart abc trophy flame`.

## State

`useApp()` exposes `{ state, dispatch, courseProgress, nextLesson, isLessonUnlocked, level, completeLesson }`.
State persists to AsyncStorage under `@readwell/v2`. Lessons unlock sequentially —
`isLessonUnlocked` gates on the previous lesson being complete.

## Edge cases covered

Empty wishlist / search / curriculum · locked Pro content · guest mode ·
form validation (email, Luhn card check, expiry, CVV, password strength) ·
declined payment (card ending `0000`) · offline & error banners · skeleton loaders ·
first-run zero states · accessibility labels and roles throughout.

## Gotchas

- Scaffolded manually (`create-expo-app` fails on this machine: Node v24 + WSL UNC path issue).
- Plain JS; TypeScript is typecheck-only (`allowJs`, no `.ts` files).
- `typedRoutes` experiment is off in `app.json`.
- Screenshots in `docs/screenshots/` are generated from source — see `docs/DESIGN.md`.
