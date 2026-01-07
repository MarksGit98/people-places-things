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
 * Checks if a guess matches the correct answer using fuzzy matching
 * Returns true if the guess is close enough to the answer
 */
export function isCorrectAnswer(guess: string, answer: string): boolean {
  const normalizedGuess = normalizeString(guess);
  const normalizedAnswer = normalizeString(answer);

  // Exact match after normalization
  if (normalizedGuess === normalizedAnswer) {
    return true;
  }

  // Empty guess
  if (!normalizedGuess) {
    return false;
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
