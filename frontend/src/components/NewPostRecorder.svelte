<script lang="ts">
  import AudioRecorder from './AudioRecorder.svelte';
  import NewPostRecorderModal from './Modals/NewPostRecorderModal.svelte';
  let recording = false;
  let currentProgress = 0;
  let limit = 16;
  let audioUrl: string;
  let audioFile: File;

  import { openModal } from 'svelte-modals';

  function onRecordComplete() {
    openModal(NewPostRecorderModal, {
      audioFile: audioFile,
      audioUrl: audioUrl
    });
  }
</script>

<!-- @component NewPostRecorder extends from AudioRecorder
it's a special type of AudioRecorder that exists on the `/app` page.
-->
<section
  class="relative grid place-items-center gap-y-1 overflow-hidden px-3 py-4 pb-0"
>
  <div
    class="absolute left-0 right-0 top-0 rounded-md border-2 border-primary-200 bg-primary-500 shadow-primary"
    style:height="70%"
  ></div>
  <span class="relative text-primary-100">
    {#if recording && currentProgress !== limit}
      Recording {currentProgress}s
    {:else if recording && currentProgress === limit}
      Record Complete!
    {:else}
      Record a New Post
    {/if}
  </span>
  <div
    class="relative grid transform place-items-center rounded-full bg-[#F3F3F3] shadow-primary"
    style:width="100px"
    style:height="100px"
  >
    <AudioRecorder
      id="post-recorder"
      buttonOnly
      onRecordStart={() => {
        currentProgress = 0;
        recording = true;
      }}
      onRecordProgress={(progress) => {
        currentProgress = progress;
      }}
      onRecordComplete={(file) => {
        audioFile = file;
        audioUrl = URL.createObjectURL(file);
        onRecordComplete();

        setTimeout(() => {
          recording = false;
        }, 1000);
      }}
      recordTimeLimit={limit}
    />
  </div>
</section>

<!-- <button on:click={onRecordComplete}>Open Modal</button> -->
