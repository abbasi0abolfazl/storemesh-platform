import test from'node:test';import assert from'node:assert/strict';import{once}from'node:events';import{randomUUID}from'node:crypto';import{Aggregator,createServer}from'../src/server.js';import{PostgresEventRepository}from'../src/repository.js';

test('report-authenticated Cloud event queries use stable PostgreSQL pagination and cross-site object history',{skip:!process.env.DATABASE_URL},async()=>{
  const repository=new PostgresEventRepository(),run=randomUUID(),entityId=`object-${run}`,at='2026-09-05T10:00:00.000Z',ids=Array.from({length:4},randomUUID).sort();
  const event=(id,site,type,occurredAt=at)=>({id,site,type,category:type==='OTHER'?'Security':'Inventory',entityType:'BATCH',entityId,payload:{run},schemaVersion:2,occurredAt});
  await repository.append([event(ids[0],'IRAN','MOVED'),event(ids[1],'ROME','MOVED'),event(ids[3],'DUBAI','OTHER','2026-09-05T12:00:00.000Z')]);
  const app=new Aggregator({repository,reportKey:'report-secret'});await app.ready;repository.load=async()=>{throw Error('query endpoint must not load all events')};const server=createServer(app);server.listen(0,'127.0.0.1');await once(server,'listening');const base=`http://127.0.0.1:${server.address().port}`,headers={'x-cloud-report-key':'report-secret'};
  try{
    assert.equal((await fetch(`${base}/api/events`)).status,401);
    let response=await fetch(`${base}/api/events?type=MOVED&category=Inventory&entityType=BATCH&entityId=${entityId}&occurredAtFrom=2026-09-05T09:00:00Z&occurredAtTo=2026-09-05T11:00:00Z&limit=1`,{headers}),page=await response.json();assert.equal(response.status,200);assert.deepEqual(page.items.map(x=>x.id),[ids[0]]);assert.ok(page.nextCursor);
    await repository.append([event(ids[2],'DUBAI','MOVED')]);
    response=await fetch(`${base}/api/events?type=MOVED&category=Inventory&entityType=BATCH&entityId=${entityId}&limit=2&cursor=${encodeURIComponent(page.nextCursor)}`,{headers});page=await response.json();assert.deepEqual(page.items.map(x=>x.id),[ids[1],ids[2]]);assert.equal(page.nextCursor,null);
    response=await fetch(`${base}/api/events/${ids[1]}`,{headers});assert.equal(response.status,200);assert.equal((await response.json()).site,'ROME');
    response=await fetch(`${base}/api/object-history/BATCH/${entityId}?limit=10`,{headers});const history=await response.json();assert.deepEqual(history.items.map(x=>x.site),['IRAN','ROME','DUBAI','DUBAI']);assert.deepEqual(history.items.map(x=>x.id),ids);
  }finally{server.close();await once(server,'close');await repository.pool.query("DELETE FROM cloud_events WHERE payload->>'run'=$1",[run]);await repository.close()}
});
