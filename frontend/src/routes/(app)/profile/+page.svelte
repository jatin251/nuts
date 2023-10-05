<script lang="ts">
  // Icons
  import IconVerified from '~icons/mdi/check-decagram';

  import Skeleton from '@/components/Skeleton.svelte';

  import { client, api } from '@/lib/convexClient';
  import { getSessionId } from '@/lib/getSessionId';
  import { button } from '@/styles/variants';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);
  import { goto } from '$app/navigation';
  import toast from 'svelte-french-toast';
  import {
    createMutation,
    createQuery,
    useQueryClient
  } from '@tanstack/svelte-query';
  import ProfileBase from '@/components/ProfileBase.svelte';
  import AudioPlayerCard from '@/components/AudioPlayerCard.svelte';
  import { useLikeMutation } from '@/lib/services/likeMutation';

  const profileQuery = createQuery({
    queryKey: ['profileData'],
    queryFn: async () => {
      const sessionId = getSessionId();
      if (!sessionId) return;

      const _profileResult = await client.query(api.profile.getSelf, {
        sessionId: sessionId
      });

      if (_profileResult.status === 'Fail')
        throw new Error(_profileResult.message);

      return _profileResult;
    }
  });

  const postsQuery = createQuery({
    queryKey: ['profilePosts'],
    queryFn: async () => {
      const sessionId = getSessionId();
      if (!sessionId) return;

      const _postsResult = await client.query(api.post.getSelf, {
        sessionId: sessionId
      });

      if (_postsResult.status === 'Fail') throw new Error(_postsResult.message);

      return _postsResult;
    }
  });

  const userQuery = createQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const sessionId = getSessionId();
      if (!sessionId) return; // Typeguard

      const user = await client.query(api.auth.currentUser, {
        sessionId: sessionId
      });

      if (user.status === 'Fail') throw Error(user.message);

      return user;
    }
  });
  $: currentUser = $userQuery.data?.user;

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

  const likeMutation = useLikeMutation('profilePosts');

  async function onLikeClick({
    like,
    postId
  }: {
    like: boolean;
    postId: string;
  }) {
    if (!currentUser) return;

    const result = await $likeMutation.mutateAsync({
      like: like,
      postId: postId,
      userId: currentUser._id
    });
  }

  $: profile = $profileQuery?.data;
</script>

<svelte:head>
  <title>ViChat | Profile</title>
</svelte:head>

<div class="flex-1 bg-[#F3F3F3] pb-16">
  <div class="h-[60px]" />
  <div class="mx-auto flex w-full max-w-lg flex-col gap-y-2 px-9">
    <ProfileBase
      loading={$profileQuery.isLoading}
      audioBioUrl={profile?.audioBioUrl ?? ''}
      fullName={profile?.fullName ?? ''}
      joinDate={profile?.joinDate ?? ''}
      oneLiner={profile?.oneLiner ?? ''}
      profileImageUrl={profile?.profileImageUrl ?? ''}
      username={profile?.username ?? ''}
      isVerified={profile?.isVerified}
    />

    <button
      type="button"
      on:click={onLogoutClick}
      class={button({ size: 'base', class: 'mt-5' })}>Logout</button
    >

    <h2 class="mt-5 font-semibold">Activity</h2>
    {#each $postsQuery?.data?.posts ?? [] as post (post._id)}
      <AudioPlayerCard
        audioUrl={post.audioUrl ?? ''}
        emojiTag={post.emojiTag}
        fullName={post.user.fullName ?? ''}
        id={post._id}
        profilePictureUrl={post.user.profilePictureUrl ?? ''}
        title={post.caption ?? ''}
        username={post.user.username}
        lastModified={post.lastModified}
        likerIds={post.likerIds}
        likesCount={post.likes}
        verified={post.user.isVerified}
        currentUserId={currentUser?._id}
        {onLikeClick}
      />
    {/each}
    {#if !$postsQuery?.data?.posts || $postsQuery.data.posts.length <= 0}
      <p class="text-gray-400">No Activity Yet.</p>
    {/if}
  </div>
</div>
