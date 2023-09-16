<script lang="ts">
  import { enhance } from '$app/forms';
  import { button } from '@/styles/variants';
  import { goto } from '$app/navigation';

  export let form;

  import toast from 'svelte-french-toast';

  const FORM_TOASTID = 'LOGIN';

  let currentForm;

  $: if (form) {
    if (form?.success === true) {
      toast.success('You have logged in.', { id: FORM_TOASTID });
      goto('/app');
    }
    if (form?.success === false) {
      toast.error('Failed to login.', { id: FORM_TOASTID });
    }
  }
</script>

<form
  bind:this={currentForm}
  class="flex flex-col gap-y-8"
  method="POST"
  id="loginform"
  use:enhance={() => {
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
<div class="h-16" />

<!-- Make Button Stay at the Bottom for next pages -->
<div
  class="fixed bottom-0 left-0 right-0 flex justify-center"
  style="padding-bottom: 10vh;"
>
  <input
    type="submit"
    form="loginform"
    class={button({ color: 'secondary' })}
    value="Login"
  />
</div>
