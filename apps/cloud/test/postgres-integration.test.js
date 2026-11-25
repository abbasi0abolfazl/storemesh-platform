import test from 'node:test';
import assert from 'node:assert/strict';
import {Aggregator} from '../src/server.js';
import {PostgresEventRepository} from '../src/repository.js';

test('PostgreSQL event, receipt freshness and full audit envelope survive repository restart',{skip:!process.env.DATABASE_URL},async()=>{
  const id=crypto.randomUUID(),occurredAt='2020-01-01T00:00:00.000Z',event={id,site:'CI',type:'TEST_EVENT',category:'Administration',entityId:'probe',userId:'user-1',actorUsername:'historical-user',sessionId:'session-1',deviceId:'device-1',requestId:'request-1',ipAddress:'192.0.2.10',result:'SUCCESS',beforeState:{status:'OLD'},afterState:{status:'NEW'},actorRoles:['MANAGER','QUALITY_OPERATOR'],actorStation:'QC',payload:{value:1},schemaVersion:2,occurredAt};
  const first=new PostgresEventRepository();await first.append([event]);await first.logAccess({site:'CI',keyId:'current',ok:true,address:'127.0.0.1',at:new Date().toISOString()});await first.close();
  const second=new PostgresEventRepository(),loaded=await second.load(),restored=loaded.find(x=>x.id===id);
  for(const field of['category','entityId','userId','actorUsername','sessionId','deviceId','requestId','ipAddress','result','actorStation'])assert.equal(restored[field],event[field],field);
  assert.deepEqual(restored.beforeState,event.beforeState);assert.deepEqual(restored.afterState,event.afterState);assert.deepEqual(restored.actorRoles,event.actorRoles);assert.equal(restored.payload.value,1);assert.equal(restored.occurredAt,occurredAt);assert.ok(Number.isFinite(Date.parse(restored.receivedAt)));
  const aggregator=new Aggregator({repository:second,clock:()=>Date.now(),staleThresholdMs:600000});await aggregator.ready;const site=aggregator.summary().sites.CI;assert.equal(site.status,'CONNECTED');assert.equal(site.lastSync,occurredAt);assert.equal(site.lastReceivedAt,restored.receivedAt);
  const access=await second.pool.query("SELECT authenticated FROM site_access_log WHERE site='CI' ORDER BY id DESC LIMIT 1");assert.equal(access.rows[0].authenticated,true);
  await second.pool.query('DELETE FROM cloud_events WHERE id=$1',[id]);await second.pool.query("DELETE FROM site_access_log WHERE site='CI'");await second.close();
});
