import test from'node:test';import assert from'node:assert/strict';import{readFile}from'node:fs/promises';
test('terminal Docker image includes all root modules, styles and src modules',async()=>{const text=await readFile(new URL('../Dockerfile',import.meta.url),'utf8');assert.match(text,/COPY index\.html \*\.js \*\.css/);assert.match(text,/COPY src\/ \/usr\/share\/nginx\/html\/src\//)});
