import test from'node:test';
import assert from'node:assert/strict';
import{pickerOptionsHtml,roleOptionsHtml,taskOptionsHtml,basketListHtml}from'../src/view-html.js';

const attack='<img src=x onerror="globalThis.pwned=1">';
const assertSafe=html=>{assert.equal(html.includes('<img'),false);assert.equal(html.includes('onerror="'),false);assert.match(html,/&lt;img/)};

test('terminal escapes API-derived catalog, task, role, and batch values',()=>{
  for(const html of[
    pickerOptionsHtml([{code:`x" autofocus onfocus="pwned`,name:attack}]),
    roleOptionsHtml([attack],{}),
    taskOptionsHtml([{id:`x" onclick="pwned`,title:attack,zone:attack,status:'OPEN'}],{}),
    basketListHtml([{code:attack,weightKg:1}])
  ])assertSafe(html);
});
