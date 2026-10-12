import {mkdir, readFile, writeFile, rename, readdir} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {randomUUID} from 'node:crypto';
export class Store {
  root: string;
  constructor(root = process.env.DATA_DIR || '.data') { this.root = resolve(root); }
  dir(id: string) { if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error('Invalid task ID'); return join(this.root,id); }
  async save(run: any) { await mkdir(this.dir(run.id), {recursive:true}); const file=join(this.dir(run.id),'state.json'); const tmp=file+'.'+randomUUID()+'.tmp'; await writeFile(tmp, JSON.stringify(run,null,2),{mode:0o600}); await rename(tmp,file); }
  async get(id: string) { return JSON.parse(await readFile(join(this.dir(id),'state.json'),'utf8')); }
  async list() { await mkdir(this.root,{recursive:true}); const entries=await readdir(this.root); const runs=[]; for(const id of entries) {try {const r=await this.get(id); runs.push({id:r.id,idea:r.input.idea,status:r.status,stage:r.stage,created:r.created});} catch {}} return runs.sort((a,b)=>b.created.localeCompare(a.created)); }
  async artifact(id:string,name:string,value:any) { if(!/^[a-z0-9_.-]+$/.test(name)) throw new Error('Invalid filename'); const file=join(this.dir(id),name); const tmp=file+'.tmp'; await writeFile(tmp,JSON.stringify(value,null,2),{mode:0o600}); await rename(tmp,file); }
}
