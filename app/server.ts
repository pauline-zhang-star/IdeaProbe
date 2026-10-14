import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {settings} from './settings.ts';
import {Engine} from './engine.ts';
const engine=new Engine();
const page=await readFile(new URL('./index.html',import.meta.url),'utf8');
for(const task of await engine.store.list()){if(['running','queued','interpreting'].includes(task.status)){const r=await engine.store.get(task.id);r.status='failed';r.error='本地程序中断，已保存阶段。确认过的任务可继续。';await engine.persist(r);}}
function json(res:any,status:number,value:any){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));}
function summary(r:any){return {id:r.id,input:r.input,scope:r.scope,budget:r.budget,status:r.status,stage:r.stage,error:r.error,usage:r.usage,created:r.created,products:r.products?.map((p:any)=>({id:p.id,name:p.name,url:p.url,description:p.description,relevance_reason:p.relevance_reason,score:p.score,selected:p.selected,rank:p.rank,selection_reason:p.selection_reason,collection:p.collection})),searchAttempts:r.searchAttempts||[],queries:r.queries?.map((q:any)=>({query:q.query,status:q.status})),reviewCount:r.reviews?.length,report:r.report};}
createServer(async(req,res)=>{try{const host=req.headers.host||'';if(!/^127\.0\.0\.1(:\d+)?$|^localhost(:\d+)?$/.test(host))return json(res,403,{error:'Local access only'});const origin=req.headers.origin;if(origin&&origin!==`http://${host}`)return json(res,403,{error:'Origin rejected'});const url=new URL(req.url||'/',`http://${host}`);if(req.method==='GET'&&url.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; img-src 'self'; frame-ancestors 'none'",'Cache-Control':'no-store'});return res.end(page);}
if(req.method==='GET'&&url.pathname==='/api/config')return json(res,200,{...await settings.modelStatus(),searchConfigured:(await settings.providers()).length>0,searchProviders:await settings.status()});
if(req.method==='GET'&&url.pathname==='/api/research')return json(res,200,await engine.store.list());
let body:any={};if(req.method==='POST'){if(!req.headers['content-type']?.startsWith('application/json'))return json(res,415,{error:'JSON required'});let data='';for await(const chunk of req){data+=chunk;if(data.length>30000)return json(res,413,{error:'Request too large'});}body=JSON.parse(data||'{}');}
if(req.method==='POST'&&url.pathname==='/api/settings/model')return json(res,200,await settings.saveModel(body));
if(req.method==='POST'&&url.pathname==='/api/settings/search')return json(res,200,{searchProviders:await settings.save(body)});
if(req.method==='POST'&&url.pathname==='/api/research')return json(res,201,summary(await engine.create(body)));
const match=url.pathname.match(/^\/api\/research\/([a-f0-9-]{36})(?:\/(confirm|resume|download))?$/);if(match){const [,id,action]=match;if(req.method==='POST'&&(action==='confirm'||action==='resume')){return json(res,202,summary(await engine.start(id,body,action==='resume')));}if(req.method==='GET'){const r=await engine.store.get(id);if(action==='download'){if(!r.report)return json(res,409,{error:'报告尚未生成'});res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Content-Disposition':'attachment; filename="research-report.json"'});return res.end(JSON.stringify(r.report,null,2));}return json(res,200,summary(r));}}
return json(res,404,{error:'Not found'});
}catch(e){return json(res,400,{error:e instanceof Error?e.message:'Request failed'});}}).listen(Number(process.env.PORT||3210),'127.0.0.1',()=>console.log('IdeaProbe: http://localhost:'+ (process.env.PORT||3210)));
