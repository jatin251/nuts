// Basically the same as `convexClient`, just only works
// on the svelte frontend so I don't need to configure ssr.

import type { ConvexHttpClient } from 'convex/browser';
import type { api as ConvexAPI } from '@/../convex/_generated/api';
import { onMount } from 'svelte';

export let api: typeof ConvexAPI;
export let client: ConvexHttpClient;

onMount(async () => {
  const { api: _api, client: _client } = await import('./convexClient');
  api = _api;
  client = _client;
});
