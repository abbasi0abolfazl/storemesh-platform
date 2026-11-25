import { randomUUID } from 'node:crypto';
export class ApiClient {
  constructor({baseUrl='http://localhost:3000',username,password,fetchImpl=fetch}={}){this.baseUrl=(baseUrl||'http://localhost:3000').replace(/\/$/,'');this.username=username;this.password=password;this.fetch=fetchImpl;this.token=null}
  async login(){if(this.token)return this.token;if(!this.username||!this.password)throw Object.assign(new Error('Terminal credentials must be supplied at runtime'),{code:'CREDENTIALS_REQUIRED'});const r=await this.fetch(`${this.baseUrl}/api/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:this.username,password:this.password})});const j=await r.json();if(!r.ok)throw new Error(j.message);return this.token=j.data.token}
  async request(path,{method='GET',body,key}={}){const token=await this.login();const r=await this.fetch(`${this.baseUrl}${path}`,{method,headers:{Authorization:`Bearer ${token}`,...(body?{'Content-Type':'application/json'}:{}),...(key?{'Idempotency-Key':key}:{})},...(body?{body:JSON.stringify(body)}:{})});const j=await r.json();if(r.status===401&&this.token){this.token=null;return this.request(path,{method,body,key})}if(!r.ok)throw Object.assign(new Error(j.message),{code:j.errorCode,status:r.status});return j.data??j}
  post(path,body,key=randomUUID()){return this.request(path,{method:'POST',body,key})}
}
