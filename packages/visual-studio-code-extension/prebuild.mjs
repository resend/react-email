import fs from "node:fs/promises";
import path from "node:path";

async function dereferenceSymlinks(directory) {
  async function traverse(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for await (const entry of entries) {
      const fullPath = path.resolve(entry.path, entry.name);
      const stats = await fs.lstat(fullPath);
      
      if (stats.isSymbolicLink()) {
        const realPath = await fs.realpath(fullPath);

        await fs.rm(fullPath, { force: true, recursive: true });
        await fs.cp(realPath, fullPath, {
          recursive: true,
          dereference: true,
        });
      }

      if (entry.isDirectory()) {
        await traverse(fullPath);
      }
    }
  }

  await traverse(directory);
}

await dereferenceSymlinks(path.resolve(import.meta.dirname, "node_modules"));
