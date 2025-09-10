// scripts/find-value-changes.js

import { execSync } from 'child_process';
import fs from 'fs';

// --- CONFIGURATION ---
const START_COMMIT = 'abba0470aa8b4edd79822877514b8f0a2145235a';
const TARGET_DIRECTORY = 'src/store/';
// -------------------

function analyzeDiff() {
  console.log(`Analyzing diff from ${START_COMMIT} to HEAD in ${TARGET_DIRECTORY}...`);

  try {
    // 1. Get the raw diff from git. This works on all platforms.
    const diffOutput = execSync(
      `git diff -U0 ${START_COMMIT} HEAD -- ${TARGET_DIRECTORY}`
    ).toString();

    const lines = diffOutput.split('\n');
    const changedValueLines = [];

    // Keywords and symbols to ignore. This is our filter.
    const structuralKeywords = [
      'import', 'export', 'type', 'interface', '=>', 'async',
      'const', 'let', 'var', 'function', 'return', 'produce',
      'set(', 'get(', 'useStore', 'create(', 'devtools', 'persist',
      'combine', 'log(', 'console.log', 'JSON.parse', 'JSON.stringify',
      'Object.fromEntries', 'Object.entries', 'filter', 'map', 'find',
      'every', 'some', 'forEach', 'push', 'pop', 'reverse', 'sort',
      'new Map', 'new Set', 'new Promise', 'new Error', 'new Function',
      '()', '{}', '[]', '`', '...', ':', '(', ')', '{', '}', '[', ']',
    ];
    const structuralRegex = new RegExp(structuralKeywords.join('|').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    for (const line of lines) {
      // 2. Keep only lines that represent an addition or deletion.
      if (line.startsWith('+') || line.startsWith('-')) {
        // Ignore file headers like '--- a/...' or '+++ b/...'
        if (line.startsWith('---') || line.startsWith('+++')) {
          continue;
        }

        const cleanLine = line.substring(1).trim();

        // 3. If the line is empty or contains a structural keyword, ignore it.
        if (cleanLine === '' || structuralRegex.test(cleanLine)) {
          continue;
        }

        // If we get here, it's a line that likely contains a changed primitive value.
        changedValueLines.push(line);
      }
    }

    if (changedValueLines.length > 0) {
      console.log('\n--- POTENTIAL VALUE CHANGES DETECTED ---');
      console.log(changedValueLines.join('\n'));
      console.log('\n--- END OF REPORT ---');
    } else {
      console.log('\nNo significant value changes detected.');
    }

  } catch (error) {
    console.error('Error running git diff:', error.message);
    process.exit(1);
  }
}

analyzeDiff();