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

  import { authLayoutStore } from './authLayoutStore';
  import type { Readable } from 'svelte/store';

  let mode: typeof $authLayoutStore.mode;

  $: {
    mode = $authLayoutStore.mode;
  }
</script>

<div
  class={cn(
    'flex min-h-screen flex-col transition duration-500',
    { 'bg-primary-500': mode === 'login-register' },
    { 'bg-white': mode === 'new-account' }
  )}
>
  <div class="flex h-full flex-grow">
    <div class="mx-auto flex w-full max-w-xl flex-col gap-y-8 px-9 pt-16">
      <header>
        <div style="view-transition-name: ViChat-logo;">
          <a
            href="/"
            class={cn({ 'pointer-events-none': mode === 'new-account' })}
            ><h1
              class={cn(
                'text-center font-circularstd text-2xl transition duration-500',
                { 'text-white': mode === 'login-register' },
                { 'text-primary-500': mode === 'new-account' }
              )}
            >
              ViChat
            </h1></a
          >
        </div>
        {#if mode === 'login-register'}
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
        {:else if mode === 'new-account'}
          <div class="flex justify-center">
            🎉 Welcome! But first, who are you?
          </div>
        {/if}
      </header>

      <!-- Container -->
      <div class="" style="height: 30rem;">
        <slot />
      </div>
    </div>
  </div>
</div>
