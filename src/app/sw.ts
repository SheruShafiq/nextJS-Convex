import { installSerwist, defaultCache } from '@serwist/next/sw'
import type { PrecacheEntry } from '@serwist/precaching'

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[]
}

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache   // merge your own rules here
})