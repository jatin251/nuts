<script lang="ts">
  import { Toaster } from 'svelte-french-toast';
  import { onNavigate } from '$app/navigation';
  import { start, done } from 'nprogress';

  import '@/styles/app.css';
  import '@/styles/nprogress.css';
  import 'tippy.js/dist/tippy.css';

  import { navigating } from '$app/stores';

  $: {
    if ($navigating) {
      start();
    } else done();
  }

  // +--- Svelte Query ---+
  import { browser } from '$app/environment';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser
      }
    }
  });
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>Resonate - A new audio-based social media</title>
  <meta name="title" content="Resonate - A new audio-based social media" />
  <meta
    name="description"
    content="A new audio-based social media built with Svelte and Convex. Hackathon project for webdev cody."
  />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="" />
  <meta
    property="og:title"
    content="Resonate - A new audio-based social media"
  />
  <meta
    property="og:description"
    content="A new audio-based social media built with Svelte and Convex. Hackathon project for webdev cody."
  />
  <meta property="og:image" content="og-image.jpg" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="" />
  <meta
    property="twitter:title"
    content="Resonate - A new audio-based social media"
  />
  <meta
    property="twitter:description"
    content="A new audio-based social media built with Svelte and Convex. Hackathon project for webdev cody."
  />
  <meta property="twitter:image" content="og-image.jpg" />

  <!-- Meta Tags Generated with https://metatags.io -->
</svelte:head>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>

<Toaster />
