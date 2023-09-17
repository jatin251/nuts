<script lang="ts">
  import IconImage from '~icons/material-symbols/image-rounded';
  import { spring } from 'svelte/motion';
  import cn from '@/lib/cx';
  import toast from 'svelte-french-toast';

  // +--- Props ---+
  export let id: string;

  let className = '';
  export { className as class };

  // +--- State ---+
  let files: FileList; // bounded to input
  let storageId: string;
  let imageObjectUrl: string;
  let dragHoverred = false;
  let imageIconScale = spring(45, {
    precision: 0.6,
    damping: 0.2,
    stiffness: 0.2
  });

  $: {
    if (files?.length > 0) {
      imageObjectUrl = URL.createObjectURL(files[0]);
    }
  }

  // +--- Functions ---+
  function dropHandler(event: DragEvent) {
    event.preventDefault();
    console.log('File(s) dropped');
    imageIconScale.set(45);

    // Prevent default behavior (Prevent file from being opened)

    const file = event?.dataTransfer?.files[0];

    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      toast.error('You can only upload png, jpeg, and webp');
      return;
    }

    imageObjectUrl = URL.createObjectURL(file);
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  id="drop_zone"
  class={cn('relative h-full w-full', className)}
  on:dragover|preventDefault
  on:drop={dropHandler}
  on:dragenter={(ev) => {
    ev.preventDefault();
    dragHoverred = true;
    imageIconScale.set(60);
  }}
  on:dragleave={(ev) => {
    dragHoverred = false;
    imageIconScale.set(45);
  }}
>
  <div
    class={cn(
      'group relative inset-0 grid h-full w-full place-items-center overflow-hidden rounded-lg border border-primary-500 transition',
      dragHoverred ? 'bg-primary-100' : ''
    )}
  >
    {#if imageObjectUrl}
      <img
        src={imageObjectUrl}
        alt="dropped"
        class="absolute inset-0 h-full w-full transform object-cover"
      />
    {:else}
      <IconImage
        class="relative text-primary-500 group-active:scale-90"
        font-size={$imageIconScale}
      />
    {/if}
  </div>

  <!-- File Input -->
  <input {id} class="aria-hidden hidden" type="file" bind:files />

  <!-- Storage ID Input after Upload. -->
  <input
    type="text"
    class="aria-hidden hidden"
    bind:value={storageId}
    {...$$restProps}
  />
  <label class="absolute inset-0 block h-full w-full cursor-pointer" for={id} />
</div>
{#if files?.length > 0}
  <div>{files[0].name}</div>
{/if}
