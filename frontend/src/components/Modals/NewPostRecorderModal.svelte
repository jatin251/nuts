<script lang="ts">
  // Icons
  import IconClose from '~icons/material-symbols/close-rounded';

  import { animate, inView, spring } from 'motion';
  import { onDestroy, onMount } from 'svelte';
  import { closeModal } from 'svelte-modals';
  import { baseButton, button } from '@/styles/variants';
  import AudioPlayerCard from '../AudioPlayerCard.svelte';

  // provided by <Modals />
  export let isOpen: boolean;
  export let audioFile: File;
  export let audioURL: string;

  onMount(() => {
    let animation = animate(
      '.modal',
      { scale: [0.8, 1] },
      { easing: spring({ velocity: 4 }) }
    );
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
    }, 100);
  }
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div
      class="mx-9 contents w-full max-w-lg rounded-xl border-2 border-primary-200 bg-primary-500 p-6"
    >
      <header class="flex justify-between">
        <h2>{''}</h2>
        <button
          on:click={onClose}
          class={baseButton({
            class: ' text-white transition active:scale-90'
          })}><IconClose font-size="25" /></button
        >
      </header>
      <AudioPlayerCard
        emojiTag=""
        fullName="Carlo"
        username="carlo"
        id="modal-audio-player"
        profilePictureUrl="https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcT6mjro1-LzvcDDVIzs4NhPaoPLyUR0jgUT8eG5XsmMTCXNBY22CIbWP59kfGhWAhJKczpk8oQAfZrVd_M"
        title="Some thing wong"
        audioUrl={audioURL}
      />
      <button class={button({ color: 'secondary', class: 'mt-5' })}>Post</button
      >
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
