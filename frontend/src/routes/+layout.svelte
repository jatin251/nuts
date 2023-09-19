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

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>

<Toaster />
