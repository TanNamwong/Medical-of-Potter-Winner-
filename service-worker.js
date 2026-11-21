// สุขภาพลูก — ทุกครั้งที่ปล่อยเวอร์ชันใหม่ ให้แก้ CACHE_NAME ให้ต่างจากเดิม
const CACHE_NAME='kids-health-v1.3.0';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(CACHE_NAME);
  await Promise.all(FILES.map(async f=>{try{const r=await fetch(f,{cache:'reload'});if(r.ok)await c.put(f,r)}catch(_){}}));
  if(!self.registration.active)await self.skipWaiting(); // ติดตั้งครั้งแรก ใช้ได้ทันที
})())});
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  const ks=await caches.keys();
  await Promise.all(ks.filter(k=>k.startsWith('kids-health-')&&k!==CACHE_NAME).map(k=>caches.delete(k)));
  await self.clients.claim();
})())});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.open(CACHE_NAME);
    const hit=await c.match(r,{ignoreSearch:true});if(hit)return hit;
    try{const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n}
    catch(_){if(r.mode==='navigate'){const i=await c.match('./index.html');if(i)return i}
      return new Response('ออฟไลน์',{status:503})}
  })());
});
