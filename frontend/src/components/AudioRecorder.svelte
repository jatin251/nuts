<script lang="ts">
  // Icons
  import IconMicrophone from '~icons/solar/microphone-3-bold';
  import { baseButton } from '@/styles/variants';
  import cn from '@/lib/cx';

  import { onMount } from 'svelte';
  import {
    spring,
    type AnimationControls,
    timeline,
    type TimelineDefinition
  } from 'motion';

  //   +--- Deferred Variables ---+
  let stream: MediaStream | undefined;
  let media: any[] = [];
  let mediaRecorder: MediaRecorder | undefined;
  let finalAudioSrc: string | undefined;

  let animation: AnimationControls | undefined;

  // +--- Props ---+
  export let id: string = 'mic-button';

  // +--- State ---+
  let recording = false;

  // +--- Constants ---+
  let sequence: TimelineDefinition = [
    [`#${id}`, { scale: [1, 1.1, 1] }, { easing: spring({ stiffness: 0.7 }) }],
    [
      `#${id}`,
      { scale: [1.1, 1.4, 1.2] },
      { easing: spring({ stiffness: 0.4 }) }
    ],
    [`#${id}`, { scale: [1.3, 1.1] }, { easing: spring({ stiffness: 0.5 }) }],
    [`#${id}`, { scale: [1.2, 1] }, { easing: spring({ stiffness: 1 }) }]
  ];

  onMount(() => {
    animation = timeline(sequence, { duration: 1.5, repeat: Infinity });
    animation.stop();
  });

  // +--- Functions/Callbacks ---+
  function recordToggle() {
    if (recording) stopRecording();
    else startRecording();
  }

  async function startRecording() {
    media = [];
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => media.push(e.data);
    mediaRecorder.onstop = function (m) {
      const blob = new Blob(media, { type: 'audio/ogg; codecs=opus' });
      finalAudioSrc = window.URL.createObjectURL(blob);
    };

    mediaRecorder.start();
    animation?.play();
    recording = true;
  }

  function stopRecording() {
    if (!mediaRecorder) return;
    mediaRecorder.stop();

    stream?.getTracks().forEach(function (track) {
      track.stop();
    });
    recording = false;
    animation?.pause();
  }
</script>

<!-- @component An Audio Recorder input component
     under the hood it uses <input type="text" {...$$restProps} /> which holds
     the value of the storage Id the audio recording will be uploaded to.
     You can add other props here for form validation.
-->
<section class="flex items-center gap-x-6">
  <button
    on:click={recordToggle}
    class={baseButton({
      class:
        'grid h-20 w-20 flex-shrink-0 place-items-center rounded-full bg-primary-500 transition active:scale-90'
    })}
    type="button"
    ><IconMicrophone {id} class="text-white" font-size="25" /></button
  >

  <!-- Invisible Input -->
  <input type="text" class="hidden" {...$$restProps} />
  <!-- Audio UI -->
  <div class="relative w-full">
    <audio
      id="{id}-recorded-audio"
      controls
      class={cn('w-full', recording || !finalAudioSrc ? 'opacity-0' : '')}
      src={finalAudioSrc}
    >
      <source src={finalAudioSrc} type="audio/ogg" />
    </audio>

    {#if recording}
      <p class="absolute inset-0 flex items-center text-primary-500">
        Recording...
      </p>
    {:else if !finalAudioSrc}
      <p class="absolute inset-0 flex items-center text-primary-500">
        Let's get to know each other with our voice.
      </p>
    {/if}
  </div>
</section>
