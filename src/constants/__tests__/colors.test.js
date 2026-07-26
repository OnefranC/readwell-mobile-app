import { COLORS, SPACING, RADIUS } from '../colors';

describe('Theme constants', () => {
  test('COLORS primary is the teal brand color', () => {
    expect(COLORS.primary).toBe('#0D9488');
  });

  test('SPACING values are numbers and ascending for first few tokens', () => {
    expect(typeof SPACING.xs).toBe('number');
    expect(SPACING.xs).toBeLessThan(SPACING.md);
  });

  test('RADIUS has a full token set to 9999', () => {
    expect(RADIUS.full).toBe(9999);
  });
});
