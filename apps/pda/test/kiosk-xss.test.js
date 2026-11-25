import test from'node:test';
import assert from'node:assert/strict';
import{inventoryHtml,tasksHtml,queueHtml,roleOptionsHtml,consumablesHtml}from'../view-html.js';

const attack='<svg onload="globalThis.pwned=1">';
const assertSafe=html=>{assert.equal(html.includes('<svg'),false);assert.equal(html.includes('onload="'),false);assert.match(html,/&lt;svg/)};

test('PDA escapes API-derived inventory, task, queue, and user-role values',()=>{
  for(const html of[
    inventoryHtml([{code:attack,product:attack,zone:attack,weightKg:attack}]),
    tasksHtml([{id:`x" onclick="pwned`,title:attack,zone:attack,status:'OPEN'}],{}),
    queueHtml([{body:{zone:attack}}]),
    roleOptionsHtml([attack],{}),
    consumablesHtml([{id:'c1',code:attack,name:attack,quantity:1,unit:attack,reorderThreshold:2}],[{entityId:'c1',type:'CONSUMABLE_SHORTAGE',status:'OPEN',severity:attack}])
  ])assertSafe(html);
});
