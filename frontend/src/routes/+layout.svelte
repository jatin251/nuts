<script lang="ts">
  import { Toaster } from 'svelte-french-toast';
  import { onNavigate } from '$app/navigation';
  import { start, done } from 'nprogress';

  import '@/styles/app.css';
  import '@/styles/nprogress.css';

  import { navigating } from '$app/stores';

  $: {
    if ($navigating) {
      start();
    } else done();
  }

  // onNavigate((navigation) => {
  //   start();

  //   return new Promise((resolve) => {
  //     done();
  //   });
  // });
</script>

<slot />

<Toaster />
