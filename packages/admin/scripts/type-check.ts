#!/usr/bin/env tsx
/**
 * Type check script that shows all TypeScript errors
 * Run this before build to see all type errors at once
 */

import { execSync } from 'child_process';
import { exit } from 'process';

console.log('🔍 Checking TypeScript types...\n');

try {
  execSync('tsc --noEmit --pretty', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  console.log('\n✅ All type checks passed!');
  exit(0);
} catch (error) {
  console.error('\n❌ Type check failed!');
  exit(1);
}

