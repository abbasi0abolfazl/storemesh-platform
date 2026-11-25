import test from'node:test';import assert from'node:assert/strict';import{readFile}from'node:fs/promises';
test('PDA Docker image includes every root JavaScript and CSS asset',async()=>{const text=await readFile(new URL('../Dockerfile',import.meta.url),'utf8');assert.match(text,/COPY index\.html manifest\.json \*\.js \*\.css/)});
