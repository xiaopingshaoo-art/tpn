"use strict";
var SCOPE = self.registration.scope;
var PREFIX = "pn-calculator-" + encodeURIComponent(SCOPE) + "-";
var CACHE_NAME = PREFIX + "2026-11-09-glass-1";
var APP_URL = new URL("index.html", SCOPE).href;
var ASSETS = ["index.html","manifest.webmanifest","apple-touch-icon.png?v=20261109flow","icon-192.png","icon-192.png?v=20261109flow","icon-512.png"].map(function(path){return new URL(path,SCOPE).href;});
self.addEventListener("install",function(event){
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache){return cache.addAll(ASSETS);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener("activate",function(event){
  event.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(key){return key.indexOf(PREFIX)===0&&key!==CACHE_NAME;}).map(function(key){return caches.delete(key);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener("fetch",function(event){
  var request=event.request,url=new URL(request.url);
  if(request.method!=="GET"||url.origin!==new URL(SCOPE).origin||request.url.indexOf(SCOPE)!==0){return;}
  if(request.mode==="navigate"){
    event.respondWith(caches.open(CACHE_NAME).then(function(cache){
      var network=fetch(request).then(function(response){
        if(response.ok){return cache.put(APP_URL,response.clone()).then(function(){return response;});}
        return cache.match(APP_URL).then(function(cached){return cached||response;});
      }).catch(function(){return cache.match(APP_URL).then(function(cached){return cached||Response.error();});});
      event.waitUntil(network.then(function(){}));
      return cache.match(APP_URL).then(function(cached){
        if(!cached){return network;}
        return Promise.race([network,new Promise(function(resolve){setTimeout(function(){resolve(cached);},1800);})]);
      });
    }));
    return;
  }
  if(ASSETS.indexOf(url.href)<0){return;}
  event.respondWith(caches.open(CACHE_NAME).then(function(cache){
    return cache.match(request).then(function(cached){
      if(cached){return cached;}
      return fetch(request).then(function(response){if(response.ok){cache.put(request,response.clone());}return response;});
    });
  }));
});

