<script lang="ts">
  import { button } from '@/styles/variants';
  import IconLoading from '~icons/eos-icons/three-dots-loading';

  // Setting the mode (For layout styles)
  import { setMode } from '../authLayoutStore';
  setMode('login-register');

  // Forms
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import toast from 'svelte-french-toast';
  import cn from '@/lib/cx';

  export let form;
  const FORM_TOASTID = 'REGISTER';
  let loading = false;

  $: if (form) {
    if (form.status === 'Success' && form?.session?.sessionId) {
      // Save to local storage here
      localStorage.setItem('resonate-s', form?.session?.sessionId);

      toast.success('Credentials created!', { id: FORM_TOASTID });
      goto('/new-account');
    }
    if (form?.success === false) {
      toast.error('Failed to register.', { id: FORM_TOASTID });
    }
    loading = false;
  }
</script>

<svelte:head>
  <title>Resonate - Create Account</title>
</svelte:head>

<form
  class="flex flex-col gap-y-8"
  method="POST"
  id="registerform"
  use:enhance={() => {
    loading = true;
    toast.loading('Creating Account...', { id: FORM_TOASTID });
  }}
>
  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-white">Username</h2>
    <input
      type="text"
      class="border-b-2 border-white bg-transparent pb-2 text-xl text-white outline-none placeholder:text-white/50"
      placeholder="Create your username"
      name="username"
    />
  </div>

  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-white">Email</h2>
    <input
      type="email"
      class="border-b-2 border-white bg-transparent pb-2 text-xl text-white outline-none placeholder:text-white/50"
      placeholder="Use your existing email"
      name="email"
    />
  </div>

  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-white">Password</h2>
    <input
      type="password"
      class="border-b-2 border-white bg-transparent pb-2 text-xl text-white outline-none placeholder:text-white/50"
      placeholder="Create your password"
      name="password"
    />
  </div>
</form>

<!-- Simulate the height of the Button -->
<div class="h-49" />

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
      form="registerform"
      class={button({
        color: 'secondary',
        class: cn('pointer-events-auto', loading ? 'text-transparent' : '')
      })}
      value="Create Account"
    />
  </div>
</div>
