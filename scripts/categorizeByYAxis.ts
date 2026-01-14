/**
 * Y-Axis Categorization Script
 *
 * Analyzes curated clues and sorts them by spelling/structural patterns
 * for Y-axis clue generation in the puzzle game.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Clue {
  answer: string;
  clue: string;
  clue2: string;
}

interface CuratedClues {
  clues: {
    people: Clue[];
    places: Clue[];
    things: Clue[];
  };
}

interface CategorizedEntry {
  answer: string;
  clue: string;
  clue2: string;
  mainCategory: 'people' | 'places' | 'things';
  yAxisCategories: string[];
}

// Colors to check for
const COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'gold', 'golden', 'silver', 'gray', 'grey', 'brown', 'scarlet', 'crimson', 'violet', 'indigo', 'rose', 'coral'];

// Common nouns that appear in names
const COMMON_NOUNS = ['king', 'queen', 'prince', 'princess', 'bird', 'hawk', 'bear', 'wolf', 'fox', 'stone', 'wood', 'woods', 'ford', 'bridge', 'hill', 'dale', 'field', 'smith', 'cook', 'baker', 'miller', 'fisher', 'hunter', 'park', 'lake', 'river', 'mountain', 'valley', 'beach', 'island', 'forest', 'desert', 'sea', 'ocean', 'wall', 'street', 'road', 'avenue', 'gate', 'tower', 'castle', 'church', 'temple', 'house', 'hall', 'court', 'square', 'garden', 'canyon', 'reef', 'falls', 'cave', 'hole', 'cube', 'triangle', 'star', 'moon', 'sun', 'light', 'fire', 'ice', 'snow', 'rain', 'storm', 'wind', 'bolt', 'flash', 'driver'];

// Double letter patterns
const DOUBLE_LETTERS = ['aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh', 'ii', 'jj', 'kk', 'll', 'mm', 'nn', 'oo', 'pp', 'qq', 'rr', 'ss', 'tt', 'uu', 'vv', 'ww', 'xx', 'yy', 'zz'];

function analyzeYAxisCategories(answer: string): string[] {
  const categories: string[] = [];
  const answerLower = answer.toLowerCase();
  const answerNoSpaces = answerLower.replace(/\s+/g, '');
  const words = answer.split(/\s+/);
  const firstLetter = answerLower[0].toUpperCase();
  const lastLetter = answerLower[answerLower.length - 1].toLowerCase();

  // 1. Starts with letter
  categories.push(`Starts with ${firstLetter}`);

  // 2. Word count
  if (words.length === 1) {
    categories.push('One-word answer');
  } else if (words.length === 2) {
    categories.push('Two-word answer');
  } else if (words.length === 3) {
    categories.push('Three-word answer');
  } else if (words.length >= 4) {
    categories.push('Four+ word answer');
  }

  // 3. Ends with specific patterns
  if (answerLower.endsWith('a')) categories.push('Ends in A');
  if (answerLower.endsWith('y')) categories.push('Ends in Y');
  if (answerLower.endsWith('n')) categories.push('Ends in N');
  if (answerLower.endsWith('s')) categories.push('Ends in S');
  if (answerLower.endsWith('er')) categories.push('Ends in ER');
  if (answerLower.endsWith('ing')) categories.push('Ends in ING');
  if (answerLower.endsWith('tion')) categories.push('Ends in TION');

  // 4. Contains rare letters
  if (answerLower.includes('z')) categories.push('Contains Z');
  if (answerLower.includes('x')) categories.push('Contains X');
  if (answerLower.includes('q')) categories.push('Contains Q');

  // 5. Double letters
  const foundDoubles: string[] = [];
  for (const double of DOUBLE_LETTERS) {
    if (answerLower.includes(double)) {
      foundDoubles.push(double.toUpperCase());
    }
  }
  if (foundDoubles.length > 0) {
    categories.push('Contains double letters');
    foundDoubles.forEach(d => categories.push(`Contains ${d}`));
  }

  // 6. Starts and ends with same letter
  if (firstLetter.toLowerCase() === lastLetter) {
    categories.push('Starts and ends with same letter');
  }

  // 7. Alliterative (for multi-word names)
  if (words.length >= 2) {
    const firstWord = words[0].toLowerCase();
    const lastWord = words[words.length - 1].toLowerCase();
    if (firstWord[0] === lastWord[0]) {
      categories.push('Alliterative answer');
    }
  }

  // 8. Contains a color
  for (const color of COLORS) {
    if (answerLower.includes(color)) {
      categories.push('Contains a color');
      categories.push(`Contains "${color}"`);
      break;
    }
  }

  // 9. Contains a common noun
  for (const noun of COMMON_NOUNS) {
    // Check for whole word match or at word boundary
    const regex = new RegExp(`\\b${noun}\\b`, 'i');
    if (regex.test(answer)) {
      categories.push('Contains common noun');
      categories.push(`Contains "${noun}"`);
      break;
    }
  }

  // 10. Character count categories
  const charCount = answerNoSpaces.length;
  if (charCount <= 5) categories.push('Short answer (≤5 chars)');
  else if (charCount >= 15) categories.push('Long answer (15+ chars)');

  // 11. Contains hyphen or apostrophe
  if (answer.includes('-')) categories.push('Contains hyphen');
  if (answer.includes("'")) categories.push('Contains apostrophe');

  return categories;
}

function main() {
  console.log('📊 Y-Axis Categorization Script\n');

  // Read curated clues
  const inputPath = path.join(__dirname, '..', 'src', 'data', 'curated-clues.json');
  const data: CuratedClues = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  const allEntries: CategorizedEntry[] = [];

  // Process each category
  for (const category of ['people', 'places', 'things'] as const) {
    for (const clue of data.clues[category]) {
      const yAxisCategories = analyzeYAxisCategories(clue.answer);
      allEntries.push({
        answer: clue.answer,
        clue: clue.clue,
        clue2: clue.clue2,
        mainCategory: category,
        yAxisCategories
      });
    }
  }

  // Build index by Y-axis category
  const yAxisIndex: Record<string, CategorizedEntry[]> = {};

  for (const entry of allEntries) {
    for (const ycat of entry.yAxisCategories) {
      if (!yAxisIndex[ycat]) {
        yAxisIndex[ycat] = [];
      }
      yAxisIndex[ycat].push(entry);
    }
  }

  // Sort categories by count
  const sortedCategories = Object.keys(yAxisIndex).sort((a, b) => {
    return yAxisIndex[b].length - yAxisIndex[a].length;
  });

  // Generate output
  let output = `PEOPLE, PLACES & THINGS - Y-AXIS CATEGORIZATION
Generated: ${new Date().toISOString()}
${'='.repeat(70)}

SUMMARY: ${allEntries.length} total entries categorized

TOP Y-AXIS CATEGORIES (sorted by count):
`;

  // Summary of top categories
  const topCategories = sortedCategories.slice(0, 30);
  for (const cat of topCategories) {
    const entries = yAxisIndex[cat];
    const peopleCount = entries.filter(e => e.mainCategory === 'people').length;
    const placesCount = entries.filter(e => e.mainCategory === 'places').length;
    const thingsCount = entries.filter(e => e.mainCategory === 'things').length;
    output += `\n  ${cat}: ${entries.length} total (People: ${peopleCount}, Places: ${placesCount}, Things: ${thingsCount})`;
  }

  output += `\n\n${'='.repeat(70)}\n`;
  output += `DETAILED BREAKDOWN BY Y-AXIS CATEGORY\n`;
  output += `${'='.repeat(70)}\n`;

  // Detailed breakdown - only show categories with useful puzzle potential
  const usefulCategories = sortedCategories.filter(cat => {
    const count = yAxisIndex[cat].length;
    // Include if: has at least one of each main category, or is a specific pattern
    const entries = yAxisIndex[cat];
    const hasAll = entries.some(e => e.mainCategory === 'people') &&
                   entries.some(e => e.mainCategory === 'places') &&
                   entries.some(e => e.mainCategory === 'things');
    return hasAll || count >= 3;
  });

  for (const cat of usefulCategories) {
    const entries = yAxisIndex[cat];
    output += `\n\n${'#'.repeat(50)}\n`;
    output += `# ${cat.toUpperCase()} (${entries.length} entries)\n`;
    output += `${'#'.repeat(50)}\n`;

    // Group by main category
    for (const mainCat of ['people', 'places', 'things'] as const) {
      const catEntries = entries.filter(e => e.mainCategory === mainCat);
      if (catEntries.length > 0) {
        output += `\n## ${mainCat.toUpperCase()} (${catEntries.length}):\n`;
        for (const entry of catEntries) {
          output += `  - ${entry.answer}\n`;
          output += `    Clue 1: ${entry.clue}\n`;
          output += `    Clue 2: ${entry.clue2}\n`;
        }
      }
    }
  }

  // Generate JSON output for programmatic use
  const jsonOutput = {
    generatedAt: new Date().toISOString(),
    totalEntries: allEntries.length,
    entries: allEntries,
    yAxisIndex: Object.fromEntries(
      sortedCategories.map(cat => [
        cat,
        yAxisIndex[cat].map(e => ({
          answer: e.answer,
          mainCategory: e.mainCategory
        }))
      ])
    ),
    puzzleReadyCombinations: [] as { yAxisClue: string; people: string[]; places: string[]; things: string[] }[]
  };

  // Find puzzle-ready combinations (categories with at least one of each type)
  for (const cat of sortedCategories) {
    const entries = yAxisIndex[cat];
    const people = entries.filter(e => e.mainCategory === 'people').map(e => e.answer);
    const places = entries.filter(e => e.mainCategory === 'places').map(e => e.answer);
    const things = entries.filter(e => e.mainCategory === 'things').map(e => e.answer);

    if (people.length > 0 && places.length > 0 && things.length > 0) {
      jsonOutput.puzzleReadyCombinations.push({
        yAxisClue: cat,
        people,
        places,
        things
      });
    }
  }

  // Save outputs
  const textOutputPath = path.join(__dirname, '..', 'src', 'data', 'y-axis-sorted-clues.txt');
  fs.writeFileSync(textOutputPath, output);
  console.log(`📝 Saved text output to ${textOutputPath}`);

  const jsonOutputPath = path.join(__dirname, '..', 'src', 'data', 'y-axis-sorted-clues.json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonOutput, null, 2));
  console.log(`📊 Saved JSON output to ${jsonOutputPath}`);

  // Print summary
  console.log(`\n✅ Categorization complete!`);
  console.log(`   Total entries: ${allEntries.length}`);
  console.log(`   Y-axis categories found: ${sortedCategories.length}`);
  console.log(`   Puzzle-ready combinations: ${jsonOutput.puzzleReadyCombinations.length}`);

  console.log(`\n🎯 TOP PUZZLE-READY Y-AXIS CLUES:`);
  for (const combo of jsonOutput.puzzleReadyCombinations.slice(0, 15)) {
    console.log(`   "${combo.yAxisClue}" - People: ${combo.people.length}, Places: ${combo.places.length}, Things: ${combo.things.length}`);
  }
}

main();
