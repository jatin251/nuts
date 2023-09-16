<script lang="ts">
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import IconVerified from '~icons/mdi/check-decagram';
  import IconHeart from '~icons/ic/round-favorite';

  dayjs.extend(relativeTime);

  import AudioPlayer from './AudioPlayer.svelte';
  import classNames from 'classnames';
  import { baseButton } from '@/styles/variants';

  export let verified: boolean = false;
  export let fullName: string;
  export let username: string;
  export let profilePictureUrl: string | undefined;
  export let id: string;
  export let emojiTag: string;
  export let title: string;
  export let audioUrl: string;
  export let lastModified: string = '2023-09-10';
</script>

<card class="flex flex-col gap-y-[10px]">
  <header class="flex gap-x-3">
    <img src={profilePictureUrl} alt={username} class="h-9 w-9 rounded-full" />
    <div class="flex flex-col">
      <div class="flex items-center gap-x-1">
        <h2 class="font-circularstd font-medium">{fullName}</h2>
        {#if verified}
          <IconVerified class="text-primary-500" />
        {/if}
      </div>
      <p class="text-xs text-primary-400">@{username}</p>
    </div>
  </header>
  <div
    class="shadow-primary flex flex-col gap-y-[10px] rounded-md bg-white p-4"
  >
    <header class="flex justify-between">
      <div class="flex gap-x-3">
        <div>{emojiTag}</div>
        <h2 class="font-circularstd font-medium">{title}</h2>
      </div>

      <button class={baseButton({ class: 'flex items-center gap-x-1' })}>
        <span class="text-xs text-gray-300">24</span>
        <IconHeart
          class={classNames(false ? 'text-red-400' : 'text-gray-300')}
        />
      </button>
    </header>
    <div class="px-3">
      <AudioPlayer {id} {audioUrl} />
    </div>
    <footer class="text-xs font-thin text-gray-300">
      {dayjs(lastModified).fromNow()}
    </footer>
  </div>
</card>