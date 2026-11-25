export class OfflineQueue {
  constructor({storage=localStorage,key='storemesh-pda-queue'}={}){this.storage=storage;this.key=key}
  list(){try{return JSON.parse(this.storage.getItem(this.key)||'[]')}catch{return[]}}
  add(operation){const items=this.list();items.push(operation);this.storage.setItem(this.key,JSON.stringify(items));return operation}
  remove(id){this.storage.setItem(this.key,JSON.stringify(this.list().filter(x=>x.id!==id)))}
  async flush(sender){const results=[];for(const item of this.list()){try{await sender(item);this.remove(item.id);results.push({id:item.id,status:'CONFIRMED'})}catch(error){results.push({id:item.id,status:'PENDING',error:error.message});break}}return results}
}
