import { COLORS, SPACING, RADIUS, TYPE } from '../theme';
import { COURSES, CURRICULUM, PLANS, BADGES, QUIZZES } from '../constants/data';

describe('theme tokens', () => {
  test('primary brand is the deep teal from the redesign', () => {
    expect(COLORS.primary).toBe('#0F766E');
    expect(COLORS.accent).toBe('#2DD4BF');
  });

  test('spacing scale ascends', () => {
    expect(SPACING.xs).toBeLessThan(SPACING.md);
    expect(SPACING.md).toBeLessThan(SPACING.xl);
    expect(SPACING.xl).toBeLessThan(SPACING.xxxl);
  });

  test('radius exposes a pill token', () => {
    expect(RADIUS.pill).toBeGreaterThanOrEqual(999);
  });

  test('type scale defines line heights for body styles', () => {
    ['h1', 'h2', 'h3', 'body', 'small'].forEach((k) => {
      expect(typeof TYPE[k].fontSize).toBe('number');
      expect(typeof TYPE[k].lineHeight).toBe('number');
      expect(TYPE[k].lineHeight).toBeGreaterThan(TYPE[k].fontSize);
    });
  });
});

describe('content model', () => {
  test('every course has the fields the detail screen renders', () => {
    COURSES.forEach((c) => {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.image).toBeTruthy();
      expect(typeof c.rating).toBe('number');
      expect(typeof c.totalLessons).toBe('number');
    });
  });

  test('curriculum lesson ids are unique within a course', () => {
    Object.values(CURRICULUM).forEach((course) => {
      const ids = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  test('english curriculum matches the advertised lesson count', () => {
    const total = CURRICULUM.english.modules.reduce((n, m) => n + m.lessons.length, 0);
    const course = COURSES.find((c) => c.id === 'english');
    expect(total).toBe(course.totalLessons);
  });

  test('quiz answers point at a real option', () => {
    Object.values(QUIZZES).forEach((qs) => {
      qs.forEach((q) => {
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
      });
    });
  });

  test('exactly one plan is featured and free is $0', () => {
    expect(PLANS.filter((p) => p.featured)).toHaveLength(1);
    expect(PLANS.find((p) => p.id === 'free').price).toBe(0);
  });

  test('badges declare an icon and unlock requirement', () => {
    BADGES.forEach((b) => {
      expect(b.icon3d).toBeTruthy();
      expect(b.requirement).toBeTruthy();
    });
  });
});
