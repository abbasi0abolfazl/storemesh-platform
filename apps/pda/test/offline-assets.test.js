import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('offline cache includes scanner security, UUID support, and safe render helpers',async()=>{
  const source=await readFile(new URL('../service-worker.js',import.meta.url),'utf8');
  for(const asset of['scanner-capture.js','browser-uuid.js','view-html.js','touch.css','consumables.css'])assert.ok(source.includes(asset),`offline cache missing ${asset}`);
  assert.match(source,/storemesh-pda-v6/);
});
