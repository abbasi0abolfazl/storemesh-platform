export class ConsumablesWorkflow{
  constructor({runtime,role='RECEIVING_OPERATOR'}){this.runtime=runtime;this.role=role}
  async session(){return this.runtime.session(()=>{},this.role)}
  async list(){return(await this.runtime.request('/api/consumables')).items??[]}
  async history(id){const[receipts,transactions]=await Promise.all([this.runtime.request(`/api/consumables/${id}/receipts`),this.runtime.request(`/api/consumables/${id}/transactions`)]);return{receipts:receipts.items??[],transactions:transactions.items??[]}}
  async receive(id,{quantity,source,receivedAt}){const count=Number(quantity);if(!id)throw Error('قلم مصرفی الزامی است');if(!(count>0)||!source?.trim())throw Error('تعداد مثبت و منبع خرید الزامی است');await this.session();return this.runtime.request(`/api/consumables/${id}/receive`,{method:'POST',key:this.runtime.key(),body:{quantity:count,source:source.trim(),...(receivedAt?{receivedAt:new Date(receivedAt).toISOString()}:{})}})}
}
