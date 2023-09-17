<script lang="ts">
  import toast from 'svelte-french-toast';
  import AudioRecorder from './AudioRecorder.svelte';
  import NewPostRecorderModal from './Modals/NewPostRecorderModal.svelte';
  let recording = false;
  let currentProgress = 0;
  let limit = 10;
  let audioURL: string;
  let audioFile: File;

  import { openModal } from 'svelte-modals';

  function onRecordComplete() {
    openModal(NewPostRecorderModal, {
      audioFile: audioFile,
      audioURL: audioURL
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
    class="absolute left-0 right-0 top-0 rounded-md bg-white shadow-primary"
    style:height="70%"
  ></div>
  <span class="relative text-primary-500">
    {#if recording && currentProgress !== limit}
      Recording {currentProgress}s
    {:else if recording && currentProgress === limit}
      Record Complete!
    {:else}
      Record a New Post
    {/if}
  </span>
  <div
    class="relative grid transform place-items-center rounded-full bg-white shadow-primary"
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
        console.log(progress);
        currentProgress = progress;
      }}
      onRecordComplete={(file) => {
        audioFile = file;
        audioURL = URL.createObjectURL(file);

        setTimeout(() => {
          recording = false;
          onRecordComplete();
        }, 800);
      }}
      recordTimeLimit={limit}
    />
  </div>
</section>

<button on:click={onRecordComplete}>Open Modal</button>
