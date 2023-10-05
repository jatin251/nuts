<script lang="ts">
  import { enhance } from '$app/forms';
  import { button } from '@/styles/variants';
  import { goto } from '$app/navigation';
  import toast from 'svelte-french-toast';
  import IconError from '~icons/material-symbols/error-outline';
  import IconLoading from '~icons/eos-icons/three-dots-loading';

  // Setting the mode (For layout styles)
  import { setMode } from '../authLayoutStore';
  setMode('login-register');

  // Forms
  export let form;
  const FORM_TOASTID = 'LOGIN';
  let loading = false;

  $: if (form) {
    if (form.status === 'Success' && form?.session?.sessionId) {
      // Save to local storage here
      localStorage.setItem('ViChat-s', form?.session?.sessionId);

      toast.success('You have logged in.', { id: FORM_TOASTID });
      goto('/app');
    } else {
      toast.error('Failed to login.', { id: FORM_TOASTID });
    }
    loading = false;
  }

  import { page } from '$app/stores';
  import cn from '@/lib/cx';
  const message = $page.url.searchParams.get('message');
</script>

<svelte:head>
  <title>ViChat - Login</title>
</svelte:head>

{#if message}
  <div
    class="mb-5 flex items-center justify-center gap-x-2 rounded-md border-2 border-red-300 bg-red-500 px-3 py-6 text-white"
  >
    <IconError /> <span>{message}</span>
  </div>
{/if}
<form
  class="flex flex-col gap-y-8"
  method="POST"
  id="loginform"
  use:enhance={() => {
    loading = true;
    toast.loading('Logging in...', { id: FORM_TOASTID });
  }}
>
  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-white">Username</h2>
    <input
      type="text"
      class="border-b-2 border-white bg-transparent pb-2 text-xl text-white outline-none placeholder:text-white/50"
      placeholder="Enter username or email"
      name="usernameOrEmail"
    />
  </div>

  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-white">Password</h2>
    <input
      type="password"
      class="border-b-2 border-white bg-transparent pb-2 text-xl text-white outline-none placeholder:text-white/50"
      placeholder="Enter password"
      name="password"
    />
  </div>
</form>

<!-- Simulate the height of the Button -->
<div class="h-40" />

<!-- Make Button Stay at the Bottom for next pages -->
<div
  class="pointer-events-none fixed bottom-0 left-0 right-0 flex justify-center"
  style="padding-bottom: 10vh;"
>
  <div class="relative grid place-items-center">
    {#if loading}
      <IconLoading class="absolute z-10 text-primary-500" font-size={60} />
    {/if}
    <input
      type="submit"
      form="loginform"
      class={button({
        color: 'secondary',
        class: [
          'pointer-events-auto disabled:opacity-50',
          loading ? 'text-transparent' : ''
        ]
      })}
      disabled={loading}
      value="Login"
    />
  </div>
</div>
