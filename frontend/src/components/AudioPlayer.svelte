<script lang="ts">
  import IconPlay from '~icons/ic/baseline-play-arrow';
  import IconPause from '~icons/ic/baseline-pause';

  import { baseButton, button } from '@/styles/variants';
  import { onMount } from 'svelte';
  import WaveSurfer from 'wavesurfer.js';
  import { spring } from 'svelte/motion';

  /** Must be unique */
  export let id: string;
  export let audioUrl: string;

  let wavesurfer: WaveSurfer | undefined;
  let loadingPercent: number = 0;

  onMount(() => {
    wavesurfer = WaveSurfer.create({
      container: `#${id}`,
      waveColor: '#d1d5db',
      progressColor: '#42D6B2',
      url: audioUrl,
      height: 40,
      barWidth: 5,
      barGap: 2,
      barRadius: 9999
    });

    wavesurfer.on('loading', (percent) => {
      loadingPercent = percent;
    });
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
      class:
        'grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary-500 text-white transition active:scale-90'
    })}
    on:click={onPlayClick}
  >
    {#if playing}
      <IconPause class="text-white" />
    {:else}
      <IconPlay class="text-white" />
    {/if}
  </button>
  <div class="h-10 w-full" {id}></div>
</div>
