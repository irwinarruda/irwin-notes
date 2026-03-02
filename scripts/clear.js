#!/usr/bin/env node
import { rm } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const projectRoot = resolve(__dirname, '..');

const dirsToRemove = [
  resolve(projectRoot, 'node_modules'),
  resolve(projectRoot, 'dist'),
  resolve(projectRoot, '.next'),
];

async function clearDirectories() {
  for (const dir of dirsToRemove) {
    try {
      await rm(dir, { recursive: true, force: true });
      console.log(`✓ Removed ${dir}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`✗ Failed to remove ${dir}:`, error.message);
      }
    }
  }
  console.log('✓ Done!');
}

clearDirectories();
