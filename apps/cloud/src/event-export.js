export const EVENT_EXPORT_COLUMNS=['id','site','sequence','type','category','entityType','entityId','userId','actorUsername','sessionId','deviceId','requestId','ipAddress','result','beforeState','afterState','actorRoles','actorStation','payload','schemaVersion','occurredAt','receivedAt'];

const printable=value=>value==null?'':typeof value==='object'?JSON.stringify(value):String(value);
export const csvCell=value=>{const text=printable(value);return /[",\r\n]/.test(text)?`"${text.replaceAll('"','""')}"`:text};
export const csvRow=event=>EVENT_EXPORT_COLUMNS.map(column=>csvCell(event[column])).join(',')+'\n';

export async function streamEventExport(app,res,filters,format){
  if(!['csv','ndjson'].includes(format)){const error=Error('format must be csv or ndjson');error.status=400;error.code='CLOUD_EVENT_EXPORT_FORMAT_INVALID';throw error}
  res.writeHead(200,{'Content-Type':format==='csv'?'text/csv; charset=utf-8':'application/x-ndjson; charset=utf-8','Content-Disposition':`attachment; filename="storemesh-events.${format==='csv'?'csv':'ndjson'}"`});
  if(format==='csv')res.write(EVENT_EXPORT_COLUMNS.join(',')+'\n');
  let cursor=null;
  do{const page=await app.queryEvents({...filters,limit:100,cursor});for(const event of page.items)res.write(format==='csv'?csvRow(event):JSON.stringify(event)+'\n');cursor=page.nextCursor}while(cursor);
  res.end();
}
