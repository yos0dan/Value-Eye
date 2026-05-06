/// <reference types="@sveltejs/kit" />
import { build, files, version } from "$service-worker";

// Create a unique cache name for this deployment
const CACHE = `value-eye-cache-${version}`;

const ASSETS = [
  ...build, // the app itself build outputs
  ...files, // everything in `static` (images, manifest, css)
];

self.addEventListener("install", (event: any) => {
  // Create a new cache and add all files to it
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
});

self.addEventListener("activate", (event: any) => {
  // Remove previous cached data from disk
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  event.waitUntil(deleteOldCaches());
});

self.addEventListener("fetch", (event: any) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip non-http/https schemes (like chrome-extension://)
  if (!(url.protocol === 'http:' || url.protocol === 'https:')) return;

  // Bypass Service Worker for local development IPs to prevent Safari self-signed cert errors
  if (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname.startsWith("192.168.") ||
    url.hostname.startsWith("10.")
  ) {
    return;
  }

  async function respond() {
    const cache = await caches.open(CACHE);

    // Always serve exact assets from cache
    if (ASSETS.includes(url.pathname)) {
      const response = await cache.match(url.pathname);
      if (response) {
        return response;
      }
    }

    // For everything else, try the network first, fall back to cache
    try {
      const response = await fetch(event.request);

      if (!(response instanceof Response)) {
        throw new Error("invalid response from fetch");
      }

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch (err) {
      const response = await cache.match(event.request);
      if (response) {
        return response;
      }
      throw err;
    }
  }

  event.respondWith(respond());
});
