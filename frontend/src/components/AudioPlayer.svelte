<script lang="ts">
  import IconPlay from '~icons/ic/baseline-play-arrow';
  import IconPause from '~icons/ic/baseline-pause';
  import IconLoading from '~icons/eos-icons/loading';

  import { baseButton, button } from '@/styles/variants';
  import { onMount } from 'svelte';
  import WaveSurfer from 'wavesurfer.js';
  import { spring } from 'svelte/motion';
  import cn from '@/lib/cx';

  /** Must be unique */
  export let id: string;
  export let audioUrl: string;

  let wavesurfer: WaveSurfer | undefined;
  let loadingPercent: number = 0;
  let audioIsReady: boolean = false;

  onMount(() => {
    wavesurfer = WaveSurfer.create({
      container: `#${id}`,
      waveColor: '#d1d5db',
      progressColor: '#42D6B2',
      url: audioUrl,
      height: 40,
      barWidth: 5,
      barGap: 2,
      barRadius: 9999,
      sampleRate: 3000
    });

    wavesurfer.on('ready', () => {
      audioIsReady = true;
    });

    wavesurfer.on('loading', (percent) => {
      loadingPercent = percent;
    });

    wavesurfer.getDecodedData();
  });

  let playing = false;

  function onPlayClick() {
    if (!wavesurfer) return;
    if (playing) {
      wavesurfer.pause();
      playing = false;
    } else {
      wavesurfer.play();
      playing = true;
    }
  }
</script>

<div class="flex items-center gap-x-3">
  <button
    class={baseButton({
      class: cn(
        'grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary-500 text-white transition active:scale-90 disabled:opacity-70'
      )
    })}
    on:click={onPlayClick}
    disabled={!audioIsReady}
  >
    {#if !audioIsReady}
      <IconLoading class="text-white" />
    {:else if playing}
      <IconPause class="text-white" />
    {:else}
      <IconPlay class="text-white" />
    {/if}
  </button>
  <div class="relative h-10 w-full">
    {#if !audioIsReady}
      <div
        class="absolute inset-0 flex flex-shrink-0 items-center text-sm text-primary-400"
      >
        {loadingPercent !== 100 ? `Loading ${loadingPercent}%` : 'Decoding'}...
      </div>
    {/if}
    <div class="h-10 w-full" {id}></div>
  </div>
</div>
