<script lang="ts">
  import { enhance } from '$app/forms';
  import { setMode } from '../authLayoutStore';
  import toast from 'svelte-french-toast';
  import { button } from '@/styles/variants';
  import FileDrop from '@/components/FileDrop.svelte';
  import { ResponseStatus } from '../../../../../convex/responseStatuses';
  import AudioRecorder from '@/components/AudioRecorder.svelte';
  import { onMount } from 'svelte';
  import { getSessionId } from '@/lib/getSessionId';
  import { api, client } from '$lib/convexClient';

  // Sets the Layout Mode to White Background.
  setMode('new-account');

  // Forms
  const FORM_TOASTID = 'NEWACCOUNT';
  import {
    useForm,
    Hint,
    validators,
    minLength,
    maxLength,
    required
  } from 'svelte-use-form';
  import { goto } from '$app/navigation';
  const form = useForm();

  // +--- Extra States for the Form Files ---+
  let audioBioFile: File;
  let profileImageFile: File;

  async function handleSubmitForm(event: SubmitEvent) {
    event.preventDefault();
    if (!audioBioFile || !profileImageFile) return; // disable.

    try {
      const sessionId = getSessionId();
      if (!sessionId) return; // Typeguard. This is a protected route so it should always have this either way.

      // 1. PROFILE IMAGE UPLOAD: Generate Upload URL
      toast.loading('Uploading Files...', { id: FORM_TOASTID });

      let generateUrlResult = await client.mutation(
        api.upload.generateUploadUrl,
        {
          sessionId
        }
      );
      if (generateUrlResult.status === ResponseStatus.Fail) return;

      // 2. PROFILE IMAGE UPLOAD: Upload File
      toast.loading('Uploading Profile Image...', { id: FORM_TOASTID });
      const result1 = await fetch(generateUrlResult.uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': profileImageFile.type },
        body: profileImageFile
      });
      const { storageId: profilePictureId } = await result1.json();

      // 1. AUDIO BIO UPLOAD:  Generate Upload URL
      toast.loading('Uploading Audio Bio...', { id: FORM_TOASTID });

      generateUrlResult = await client.mutation(api.upload.generateUploadUrl, {
        sessionId
      });
      if (generateUrlResult.status === ResponseStatus.Fail) return;

      // 2. AUDIO BIO UPLOAD: Upload File
      const result2 = await fetch(generateUrlResult.uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': audioBioFile.type },
        body: audioBioFile
      });
      const { storageId: audioBioId } = await result2.json();

      // 3. Saving Data
      toast.loading('Saving Profile...', { id: FORM_TOASTID });

      const saveResult = await client.mutation(api.profile.create, {
        sessionId: sessionId,
        profilePictureId: profilePictureId,
        audioBioId: audioBioId,
        fullName: $form.values.fullName as string,
        oneLiner: $form.values.oneLiner as string
      });

      if (saveResult.status === 'Success') {
        toast.success('Saved Profile', { id: FORM_TOASTID });
        goto('/app');
      } else
        toast.error(`Failed to Save: ${saveResult.message}`, {
          id: FORM_TOASTID
        });
    } catch (e) {
      toast.error(`Failed to Save: ${e}`, {
        id: FORM_TOASTID
      });
    }
  }
</script>

<form
  class="flex flex-col gap-y-8"
  method="POST"
  id="loginform"
  on:submit={handleSubmitForm}
  use:form
>
  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-gray-800">
      Full Name
    </h2>
    <input
      type="text"
      class="border-b-2 border-gray-800 bg-transparent pb-2 text-xl text-gray-800 outline-none placeholder:text-gray-800/50"
      placeholder="Carlo Taleon"
      name="fullName"
      autocomplete="off"
      use:validators={[required, minLength(3)]}
    />
    <Hint for="fullName" on="required" class="text-red-400">Required.</Hint>
    <Hint for="fullName" on="minLength" let:value class="text-red-400">
      Your Full Name requires at least {value} characters.
    </Hint>
  </div>

  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-gray-800">
      One-Liner
    </h2>
    <input
      type="text"
      class="border-b-2 border-gray-800 bg-transparent pb-2 text-xl text-gray-800 outline-none placeholder:text-gray-800/50"
      placeholder="Awesome Engineer"
      autocomplete="off"
      name="oneLiner"
      use:validators={[required, minLength(3), maxLength(30)]}
    />
    <Hint for="oneLiner" on="required" class="text-red-400">Required.</Hint>
    <Hint for="oneLiner" on="minLength" let:value class="text-red-400">
      Your One-Liner requires at least {value} characters.
    </Hint>
    <Hint for="oneLiner" on="maxLength" let:value class="text-red-400">
      Your One-Liner shouldn't be more than {value} characters.
    </Hint>
  </div>

  <div class="flex flex-shrink-0 flex-col gap-y-3">
    <h2 class="font-productsans text-2xl font-semibold text-gray-800">
      Profile Picture
    </h2>
    <FileDrop
      id="myfiledrop"
      class="h-60 flex-shrink-0"
      name="profileImage"
      onFileDrop={(file) => {
        profileImageFile = file;
      }}
    />
    <Hint for="profilePictureId" on="required" class="text-red-400"
      >Required.</Hint
    >
  </div>

  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-gray-800">
      Audio Bio
    </h2>
  </div>
  <AudioRecorder
    name="audioBio"
    onRecordComplete={(file) => {
      audioBioFile = file;
    }}
  />
</form>

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
      class:
        'pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale'
    })}
    value="Get Started"
    disabled={!$form.valid || !audioBioFile || !profileImageFile}
  />
</div>
