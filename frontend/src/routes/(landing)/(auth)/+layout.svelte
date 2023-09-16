<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import cn from '@/lib/cx';

  onNavigate((navigation) => {
    if (!(document as any).startViewTransition) return;

    return new Promise((resolve) => {
      (document as any).startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<div class="flex min-h-screen flex-col bg-primary-500">
  <div class="flex h-full flex-grow items-center">
    <div
      class="mx-auto flex w-full max-w-xl flex-col justify-center gap-y-8 px-9"
    >
      <header>
        <div style="view-transition-name: resonate-logo;">
          <a href="/"
            ><h1 class="text-center font-circularstd text-2xl text-white">
              Resonate
            </h1></a
          >
        </div>
        <div class="flex w-full justify-between">
          <a
            href="/login"
            class={cn(
              { 'opacity-70': $page.url.pathname !== '/login' },
              'text-white transition duration-300 active:scale-90'
            )}>Login</a
          >
          <a
            href="/register"
            class={cn(
              { 'opacity-70': $page.url.pathname !== '/register' },
              'text-white transition duration-300 active:scale-90'
            )}>Create</a
          >
        </div>
      </header>

      <!-- Container -->
      <div class="" style="height: 30rem;">
        <slot />
      </div>
    </div>
  </div>
</div>
