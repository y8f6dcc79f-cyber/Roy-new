// Service worker: offline support for the insurance vault (same-origin files only)
const V='kaspet-v1';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.open(V),key=u.pathname,hit=await c.match(key);
    const net=fetch(r).then(res=>{if(res&&res.ok)c.put(key,res.clone());return res}).catch(()=>null);
    e.waitUntil(net);
    if(u.searchParams.has('c')||u.searchParams.has('v'))return (await net)||hit||Response.error();
    return hit||(await net)||Response.error();
  })());
});
