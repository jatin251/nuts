<script>
  // Icons

  import IconVerified from '~icons/mdi/check-decagram';

  import { client, api } from '@/lib/convexClient';
  import { getSessionId } from '@/lib/getSessionId';
  import { button } from '@/styles/variants';
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';
  import AudioPlayer from '@/components/AudioPlayer.svelte';
  import { goto } from '$app/navigation';
  import toast from 'svelte-french-toast';

  /**
   * @type {{ username: any; isVerified: any; oneLiner: any; status?: "Success"; profileImageUrl?: string | null; audioBioUrl?: string | null; fullName?: string | undefined; joinDate?: number; posts?: import("convex/server").Query<{ document: { _id: import("convex/values").GenericId<"posts">; _creationTime: number; caption?: string | undefined; userId: import("convex/values").GenericId<"users">; emojiTag: string; audioId: string; comments: { userId: import("convex/values").GenericId<"users">; commentId: string; comment: string; }[]; likes: number; likerIds: import("convex/values").GenericId<"users">[]; _lastModified: string; }; fieldPaths: ("userId" | "emojiTag" | "caption" | "audioId" | "comments" | "likes" | "likerIds" | "_lastModified" | "_creationTime") | "_id"; indexes: { by_userId: ["userId", "_creationTime"]; by_creation_time: ["_creationTime"]; }; searchIndexes: {}; vectorIndexes: {}; }> | null; message?: undefined; }}
   */
  let profile;

  onMount(async () => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    const _profileResult = await client.query(api.profile.getSelf, {
      sessionId: sessionId
    });

    if (_profileResult.status === 'Success') profile = _profileResult;
  });

  async function onLogoutClick() {
    toast.loading('Logging you out...', { id: 'LOGOUT' });
    const sessionId = getSessionId();
    if (!sessionId) return;

    const result = await client.mutation(api.auth.logout, { sessionId });
    if (result.status === 'Success') {
      goto('/');
      toast.success('Logged out. See you soon!', { id: 'LOGOUT' });
      return;
    }
    toast.error('Failed to logout.', { id: 'LOGOUT' });
  }
</script>

<div class="flex-1 bg-[#F3F3F3] pb-16">
  <div class="h-[60px]" />
  <div class="mx-auto flex w-full max-w-lg flex-col gap-y-2 px-9">
    <header>
      <section class="flex items-center justify-between gap-x-5">
        <div class="flex items-center gap-x-1">
          <h1 class="font-circularstd text-xl font-semibold">
            {profile?.fullName?.split(' ')?.[0] ?? '...'}
          </h1>
          {#if !profile?.isVerified}
            <IconVerified class="text-primary-500" font-size={20} />
          {/if}
        </div>
        {#if profile}
          <div class="text-sm text-primary-400">
            Joined {dayjs(profile?.joinDate)?.fromNow()}
          </div>
        {/if}
      </section>
      <p class="text-sm text-gray-500">{profile?.oneLiner}</p>
    </header>
    <img
      src={profile?.profileImageUrl}
      alt=""
      class="aspect-square w-full rounded-xl object-cover"
    />
    <div class="mt-2 flex flex-col gap-y-2">
      <h2 class="flex items-center gap-x-2 font-semibold">
        <span>🔈</span><span>Audio Bio</span>
      </h2>
      {#if profile?.audioBioUrl}
        <AudioPlayer
          id={profile?.username + '-audio-bio'}
          audioUrl={profile?.audioBioUrl}
        />
      {/if}
    </div>
    <button
      type="button"
      on:click={onLogoutClick}
      class={button({ size: 'base', class: 'mt-5' })}>Logout</button
    >
  </div>
</div>
