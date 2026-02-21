import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function LoadFiles(dirPath) {
  const files = [];
  const absolutePath = resolve(process.cwd(), dirPath);

  try {
    const entries = await readdir(absolutePath, { withFileTypes: true, recursive: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.js')) {
        const filePath = entry.parentPath 
          ? join(entry.parentPath, entry.name)
          : join(entry.path || absolutePath, entry.name);
        files.push(filePath);
      }
    }
  } catch (error) {
    console.error(`Error loading files from ${absolutePath}:`, error);
  }

  return files;
}
