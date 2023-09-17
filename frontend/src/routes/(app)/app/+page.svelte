<script lang="ts">
  import AudioPlayerCard from '@/components/AudioPlayerCard.svelte';
  import AudioRecorder from '@/components/AudioRecorder.svelte';
  import NewPostRecorder from '@/components/NewPostRecorder.svelte';
  import { onMount } from 'svelte';
</script>

<div class="flex-1 bg-[#F3F3F3] pb-16">
  <div class="h-[60px]" />
  <div class="mx-auto flex w-full max-w-lg flex-col gap-y-6 px-9">
    <NewPostRecorder />
    <AudioPlayerCard
      fullName="Carlo Taleon"
      verified={true}
      profilePictureUrl="https://avatars.githubusercontent.com/u/38070918?s=400&u=6551a26ca9b85f17911ac38c8dd262b85d57eb4b&v=4"
      username="carlo"
      id="first-audioplayer"
      lastModified="2023-09-10"
      title="Listen to this lol"
      emojiTag={'😂'}
      audioUrl="https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.mp3"
    />
    <AudioPlayerCard
      fullName="Anthony Excaliber"
      profilePictureUrl="https://avatars.githubusercontent.com/u/71301838?v=4"
      username="andrea"
      id="second-audioplayer"
      lastModified="2023-09-10"
      title="I went to the moon!"
      emojiTag={'🚀'}
      audioUrl="https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.mp3"
    />
    <AudioPlayerCard
      fullName="The Jed"
      verified={true}
      profilePictureUrl="https://avatars.githubusercontent.com/u/59909864?v=4"
      username="jed_adrian"
      id="third-audioplayer"
      lastModified="2023-09-10"
      title="Nice"
      emojiTag={'😢'}
      audioUrl="https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.mp3"
    />
    <AudioPlayerCard
      fullName="Carlo Taleon"
      verified={true}
      profilePictureUrl="https://avatars.githubusercontent.com/u/38070918?s=400&u=6551a26ca9b85f17911ac38c8dd262b85d57eb4b&v=4"
      username="carlo"
      id="fourth-audioplayer"
      lastModified="2023-09-10"
      title="Nice"
      emojiTag={'😢'}
      audioUrl="https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.mp3"
    />
  </div>
</div>
