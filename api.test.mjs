import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=readFileSync(new URL('./api/analyze.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {default:handler,normalizeResult}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const data=Buffer.from('%PDF-1.4\nfictional test document').toString('base64');
const doc={data,mimeType:'application/pdf'};
const request=(body=doc,headers={})=>new Request('https://example.org/api/analyze',{method:'POST',headers:{'content-type':'application/json',...headers},body:typeof body==='string'?body:JSON.stringify(body)});
const valid={resume_score:65,summary:'Example',technical_skills:[],soft_skills:[],strengths:[],weaknesses:[],improvements:[],suitable_job_roles:[]};
test('rejects method, invalid JSON and foreign origins',async()=>{
 assert.equal((await handler(new Request('https://example.org/api/analyze'))).status,405);
 assert.equal((await handler(request('{'))).status,400);
 assert.equal((await handler(request(doc,{origin:'https://other.example'}))).status,403);
});
test('rejects MIME spoofing, invalid base64 and oversized documents',async()=>{
 assert.equal((await handler(request({data,mimeType:'image/png'}))).status,400);
 assert.equal((await handler(request({data:'not base64',mimeType:'application/pdf'}))).status,400);
 assert.equal((await handler(request(doc,{'content-length':'9000000'}))).status,413);
});
test('missing key fails without calling provider',async()=>{
 const old=process.env.API_KEY; delete process.env.API_KEY;
 try{assert.equal((await handler(request())).status,503);}finally{if(old!==undefined)process.env.API_KEY=old;}
});
test('validates response and bounds display estimates',()=>{
 assert.throws(()=>normalizeResult({summary:'Incomplete'}));
 const value=normalizeResult({...valid,resume_score:120,technical_skills:[{name:'Python',level:-8},null],strengths:[1,'Relevant evidence']});
 assert.equal(value.resume_score,100);assert.equal(value.technical_skills[0].level,0);assert.deepEqual(value.strengths,['Relevant evidence']);
});
test('provider key stays in server request and never in browser response',async()=>{
 const oldFetch=globalThis.fetch,oldKey=process.env.API_KEY;process.env.API_KEY='test-only-not-a-real-key';
 let providerRequest;
 globalThis.fetch=async(url,options)=>{providerRequest={url,options};return Response.json({candidates:[{content:{parts:[{text:JSON.stringify(valid)}]}}]});};
 try{
  const response=await handler(request());assert.equal(response.status,200);
  assert.equal(providerRequest.options.headers['x-goog-api-key'],'test-only-not-a-real-key');
  assert(!providerRequest.url.includes('test-only'));assert(!(await response.text()).includes('test-only'));
 }finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.API_KEY;else process.env.API_KEY=oldKey;}
});
test('provider failures expose a controlled error',async()=>{
 const oldFetch=globalThis.fetch,oldKey=process.env.API_KEY;process.env.API_KEY='test-only';
 globalThis.fetch=async()=>new Response('private upstream diagnostics',{status:429});
 try{const response=await handler(request());assert.equal(response.status,429);assert(!(await response.text()).includes('private upstream'));}
 finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.API_KEY;else process.env.API_KEY=oldKey;}
});
