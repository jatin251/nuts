<script lang="ts">
  // Icons
  import IconClose from '~icons/material-symbols/close-rounded';
  import IconLoading from '~icons/eos-icons/three-dots-loading';

  import { animate, spring } from 'motion';
  import { onDestroy, onMount } from 'svelte';
  import { closeModal } from 'svelte-modals';
  import { baseButton, button } from '@/styles/variants';
  import EditableAudioPlayerCard from '../EditableAudioPlayerCard.svelte';
  import { createMutation, useQueryClient } from '@tanstack/svelte-query';
  import { api, client } from '@/lib/convexClient';
  import toast from 'svelte-french-toast';
  import { getSessionId } from '@/lib/getSessionId';

  // provided by <Modals />
  export let isOpen: boolean;
  export let audioFile: File;
  export let audioUrl: string;

  // States (For POST)
  let caption: string = '';
  let emojiTag: string = '🍀';

  onMount(() => {
    // Modal enter animation
    animate('.modal', { scale: [0.8, 1] }, { easing: spring({ velocity: 4 }) });
  });

  onDestroy(() => {
    animate('.modal', { scale: [1, 0.8] }, { easing: spring({ velocity: 4 }) });
  });

  function onClose() {
    animate(
      '.modal',
      { scale: [1, 0], opacity: [1, 0] },
      { easing: 'ease-out' }
    );
    setTimeout(() => {
      closeModal();
    }, 800);

    const queryClient = useQueryClient();
    queryClient.invalidateQueries(['posts']);
  }

  const createPost = createMutation({
    mutationFn: async ({
      audioFile,
      caption,
      emojiTag
    }: {
      audioFile: File;
      caption: string;
      emojiTag: string;
    }) => {
      const sessionId = getSessionId();
      if (!sessionId) return; // Typeguard

      // 1. Create Upload URL
      toast.loading('Uploading Audio...', { id: 'CREATE_POST' });
      const generateUrlResult = await client.mutation(
        api.upload.generateUploadUrl,
        {
          sessionId
        }
      );
      if (generateUrlResult.status === 'Fail')
        throw Error('Failed to generate Id');

      // 2. Upload File
      const result1 = await fetch(generateUrlResult.uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': audioFile.type },
        body: audioFile
      });
      const { storageId: audioId } = await result1.json();

      await client.mutation(api.post.create, {
        audioId: audioId,
        caption: caption,
        emojiTag: emojiTag,
        sessionId: sessionId
      });

      toast.success('New Post Created!', { id: 'CREATE_POST' });
    }
  });

  async function onPostClick() {
    try {
      await $createPost.mutateAsync({
        audioFile,
        caption,
        emojiTag
      });

      onClose();
    } catch (e) {
      toast.error(`Failed to Post ${e}`, { id: 'CREATE_POST' });
    }
  }
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div
      class="mx-9 contents w-full max-w-lg rounded-xl border-2 border-primary-200 bg-primary-500 p-6"
    >
      <header class="mb-5 flex justify-between">
        <h2>{''}</h2>
        <button
          on:click={onClose}
          class={baseButton({
            class: ' text-white transition active:scale-90'
          })}><IconClose font-size="25" /></button
        >
      </header>
      <EditableAudioPlayerCard {audioUrl} bind:emojiTag bind:title={caption} />
      <button
        class={button({
          color: 'secondary',
          class: 'relative mt-5 flex h-14 items-center justify-center gap-x-4'
        })}
        on:click={onPostClick}
        disabled={$createPost.isLoading}
      >
        {#if $createPost.isLoading}
          <IconLoading class="absolute" font-size={45} />
        {:else}
          <span>Post</span>
        {/if}
      </button>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    z-index: 101;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    /* allow click-through to backdrop */
    /* pointer-events: none; */
  }

  .contents {
    min-width: 240px;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
  }
</style>
