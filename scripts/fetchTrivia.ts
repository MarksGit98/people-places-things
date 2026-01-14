/**
 * Trivia Fetching and Classification Script
 *
 * Sources trivia from Open Trivia Database and classifies into People/Places/Things
 * Output: JSON file with categorized clue-answer pairs
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types
interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface OpenTriviaResponse {
  response_code: number;
  results: TriviaQuestion[];
}

interface ClassifiedClue {
  category: 'people' | 'places' | 'things';
  answer: string;
  clue: string;
  clue2: string;
  source: string;
  originalCategory: string;
  confidence: 'high' | 'medium' | 'low';
}

// Category classification patterns
const PEOPLE_PATTERNS = [
  /\b(actor|actress|singer|musician|artist|author|writer|president|king|queen|emperor|scientist|inventor|athlete|player|coach|director|celebrity|politician|leader|founder|ceo|philosopher|composer|painter|poet)\b/i,
  /\b(who|person|man|woman|he|she|his|her|born|died|married)\b/i,
  /\b(mr\.|mrs\.|ms\.|dr\.|sir|lord|dame|prince|princess)\b/i,
];

const PLACES_PATTERNS = [
  /\b(country|city|state|nation|capital|continent|ocean|sea|river|lake|mountain|island|peninsula|desert|forest|park|building|monument|landmark|temple|church|palace|castle|tower|bridge|museum|stadium|airport|station)\b/i,
  /\b(located|situated|found in|lies in|borders|north|south|east|west)\b/i,
  /\b(africa|europe|asia|america|australia|antarctica|pacific|atlantic|indian)\b/i,
];

const THINGS_PATTERNS = [
  /\b(invention|device|tool|machine|instrument|vehicle|food|drink|plant|animal|element|compound|material|fabric|game|sport|movie|film|book|song|album|brand|product|company|technology)\b/i,
  /\b(made of|consists of|used for|type of|kind of|form of)\b/i,
];

// Known entities for classification boost
const KNOWN_PEOPLE_KEYWORDS = [
  'einstein', 'shakespeare', 'beethoven', 'mozart', 'picasso', 'napoleon', 'lincoln',
  'washington', 'churchill', 'gandhi', 'mandela', 'obama', 'trump', 'biden',
  'beyonce', 'taylor swift', 'michael jackson', 'elvis', 'beatles', 'madonna'
];

const KNOWN_PLACES_KEYWORDS = [
  'paris', 'london', 'tokyo', 'new york', 'rome', 'egypt', 'china', 'india',
  'amazon', 'nile', 'everest', 'sahara', 'mediterranean', 'pacific', 'atlantic',
  'eiffel', 'colosseum', 'pyramid', 'taj mahal', 'great wall'
];

// Open Trivia DB categories that map well to our categories
const CATEGORY_MAPPINGS: Record<number, 'people' | 'places' | 'things' | 'mixed'> = {
  9: 'mixed',    // General Knowledge
  10: 'things',  // Books
  11: 'things',  // Film
  12: 'things',  // Music
  14: 'things',  // Television
  15: 'things',  // Video Games
  17: 'things',  // Science & Nature
  18: 'things',  // Computers
  19: 'things',  // Mathematics
  20: 'mixed',   // Mythology
  21: 'things',  // Sports
  22: 'places',  // Geography
  23: 'mixed',   // History
  24: 'mixed',   // Politics
  25: 'things',  // Art
  26: 'people',  // Celebrities
  27: 'things',  // Animals
  28: 'things',  // Vehicles
  29: 'things',  // Comics
  30: 'things',  // Gadgets
  31: 'things',  // Anime & Manga
  32: 'things',  // Cartoons
};

// Decode HTML entities
function decodeHTML(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&eacute;/g, 'é')
    .replace(/&ouml;/g, 'ö')
    .replace(/&uuml;/g, 'ü')
    .replace(/&aring;/g, 'å')
    .replace(/&ntilde;/g, 'ñ');
}

// Classify a trivia question into People/Places/Things
function classifyQuestion(question: TriviaQuestion): { category: 'people' | 'places' | 'things'; confidence: 'high' | 'medium' | 'low' } {
  const text = `${question.question} ${question.correct_answer}`.toLowerCase();
  const categoryId = getCategoryId(question.category);

  let peopleScore = 0;
  let placesScore = 0;
  let thingsScore = 0;

  // Check pattern matches
  PEOPLE_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) peopleScore += 2;
  });

  PLACES_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) placesScore += 2;
  });

  THINGS_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) thingsScore += 2;
  });

  // Check known keywords
  KNOWN_PEOPLE_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) peopleScore += 3;
  });

  KNOWN_PLACES_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) placesScore += 3;
  });

  // Boost from API category
  if (categoryId && CATEGORY_MAPPINGS[categoryId]) {
    const mapped = CATEGORY_MAPPINGS[categoryId];
    if (mapped === 'people') peopleScore += 4;
    else if (mapped === 'places') placesScore += 4;
    else if (mapped === 'things') thingsScore += 4;
  }

  // Special case: if answer looks like a person's name (multiple capitalized words)
  const answer = question.correct_answer;
  if (/^[A-Z][a-z]+ [A-Z][a-z]+/.test(answer) && !KNOWN_PLACES_KEYWORDS.some(k => answer.toLowerCase().includes(k))) {
    peopleScore += 2;
  }

  // Determine winner
  const maxScore = Math.max(peopleScore, placesScore, thingsScore);
  let category: 'people' | 'places' | 'things';

  if (peopleScore === maxScore) category = 'people';
  else if (placesScore === maxScore) category = 'places';
  else category = 'things';

  // Determine confidence
  const scores = [peopleScore, placesScore, thingsScore].sort((a, b) => b - a);
  const gap = scores[0] - scores[1];

  let confidence: 'high' | 'medium' | 'low';
  if (gap >= 4) confidence = 'high';
  else if (gap >= 2) confidence = 'medium';
  else confidence = 'low';

  return { category, confidence };
}

function getCategoryId(categoryName: string): number | null {
  const mapping: Record<string, number> = {
    'General Knowledge': 9,
    'Entertainment: Books': 10,
    'Entertainment: Film': 11,
    'Entertainment: Music': 12,
    'Entertainment: Television': 14,
    'Entertainment: Video Games': 15,
    'Science & Nature': 17,
    'Science: Computers': 18,
    'Science: Mathematics': 19,
    'Mythology': 20,
    'Sports': 21,
    'Geography': 22,
    'History': 23,
    'Politics': 24,
    'Art': 25,
    'Celebrities': 26,
    'Animals': 27,
    'Vehicles': 28,
    'Entertainment: Comics': 29,
    'Science: Gadgets': 30,
    'Entertainment: Japanese Anime & Manga': 31,
    'Entertainment: Cartoon & Animations': 32,
  };
  return mapping[categoryName] || null;
}

// Generate a second clue based on the answer and original clue
function generateSecondClue(answer: string, originalClue: string, category: 'people' | 'places' | 'things'): string {
  // This is a placeholder - in production, you'd want to use an LLM or knowledge base
  // For now, we'll create generic second clues based on category
  const answerLower = answer.toLowerCase();

  if (category === 'people') {
    if (answerLower.includes(' ')) {
      return `This person's name has ${answer.split(' ').length} words`;
    }
    return `Starts with the letter "${answer[0]}"`;
  }

  if (category === 'places') {
    if (answer.length > 6) {
      return `This location has ${answer.length} letters in its name`;
    }
    return `Begins with "${answer[0]}"`;
  }

  // Things
  return `The answer is ${answer.split(' ').length} word(s) starting with "${answer[0]}"`;
}

// Fetch trivia from Open Trivia DB
async function fetchTrivia(amount: number = 50, categoryId?: number): Promise<TriviaQuestion[]> {
  let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
  if (categoryId) {
    url += `&category=${categoryId}`;
  }

  try {
    const response = await fetch(url);
    const data: OpenTriviaResponse = await response.json();

    if (data.response_code === 0) {
      return data.results;
    } else {
      console.error(`API returned code ${data.response_code}`);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch trivia:', error);
    return [];
  }
}

// Main execution
async function main() {
  console.log('🎯 Starting Trivia Fetch and Classification Pipeline\n');

  const allClues: ClassifiedClue[] = [];

  // Fetch from various categories
  const categoriesToFetch = [
    { id: 22, name: 'Geography' },      // Good for Places
    { id: 26, name: 'Celebrities' },    // Good for People
    { id: 23, name: 'History' },        // Mixed - good source
    { id: 9, name: 'General Knowledge' },
    { id: 11, name: 'Film' },
    { id: 12, name: 'Music' },
    { id: 21, name: 'Sports' },
    { id: 17, name: 'Science & Nature' },
    { id: 25, name: 'Art' },
  ];

  for (const cat of categoriesToFetch) {
    console.log(`📚 Fetching from category: ${cat.name}...`);

    // Respect rate limits - Open Trivia DB allows 1 request per 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5500));

    const questions = await fetchTrivia(50, cat.id);
    console.log(`   Retrieved ${questions.length} questions`);

    for (const q of questions) {
      const { category, confidence } = classifyQuestion(q);
      const decodedQuestion = decodeHTML(q.question);
      const decodedAnswer = decodeHTML(q.correct_answer);

      // Only include high and medium confidence classifications
      if (confidence !== 'low') {
        allClues.push({
          category,
          answer: decodedAnswer,
          clue: decodedQuestion,
          clue2: generateSecondClue(decodedAnswer, decodedQuestion, category),
          source: `OpenTriviaDB - ${q.category}`,
          originalCategory: q.category,
          confidence,
        });
      }
    }
  }

  // Sort by category and confidence
  allClues.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    if (a.confidence !== b.confidence) {
      const confOrder = { high: 0, medium: 1, low: 2 };
      return confOrder[a.confidence] - confOrder[b.confidence];
    }
    return 0;
  });

  // Count by category
  const counts = {
    people: allClues.filter(c => c.category === 'people').length,
    places: allClues.filter(c => c.category === 'places').length,
    things: allClues.filter(c => c.category === 'things').length,
  };

  console.log('\n📊 Classification Results:');
  console.log(`   People: ${counts.people}`);
  console.log(`   Places: ${counts.places}`);
  console.log(`   Things: ${counts.things}`);
  console.log(`   Total:  ${allClues.length}`);

  // Save to file
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'sourced-clues.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalClues: allClues.length,
    counts,
    clues: allClues,
  }, null, 2));

  console.log(`\n✅ Saved ${allClues.length} clues to ${outputPath}`);

  // Also generate a human-readable summary
  const summaryPath = path.join(__dirname, '..', 'src', 'data', 'clues-summary.txt');
  let summary = `PEOPLE, PLACES & THINGS - Sourced Clues Summary\n`;
  summary += `Generated: ${new Date().toISOString()}\n`;
  summary += `${'='.repeat(60)}\n\n`;

  for (const cat of ['people', 'places', 'things'] as const) {
    const catClues = allClues.filter(c => c.category === cat);
    summary += `\n${'#'.repeat(40)}\n`;
    summary += `# ${cat.toUpperCase()} (${catClues.length} entries)\n`;
    summary += `${'#'.repeat(40)}\n\n`;

    catClues.slice(0, 50).forEach((clue, i) => {
      summary += `${i + 1}. ANSWER: ${clue.answer}\n`;
      summary += `   Clue 1: ${clue.clue}\n`;
      summary += `   Clue 2: ${clue.clue2}\n`;
      summary += `   Source: ${clue.source} | Confidence: ${clue.confidence}\n\n`;
    });
  }

  fs.writeFileSync(summaryPath, summary);
  console.log(`📝 Saved human-readable summary to ${summaryPath}`);
}

main().catch(console.error);
