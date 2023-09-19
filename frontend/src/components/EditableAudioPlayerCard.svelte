<script lang="ts">
  import IconHeart from '~icons/ic/round-favorite';

  import { baseButton } from '@/styles/variants';
  import AudioPlayer from './AudioPlayer.svelte';
  import { dayjs } from '@/lib/relativeDayjs';

  // Props
  export let title: string;
  export let emojiTag: string;
  export let audioUrl: string;
  export let creationTimeLabel: string = dayjs().fromNow();
  export let id: string = 'new-audio-post';

  //   +--- Element Bindings ---+
  import { onMount } from 'svelte';
  let emojiPicker: HTMLElement;
  import tippy from 'tippy.js';
  onMount(async () => {
    await import('emoji-picker-element');
    emojiPicker = document.querySelector('emoji-picker')!;
    emojiPicker.style.display = 'block';

    tippy('#emoji-picker-tippy', {
      theme: 'transparent',
      content: emojiPicker,
      hideOnClick: false,
      interactive: true,
      popperOptions: {
        placement: 'auto-end'
      },
      arrow: false
    });
  });

  function onEmojiClick(event: any) {
    emojiTag = event.detail.emoji.unicode;
  }
</script>

<div class="flex flex-col gap-y-[10px] rounded-md bg-white p-4 shadow-primary">
  <header class="flex justify-between">
    <div class="flex flex-1 gap-x-3">
      <button id="emoji-picker-tippy" class="w-5 transition active:scale-95"
        >{emojiTag}</button
      >
      <emoji-picker
        class="light h-80 w-80 overflow-hidden rounded-md"
        style="display:none"
        on:emoji-click={onEmojiClick}
      ></emoji-picker>

      <input
        bind:value={title}
        autofocus
        class="w-full font-circularstd font-medium outline-none"
        placeholder="What is this audio about?"
      />
    </div>

    <button class={baseButton({ class: 'flex items-center gap-x-1' })}>
      <IconHeart class="text-gray-300" />
      <span class="text-xs text-gray-300">0</span>
    </button>
  </header>
  <div class="px-3">
    <AudioPlayer {id} {audioUrl} />
  </div>
  <footer class="h-4 text-xs font-thin text-gray-300">
    {creationTimeLabel}
  </footer>
</div>

<style>
  emoji-picker {
    --num-columns: 12;
    --emoji-size: 1rem;
    --background: white;
    user-select: none;
  }
</style>
