import { CapitalizeFirstPipe } from './capitalize-first';

describe('CapitalizeFirstPipe', () => {

  let pipe: CapitalizeFirstPipe;

  beforeEach(() => {
    pipe = new CapitalizeFirstPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should capitalize the first letter of a lowercase string', () => {
    // --- ARRANGE ---
    const VALUE = 'hello';

    // --- ACT ---
    const RESULT = pipe.transform(VALUE);

    // --- ASSERT ---
    expect(RESULT).toBe('Hello');
  });

  it('should not modify a string that already starts with an uppercase letter', () => {
    // --- ARRANGE ---
    const VALUE = 'World';

    // --- ACT ---
    const RESULT = pipe.transform(VALUE);

    // --- ASSERT ---
    expect(RESULT).toBe('World');
  });

  it('should only capitalize the first character and leave the rest unchanged', () => {
    // --- ARRANGE ---
    const VALUE = 'hELLO wORLD';

    // --- ACT ---
    const RESULT = pipe.transform(VALUE);

    // --- ASSERT ---
    expect(RESULT).toBe('HELLO wORLD');
  });

  it('should capitalize the first letter of a sentence', () => {
    // --- ARRANGE ---
    const VALUE = 'ma plante est heureuse';

    // --- ACT ---
    const RESULT = pipe.transform(VALUE);

    // --- ASSERT ---
    expect(RESULT).toBe('Ma plante est heureuse');
  });

  it('should return an empty string for an empty string input', () => {
    // --- ARRANGE ---
    const VALUE = '';

    // --- ACT ---
    const RESULT = pipe.transform(VALUE);

    // --- ASSERT ---
    expect(RESULT).toBe('');
  });

  it('should return an empty string for null', () => {
    // --- ARRANGE ---
    const VALUE = null;

    // --- ACT ---
    const RESULT = pipe.transform(VALUE);

    // --- ASSERT ---
    expect(RESULT).toBe('');
  });

  it('should return an empty string for undefined', () => {
    // --- ARRANGE ---
    const VALUE = undefined;

    // --- ACT ---
    const RESULT = pipe.transform(VALUE);

    // --- ASSERT ---
    expect(RESULT).toBe('');
  });
});
