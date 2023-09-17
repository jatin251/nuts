<script lang="ts">
  import IconImage from '~icons/material-symbols/image-rounded';
  import { spring } from 'svelte/motion';
  import {
    spring as motionSpring,
    animate,
    inView,
    type AnimationControls
  } from 'motion';
  import cn from '@/lib/cx';
  import toast from 'svelte-french-toast';
  import { validators, type Validator } from 'svelte-use-form';

  // +--- Props ---+
  export let id: string;
  let className = '';
  export { className as class };
  export let onFileDrop: (file: File) => void;
  export let formValidators: Validator[] = [];
  export { formValidators as validators };

  // +--- State ---+
  let file: File; // bounded to input
  let imageObjectUrl: string;
  let dragHoverred = false;
  let imageIconScale = spring(45, {
    precision: 0.6,
    damping: 0.2,
    stiffness: 0.2
  });

  // +--- Element Bindings ---+
  let imageElement: HTMLImageElement;

  // +--- Animations ---+
  let imageElementAnimation: AnimationControls;

  $: {
    // When imageElement is available.
    if (imageElement) {
      imageElementAnimation = animate(
        imageElement,
        { scale: [1.2, 1.8, 1.1], opacity: [0.8, 1] },
        { easing: motionSpring() }
      );
      imageElementAnimation.stop();
    }
  }

  $: {
    // On imageObjectUrl change. Play animation.
    if (imageObjectUrl) imageElementAnimation.play();
  }

  // +--- Functions ---+
  function dropHandler(event: DragEvent) {
    event.preventDefault();

    imageIconScale.set(45);

    const _file = event?.dataTransfer?.files[0];

    if (!_file) return;
    if (
      !['image/png', 'image/jpeg', 'image/webp', 'image/jpg'].includes(
        _file?.type
      )
    ) {
      toast.error('You can only upload png, jpeg, and webp');
      return;
    }

    imageObjectUrl = URL.createObjectURL(_file);
    file = _file;
    onFileDrop?.(_file);
  }

  function onFileChange(
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) {
    if (!event.currentTarget || !event.currentTarget.files) return;
    if (!event.currentTarget?.files?.[0]) return;

    file = event.currentTarget.files[0];
    imageObjectUrl = URL.createObjectURL(file);
    onFileDrop?.(file);
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={cn('relative', className)}
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
    <img
      bind:this={imageElement}
      src={imageObjectUrl}
      alt="dropped"
      class={cn(
        'absolute inset-0 h-full w-full transform object-cover',
        imageObjectUrl ? '' : 'hidden'
      )}
    />
    {#if !imageObjectUrl}
      <div class="flex flex-col items-center gap-y-2 px-2">
        <IconImage
          class="relative text-primary-500 group-active:scale-90"
          font-size={$imageIconScale}
        />
        <span class="text-center text-primary-300"
          >Click here or Drag a file to upload.</span
        >
      </div>
    {/if}
  </div>

  <!-- File Input -->
  <input {id} class="aria-hidden hidden" type="file" on:change={onFileChange} />

  <!-- Form Value for Validator -->
  <input
    type="text"
    class="aria-hidden hidden"
    bind:value={imageObjectUrl}
    use:validators={formValidators}
    {...$$restProps}
  />
  <label class="absolute inset-0 block h-full w-full cursor-pointer" for={id} />
</div>
{#if file}
  <div class="truncate">{file.name}</div>
{/if}
