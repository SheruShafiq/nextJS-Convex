/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__SW_MANIFEST);

precacheAndRoute([
  { url: '/3dModels/CV.glb', revision: null },
  { url: '/3dModels/badgeMaker.glb', revision: null },
  { url: '/3dModels/neonBG.glb', revision: null },
  { url: '/3dModels/sauce.glb', revision: null },
  { url: '/3dModels/table.glb', revision: null },
]);
