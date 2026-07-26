# ReadWell

Expo SDK 53 project (React Native 0.76.9, New Architecture enabled). A reading app for adult learners with lessons, quizzes, and progress tracking.

## Commands

```bash
npm install             # install dependencies
npx expo start          # dev server (Metro)
npx expo start --android
npx expo start --ios
npx expo start --web
```

### Quality & tooling

```bash
npm run lint            # ESLint (flat config: eslint.config.js)
npm run lint:fix        # ESLint with --fix
npm run typecheck       # TypeScript tsc --noEmit (uses tsconfig.json)
npm test                # Jest (jest-expo preset)
npm run test:watch      # Jest watch mode
npm run test:coverage   # Jest with coverage report
npm run generate-assets # Regenerate placeholder PNGs in assets/
```

## Structure

- `App.js` — root component; StackNavigator wrapping auth flow + `AppNavigator`
- `index.js` — registers App via `registerRootComponent`
- `app.json` — Expo config (slug: `readwell`, bundle: `com.onefranc.readwell`)
- `assets/` — app icons & splash image (generated; regenerable via `npm run generate-assets`)
- `src/`
  - `components/` — `Button.js`, `Card.js`, `InputField.js`
  - `constants/` — `colors.js` (theme tokens), `data.js`, `lessons.js`
  - `context/` — `AppContext.js` (reducer + AsyncStorage persistence)
  - `hooks/` — (empty; reserved)
  - `navigation/` — `AppNavigator.js` (bottom tabs + detail/quiz stack)
  - `screens/` — Splash, Onboarding, Login, Signup, Home, Lessons, LessonDetail, Quiz, Progress, Profile
  - `utils/` — (reserved)
- `scripts/generate-assets.js` — generates placeholder PNGs (no native deps)
- `android/` — native Android project

## Configuration files

- `eslint.config.js` — ESLint flat config (React + React Native + hooks rules)
- `tsconfig.json` — self-contained JS-compatible config (allowJs, checkJs off); typecheck-only (no `.ts` files yet)
- `jsconfig.json` — editor IntelliSense for plain JS (no TS strictness)
- `jest.config.js` — Jest config using `jest-expo` preset
- `jest.setup.js` — Jest setup file (extend with `@testing-library/jest-native` if needed)
- `__mocks__/fileMock.js` — asset stub for Jest
- `babel.config.js` — `babel-preset-expo`

## Theme tokens

Brand color is teal `#0D9488` (see `src/constants/colors.js`). Spacing, radius, and shadow tokens are also exported there.

## Gotchas

- Scaffolded manually (`create-expo-app` fails on this machine: Node v24 + WSL UNC path issue).
- Plain JS with `@babel/core` + `babel-preset-expo`. TypeScript is available for typechecking/editing only (no `.ts` files yet); `tsconfig.json` is configured with `allowJs: true`.
- `typedRoutes` experiment is off in `app.json`.
- After running `npm install`, new dev deps (ESLint, Jest, TypeScript, jest-expo) will be added. The dev server will work without installing them, but `lint`/`test`/`typecheck` require `npm install` first.
