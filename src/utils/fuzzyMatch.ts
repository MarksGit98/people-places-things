import Fuse from 'fuse.js';

/**
 * Normalizes a string for comparison:
 * - Lowercase
 * - Remove extra whitespace
 * - Remove punctuation except apostrophes
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s']/g, '');
}

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Gets singular/plural variants of a word for flexible matching
 */
function getPluralVariants(word: string): string[] {
  const variants = [word];

  // If word ends in 's', add the singular form (remove 's')
  if (word.endsWith('ies')) {
    // e.g., "batteries" -> "battery"
    variants.push(word.slice(0, -3) + 'y');
  } else if (word.endsWith('es')) {
    // e.g., "watches" -> "watch", "boxes" -> "box"
    variants.push(word.slice(0, -2));
    variants.push(word.slice(0, -1)); // also try just removing 's'
  } else if (word.endsWith('s') && !word.endsWith('ss')) {
    // e.g., "cars" -> "car"
    variants.push(word.slice(0, -1));
  }

  // If word doesn't end in 's', add plural forms
  if (!word.endsWith('s')) {
    variants.push(word + 's'); // e.g., "car" -> "cars"
    if (word.endsWith('y') && !/[aeiou]y$/.test(word)) {
      // e.g., "battery" -> "batteries"
      variants.push(word.slice(0, -1) + 'ies');
    }
    if (word.endsWith('ch') || word.endsWith('sh') || word.endsWith('x') || word.endsWith('o')) {
      // e.g., "watch" -> "watches"
      variants.push(word + 'es');
    }
  }

  return variants;
}

/**
 * Checks if a guess matches a single answer using fuzzy matching
 */
function matchesSingleAnswer(normalizedGuess: string, answer: string, checkPlurals: boolean = false): boolean {
  const normalizedAnswer = normalizeString(answer);

  // Exact match after normalization
  if (normalizedGuess === normalizedAnswer) {
    return true;
  }

  // Check plural variants if enabled (for "things" category)
  if (checkPlurals) {
    const guessVariants = getPluralVariants(normalizedGuess);
    const answerVariants = getPluralVariants(normalizedAnswer);

    // Check if any variant of the guess matches any variant of the answer
    for (const guessVariant of guessVariants) {
      for (const answerVariant of answerVariants) {
        if (guessVariant === answerVariant) {
          return true;
        }
      }
    }
  }

  // Use Fuse.js for fuzzy matching
  const fuse = new Fuse([normalizedAnswer], {
    threshold: 0.3, // Lower = stricter matching
    distance: 100,
    includeScore: true,
  });

  const results = fuse.search(normalizedGuess);

  if (results.length > 0 && results[0].score !== undefined) {
    // Score < 0.3 is a good match
    if (results[0].score < 0.3) {
      return true;
    }
  }

  // Also check Levenshtein distance for short answers
  const maxDistance = Math.max(1, Math.floor(normalizedAnswer.length * 0.25));
  const distance = levenshteinDistance(normalizedGuess, normalizedAnswer);

  if (distance <= maxDistance) {
    return true;
  }

  return false;
}

/**
 * Checks if a guess matches the correct answer using fuzzy matching
 * Also checks against any acceptable alternative answers
 * For "things" category, also accepts plural/singular variants
 * Returns true if the guess is close enough to the answer or any acceptable answer
 */
export function isCorrectAnswer(
  guess: string,
  answer: string,
  acceptableAnswers?: string[],
  category?: 'people' | 'places' | 'things'
): boolean {
  const normalizedGuess = normalizeString(guess);

  // Empty guess
  if (!normalizedGuess) {
    return false;
  }

  // Enable plural checking for "things" category
  const checkPlurals = category === 'things';

  // Check against primary answer
  if (matchesSingleAnswer(normalizedGuess, answer, checkPlurals)) {
    return true;
  }

  // Check against acceptable alternatives
  if (acceptableAnswers && acceptableAnswers.length > 0) {
    for (const altAnswer of acceptableAnswers) {
      if (matchesSingleAnswer(normalizedGuess, altAnswer, checkPlurals)) {
        return true;
      }
    }
  }

  return false;
}
