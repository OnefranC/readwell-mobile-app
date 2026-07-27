/* ReadWell content model — courses, curriculum, gamification, commerce. */

export const IMAGES = {
  heroLiteracy: require('../../assets/images/hero-literacy.jpg'),
  onboardingWelcome: require('../../assets/images/onboarding-welcome.jpg'),
  splashLibrary: require('../../assets/images/splash-library.jpg'),
  courseEnglish: require('../../assets/images/course-english.jpg'),
  courseSpanish: require('../../assets/images/course-spanish.jpg'),
  courseSwahili: require('../../assets/images/course-swahili.jpg'),
  courseWriting: require('../../assets/images/course-writing.jpg'),
};

/* ---------------- Onboarding ---------------- */

export const LANGUAGES = [
  { id: 'en', name: 'English', image: IMAGES.courseEnglish },
  { id: 'es', name: 'Spanish', image: IMAGES.courseSpanish },
  { id: 'hi', name: 'Hindi', image: IMAGES.courseWriting },
  { id: 'sw', name: 'Swahili', image: IMAGES.courseSwahili },
];

export const GOALS = [
  { id: 'work', title: 'Read for Work', subtitle: 'To get a better job', icon3d: 'target', tint: 'blue' },
  { id: 'family', title: 'Read for Family', subtitle: 'To read to my kids', icon3d: 'star', tint: 'teal' },
  { id: 'fun', title: 'Read for Fun', subtitle: 'To enjoy stories', icon3d: 'sun', tint: 'gold' },
  { id: 'others', title: 'Read for Others', subtitle: 'To help my community', icon3d: 'heart', tint: 'pink' },
];

/* ---------------- Courses ---------------- */

export const COURSES = [
  {
    id: 'english',
    title: 'English: The Basics',
    language: 'English',
    image: IMAGES.courseEnglish,
    tagline: 'Embark on a transformative journey of language mastery with our comprehensive English course.',
    author: 'Avia College',
    rating: 4.8,
    students: 48000,
    ratings: 568,
    updated: '6/2023',
    captions: 'English [Auto]',
    price: 21000,
    currency: '₦',
    free: true,
    level: 'Beginner',
    totalLessons: 24,
  },
  {
    id: 'spanish',
    title: 'Spanish: First Steps',
    language: 'Spanish',
    image: IMAGES.courseSpanish,
    tagline: 'Build everyday Spanish reading confidence, one short lesson at a time.',
    author: 'Avia College',
    rating: 4.6,
    students: 21400,
    ratings: 302,
    updated: '3/2024',
    captions: 'Spanish [Auto]',
    price: 18000,
    currency: '₦',
    free: false,
    level: 'Beginner',
    totalLessons: 18,
  },
  {
    id: 'writing',
    title: 'Writing: The Basics',
    language: 'English',
    image: IMAGES.courseWriting,
    tagline: 'Form letters, join words and write your first sentences with confidence.',
    author: 'Avia College',
    rating: 4.7,
    students: 15900,
    ratings: 244,
    updated: '1/2024',
    captions: 'English [Auto]',
    price: 15000,
    currency: '₦',
    free: false,
    level: 'Beginner',
    totalLessons: 16,
  },
  {
    id: 'swahili',
    title: 'Swahili: My First Letters',
    language: 'Swahili',
    image: IMAGES.courseSwahili,
    tagline: 'Start reading Swahili with interactive letter and sound practice.',
    author: 'Avia College',
    rating: 4.5,
    students: 8600,
    ratings: 129,
    updated: '5/2024',
    captions: 'Swahili [Auto]',
    price: 15000,
    currency: '₦',
    free: false,
    level: 'Beginner',
    totalLessons: 14,
  },
];

/* ---------------- Curriculum ---------------- */

const letterLesson = (n, letter, mins, word, icon) => ({
  id: `1.${n}`,
  title: `Lesson 1.${n}: Letter ${letter}`,
  letter,
  duration: `${mins} mins`,
  word,
  icon,
});

export const CURRICULUM = {
  english: {
    courseId: 'english',
    title: 'English Language',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: The Alphabet',
        summary: '6 Lessons • 30 mins',
        lessons: [
          letterLesson(0, 'A', 5, 'Apple', 'apple'),
          letterLesson(2, 'B', 8, 'Ball', 'ball'),
          letterLesson(3, 'C', 4, 'Cat', 'cat'),
          letterLesson(4, 'D', 5, 'Dog', 'dog'),
          letterLesson(5, 'E', 5, 'Egg', 'egg'),
          letterLesson(6, 'F', 3, 'Fish', 'fish'),
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Vowel Sounds',
        summary: '6 Lessons • 35 mins',
        lessons: [
          { id: '2.1', title: 'Lesson 2.1: Short A', duration: '6 mins', letter: 'A', word: 'Cat' },
          { id: '2.2', title: 'Lesson 2.2: Short E', duration: '6 mins', letter: 'E', word: 'Bed' },
          { id: '2.3', title: 'Lesson 2.3: Short I', duration: '5 mins', letter: 'I', word: 'Sit' },
          { id: '2.4', title: 'Lesson 2.4: Short O', duration: '6 mins', letter: 'O', word: 'Hot' },
          { id: '2.5', title: 'Lesson 2.5: Short U', duration: '6 mins', letter: 'U', word: 'Cup' },
          { id: '2.6', title: 'Lesson 2.6: Review', duration: '6 mins', letter: 'A', word: 'Sun' },
        ],
      },
      {
        id: 'm3',
        title: 'Module 3: Sight Words',
        summary: '6 Lessons • 30 mins',
        lessons: [
          { id: '3.1', title: 'Lesson 3.1: the, and, is', duration: '5 mins', word: 'The' },
          { id: '3.2', title: 'Lesson 3.2: you, are, for', duration: '5 mins', word: 'You' },
          { id: '3.3', title: 'Lesson 3.3: have, with', duration: '5 mins', word: 'Have' },
          { id: '3.4', title: 'Lesson 3.4: from, they', duration: '5 mins', word: 'From' },
          { id: '3.5', title: 'Lesson 3.5: what, when', duration: '5 mins', word: 'What' },
          { id: '3.6', title: 'Lesson 3.6: Review', duration: '5 mins', word: 'Read' },
        ],
      },
      {
        id: 'm4',
        title: 'Module 4: Everyday Reading',
        summary: '6 Lessons • 40 mins',
        lessons: [
          { id: '4.1', title: 'Lesson 4.1: Signs', duration: '7 mins', word: 'Exit' },
          { id: '4.2', title: 'Lesson 4.2: Menus', duration: '7 mins', word: 'Menu' },
          { id: '4.3', title: 'Lesson 4.3: Labels', duration: '6 mins', word: 'Label' },
          { id: '4.4', title: 'Lesson 4.4: Forms', duration: '7 mins', word: 'Form' },
          { id: '4.5', title: 'Lesson 4.5: Messages', duration: '6 mins', word: 'Text' },
          { id: '4.6', title: 'Lesson 4.6: Review', duration: '7 mins', word: 'Done' },
        ],
      },
    ],
  },
};

/* Quiz bank keyed by module. */
export const QUIZZES = {
  m1: [
    {
      id: 'q1',
      prompt: 'Match the picture to the word',
      image: 'apple',
      options: ['Ant', 'Apple', 'Arrow', 'Axe'],
      correct: 1,
    },
    {
      id: 'q2',
      prompt: 'Which letter does "Ball" start with?',
      options: ['A', 'B', 'D', 'P'],
      correct: 1,
    },
    {
      id: 'q3',
      prompt: 'How many letters are in the English alphabet?',
      options: ['24', '26', '28', '30'],
      correct: 1,
    },
    {
      id: 'q4',
      prompt: 'Which letter comes after C?',
      options: ['B', 'D', 'E', 'F'],
      correct: 1,
    },
    {
      id: 'q5',
      prompt: 'Which word starts with the letter F?',
      options: ['Dog', 'Egg', 'Fish', 'Cat'],
      correct: 2,
    },
  ],
};

/* ---------------- Search ---------------- */

export const SEARCH_CATEGORIES = [
  { id: 'letters', label: 'Letters', icon3d: 'abc', bg: '#E7EFFE' },
  { id: 'words', label: 'Words', icon3d: 'chat', bg: '#E6F9ED' },
  { id: 'stories', label: 'Stories', icon3d: 'book', bg: '#F1EAFE' },
  { id: 'daily', label: 'Daily Life', icon3d: 'sun', bg: '#FFEDE4' },
];

export const SEARCH_INDEX = [
  {
    id: 's1', title: 'Learning the ABCs', kind: 'Book', duration: '5 mins',
    language: 'ENGLISH', level: 'Level 1', image: IMAGES.courseEnglish,
    cta: 'Start', ctaIcon: 'play', type: 'books',
  },
  {
    id: 's2', title: 'Alphabet Sounds', kind: 'Audio Lesson', duration: '8 mins',
    language: 'ENGLISH', level: 'Level 1', image: IMAGES.courseEnglish,
    cta: 'Start', ctaIcon: 'headset', type: 'audio',
  },
  {
    id: 's3', title: 'My First Letters', kind: 'Interactive', duration: '10 mins',
    language: 'SWAHILI', level: 'Level 1', image: IMAGES.courseSwahili,
    cta: 'Start', ctaIcon: 'hand-left', type: 'lessons',
  },
  {
    id: 's4', title: 'My First Words', kind: 'Book', duration: '5 mins',
    language: 'ENGLISH', level: 'Level 1', image: IMAGES.courseEnglish,
    cta: 'Start', ctaIcon: 'play', type: 'books',
  },
  {
    id: 's5', title: 'Everyday Signs', kind: 'Lesson', duration: '6 mins',
    language: 'ENGLISH', level: 'Level 2', image: IMAGES.courseWriting,
    cta: 'Start', ctaIcon: 'play', type: 'lessons',
  },
  {
    id: 's6', title: 'Spanish Basics', kind: 'Book', duration: '7 mins',
    language: 'SPANISH', level: 'Level 1', image: IMAGES.courseSpanish,
    cta: 'Start', ctaIcon: 'play', type: 'books',
  },
];

export const SEARCH_FILTERS = ['All', 'Books', 'Lessons', 'Audio'];

/* ---------------- Gamification ---------------- */

export const BADGES = [
  { id: 'first-word', title: 'First Word', icon3d: 'book', tint: '#E6F9ED', requirement: 'Finish your first lesson' },
  { id: 'streak-7', title: '7 Day Streak', icon3d: 'flame', tint: '#FFEDE4', requirement: 'Learn 7 days in a row' },
  { id: 'explorer', title: 'Language Explorer', icon3d: 'globe', tint: '#E7EFFE', requirement: 'Try two languages' },
  { id: 'read-10', title: 'Read 10 Books', icon3d: 'book', tint: '#F1F3F5', requirement: 'Finish 10 books' },
  { id: 'writing-pro', title: 'Writing Pro', icon3d: 'pencil', tint: '#F1F3F5', requirement: 'Finish the writing course' },
  { id: 'graduate', title: 'Graduate Lvl 1', icon3d: 'cap', tint: '#F1F3F5', requirement: 'Complete Level 1' },
];

export const LEADERBOARD = [
  { id: 'u1', name: 'Sarah J.', tagline: 'Reading Enthusiast', xp: 12400, avatarSeed: 'sarah' },
  { id: 'u2', name: 'Mike T.', tagline: 'Daily Reader', xp: 11200, avatarSeed: 'mike' },
  { id: 'u3', name: 'Elena R.', tagline: 'Bookworm', xp: 10800, avatarSeed: 'elena' },
  { id: 'u4', name: 'Robert P.', xp: 9500, avatarSeed: 'robert' },
  { id: 'me', name: 'John (You)', tagline: 'Keep it up!', xp: 8200, isMe: true, avatarSeed: 'john' },
  { id: 'u6', name: 'Lisa M.', xp: 7100, avatarSeed: 'lisa' },
  { id: 'u7', name: 'David K.', xp: 6850, avatarSeed: 'david' },
  { id: 'u8', name: 'Amara O.', xp: 6300, avatarSeed: 'amara' },
  { id: 'u9', name: 'Tom B.', xp: 5900, avatarSeed: 'tom' },
];

/* ---------------- Notifications ---------------- */

export const NOTIFICATIONS = [
  {
    id: 'n1', group: 'Today', title: 'Lesson Reminder', time: '2h ago', unread: true,
    body: 'Time for your daily reading!',
    detail: 'Complete Lesson 13 to keep your streak alive.',
    icon: 'notifications', tint: '#DCEAE8', color: '#0F766E',
  },
  {
    id: 'n2', group: 'Today', title: 'Achievement Alert', time: '5h ago', unread: true,
    body: 'You earned the 5-day streak badge!',
    detail: 'Great consistency! Keep it up to earn more.',
    icon: 'trophy', tint: '#FFEDE4', color: '#FF6B35',
  },
  {
    id: 'n3', group: 'Earlier', title: 'New Course', time: '1d ago',
    body: 'Gardening 101 is now available.',
    detail: 'Learn the basics of planting and care.',
    icon: 'book', tint: '#E7EFFE', color: '#3B82F6',
  },
  {
    id: 'n4', group: 'Earlier', title: 'Lesson Reminder', time: '2d ago',
    body: "Don't forget your daily reading goal.",
    icon: 'notifications-outline', tint: '#F1F3F5', color: '#6B7280',
  },
  {
    id: 'n5', group: 'Earlier', title: 'Tip of the Day', time: '3d ago',
    body: 'Try reading aloud to improve flow.',
    icon: 'bulb', tint: '#F1EAFE', color: '#8B5CF6',
  },
];

/* ---------------- Subscription ---------------- */

export const PLANS = [
  {
    id: 'free',
    name: 'ReadWell Free',
    subtitle: 'For casual learners',
    price: 0,
    period: 'forever',
    icon3d: 'book',
    cta: 'Keep free',
    features: [
      { label: 'Limited Book Access', included: true },
      { label: 'Basic Reading Tools', included: true },
      { label: 'Offline Mode', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'ReadWell Pro',
    subtitle: 'For serious progress',
    price: 9.99,
    period: 'month',
    icon3d: 'crown',
    featured: true,
    cta: 'Go Pro',
    features: [
      { label: 'Unlimited Books', included: true },
      { label: 'Offline Mode', included: true },
      { label: 'Audio Narration', included: true },
      { label: 'Progress Insights', included: true },
    ],
  },
];

export const SHARE_TARGETS = [
  { id: 'facebook', label: 'Facebok', icon: 'logo-facebook', color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', icon: 'logo-instagram', color: '#E4405F' },
  { id: 'telegram', label: 'Telegram', icon: 'paper-plane', color: '#2AABEE' },
  { id: 'whatsapp', label: 'Whatsapp', icon: 'logo-whatsapp', color: '#25D366' },
  { id: 'more', label: 'More', icon: 'ellipsis-horizontal', color: '#14181F' },
  { id: 'email', label: 'Email', icon: 'mail-outline', color: '#14181F' },
  { id: 'copy', label: 'Copy link', icon: 'link-outline', color: '#14181F' },
];
