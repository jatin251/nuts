<script>
  import { enhance } from '$app/forms';
  import { setMode } from '../authLayoutStore';
  import toast from 'svelte-french-toast';
  import { button } from '@/styles/variants';
  import FileDrop from '@/components/FileDrop.svelte';
  setMode('new-account');

  // Forms
  // export let form;
  const FORM_TOASTID = 'NEWACCOUNT';
  let currentForm;

  // $: if (form) {
  //   if (form?.success === true && form?.session?.sessionId) {
  //     // Save to local storage here
  //     localStorage.setItem('resonate-s', form?.session?.sessionId);

  //     toast.success('You have logged in.', { id: FORM_TOASTID });
  //     goto('/app');
  //   }
  //   if (form?.success === false) {
  //     toast.error('Failed to login.', { id: FORM_TOASTID });
  //   }
  // }

  import {
    useForm,
    Hint,
    validators,
    minLength,
    required
  } from 'svelte-use-form';

  const form = useForm();
</script>

<form
  class="flex flex-col gap-y-8"
  method="POST"
  id="loginform"
  use:enhance={() => {
    toast.loading('Logging in...', { id: FORM_TOASTID });
  }}
  use:form
>
  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-gray-800">
      Full Name
    </h2>
    <input
      type="text"
      class="border-b-2 border-gray-800 bg-transparent pb-2 text-xl text-gray-800 outline-none placeholder:text-gray-800/50"
      placeholder="Enter username or email"
      name="fullName"
      use:validators={[required]}
    />
  </div>

  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-gray-800">
      One-Liner
    </h2>
    <input
      type="text"
      class="border-b-2 border-gray-800 bg-transparent pb-2 text-xl text-gray-800 outline-none placeholder:text-gray-800/50"
      placeholder="Enter username or email"
      name="oneLiner"
      use:validators={[required]}
    />
  </div>

  <div class="flex flex-col gap-y-3">
    <h2 class="font-productsans text-2xl font-semibold text-gray-800">
      Profile Picture
    </h2>
    <FileDrop id="myfiledrop" class="h-60" />
    <!-- <input
      type="text"
      class="border-b-2 border-gray-800 bg-transparent pb-2 text-xl text-gray-800 outline-none placeholder:text-gray-800/50"
      placeholder="Enter password"
      name="profilePicture"
    /> -->
  </div>

  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-gray-800">
      Audio Bio
    </h2>
    <input
      type="text"
      class="border-b-2 border-gray-800 bg-transparent pb-2 text-xl text-gray-800 outline-none placeholder:text-gray-800/50"
      placeholder="Enter password"
      name="profilePicture"
    />
  </div>
</form>

<div>{$form.valid ? 'Yes' : 'No'}</div>

<!-- Simulate the height of the Button -->
<div class="h-40" />

<!-- Make Button Stay at the Bottom for next pages -->
<div
  class="pointer-events-none fixed bottom-0 left-0 right-0 flex justify-center"
  style="padding-bottom: 10vh;"
>
  <input
    type="submit"
    form="loginform"
    class={button({
      class: 'pointer-events-auto cursor-not-allowed disabled:opacity-50'
    })}
    value="Get Started"
    disabled={!$form.valid}
  />
</div>
