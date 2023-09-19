<script lang="ts">
  import IconVerified from '~icons/mdi/check-decagram';

  import { dayjs } from '$lib/relativeDayjs';
  import AudioPlayer from './AudioPlayer.svelte';
  import Skeleton from './Skeleton.svelte';

  export let loading = false;
  export let fullName: string;
  export let oneLiner: string;
  export let username: string;
  export let audioBioUrl: string;
  export let profileImageUrl: string;
  export let isVerified: boolean = false;
  export let joinDate: string | number;
</script>

<div class="flex flex-col gap-y-2">
  <header>
    <section class="flex items-center justify-between gap-x-5">
      <div class="flex items-center gap-x-1">
        {#if loading}
          <Skeleton class="mb-1 h-6 w-12 rounded-md" />
        {:else}
          <h1 class="font-circularstd text-xl font-semibold">
            {fullName.split(' ')?.[0] ?? '...'}
          </h1>
        {/if}
        {#if isVerified}
          <IconVerified class="text-primary-500" font-size={20} />
        {/if}
      </div>
      {#if joinDate}
        <div class="text-sm text-primary-400">
          Joined {dayjs(joinDate)?.fromNow()}
        </div>
      {/if}
    </section>
    {#if loading}
      <Skeleton class="h-5 w-32 rounded-md" />
    {:else}
      <p class="text-sm text-gray-500">
        {oneLiner}
      </p>
    {/if}
  </header>
  {#if loading}
    <Skeleton class="aspect-square w-full rounded-md" />
  {:else}
    <img
      src={profileImageUrl}
      alt=""
      class="aspect-square w-full rounded-xl object-cover"
    />
  {/if}
  <div class="mt-2 flex flex-col gap-y-2">
    <h2 class="flex items-center gap-x-2 font-semibold">
      <span>🔈</span><span>Audio Bio</span>
    </h2>
    {#if audioBioUrl}
      {#key audioBioUrl}
        <AudioPlayer id={'audio-bio' + username} audioUrl={audioBioUrl} />
      {/key}
    {/if}
  </div>
</div>
