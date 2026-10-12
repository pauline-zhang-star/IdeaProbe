import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Providers,BudgetError,parseBing,searchFailure} from '../app/providers.ts';
import {settings} from '../app/settings.ts';
test('all configured sources start concurrently, merge duplicates and tolerate one failure',async()=>{
 const original=globalThis.fetch, configured=settings.providers;
 settings.providers=async()=>[{name:'tavily',key:'test',enabled:true},{name:'brave',key:'test',enabled:true}];
 let started=0;let release:any;const barrier=new Promise<void>(resolve=>release=resolve);
 globalThis.fetch=async(url:any)=>{started++;if(started===2)release();await barrier;return new Response(JSON.stringify(String(url).includes('tavily')?{results:[{url:'https://example.com/',title:'Example',content:'text'}]}:{web:{results:[{url:'https://example.com/',title:'Example',description:'text'}]}}));};
 try{const r:any={usage:{searchCalls:0},budget:{maxSearches:4}};const hits=await new Providers().search(r,'memory');assert.equal(started,2);assert.equal(hits.length,1);assert.equal(hits[0].providers.length,2);assert.equal(r.usage.searchCalls,2);
 globalThis.fetch=async(url:any)=>{if(String(url).includes('tavily'))throw Error('failed');return new Response(JSON.stringify({web:{results:[{url:'https://other.example.com',title:'Other'}]}}));};assert.equal((await new Providers().search(r,'next')).length,1);assert.equal(r.searchAttempts.filter((a:any)=>a.status==='failed').length,1);
 await assert.rejects(()=>new Providers().search(r,'over budget'),BudgetError);
 }finally{globalThis.fetch=original;settings.providers=configured;}
});

test('Bing parses real feed shape and errors provide safe reasons',()=>{assert.deepEqual(parseBing('<rss><channel><item><title>A &amp; B</title><link>https://example.com/?x=1&amp;y=2</link><description><![CDATA[Real description]]></description></item></channel></rss>'),[{title:'A & B',url:'https://example.com/?x=1&y=2',text:'Real description'}]);assert.match(searchFailure(Error('HTTP 429')),/额度/);assert.match(searchFailure(new DOMException('timeout','TimeoutError')),/超时/);assert.match(searchFailure(Error('secret-key')),/未能获取/);});
