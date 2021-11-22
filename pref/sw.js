const stat_cache='v1',
stat_files=['.','index.html','cards.css','socket_kl_cards.js','funct_cards.js','check_in_cards.js','chat_cards.js','icon.svg','manifest.json','maskable_icon.png','48.png','72.png','96.png','144.png','192.png','512.png']


self.addEventListener('install',ev=>{	
    ev.waitUntil(caches.open(stat_cache).then(cache=>cache.addAll(stat_files)))
})

 self.addEventListener('activate',async ev=>{
    const cache_names = await caches.keys()	
	await Promise.all(cache_names.filter(n=>n!==stat_cache).map(n=>caches.delete(n)))	
})

self.addEventListener('fetch',ev=>{	
	ev.respondWith(cachefirst(ev.request))
})

async function cachefirst(req){
	const c= await caches.match(req)
	return c ?? await fetch(req)
}
