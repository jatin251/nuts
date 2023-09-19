<script lang="ts">
  import AudioPlayerCard from '@/components/AudioPlayerCard.svelte';
  import ProfileBase from '@/components/ProfileBase.svelte';
  import SwipableButton from '@/components/SwipableButton.svelte';
  import { api, client } from '@/lib/convexClient';
  import { getSessionId } from '@/lib/getSessionId';
  import { useLikeMutation } from '@/lib/services/likeMutation';
  import { createQuery } from '@tanstack/svelte-query';

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

  const profileQuery = createQuery({
    queryKey: ['random-profile-data'],
    queryFn: async () => {
      const sessionId = getSessionId();
      if (!sessionId) return;

      const _profileResult = await client.query(api.profile.getRandom, {
        sessionId: sessionId
      });

      if (_profileResult.status === 'Fail')
        throw new Error(_profileResult.message);

      return _profileResult;
    },
    networkMode: 'online'
  });

  $: profile = $profileQuery.data;

  $: postsQuery = createQuery({
    queryKey: ['random-profile-posts'],
    queryFn: async () => {
      const sessionId = getSessionId();
      if (!sessionId) return;

      const _postsResult = await client.query(api.post.getByUser, {
        sessionId: sessionId,
        userId: $profileQuery?.data?._id as any
      });

      if (_postsResult.status === 'Fail') throw new Error(_postsResult.message);

      return _postsResult;
    },
    enabled: $profileQuery?.data?._id !== undefined
  });

  const likeMutation = useLikeMutation('random-profile-posts');

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
</script>

<svelte:head>
  <title>Resonate | Meet new People</title>
</svelte:head>

<div class="relative flex-1 bg-[#F3F3F3] pb-16">
  <div class="h-[60px]" />
  <div class="mx-auto flex w-full max-w-lg flex-col gap-y-2 px-9">
    <ProfileBase
      loading={$profileQuery.isLoading || $profileQuery.isFetching}
      audioBioUrl={profile?.audioBioUrl ?? ''}
      fullName={profile?.fullName ?? ''}
      joinDate={profile?.joinDate ?? ''}
      oneLiner={profile?.oneLiner ?? ''}
      profileImageUrl={profile?.profileImageUrl ?? ''}
      username={profile?.username ?? ''}
      isVerified={profile?.isVerified}
    />
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

  {#if $profileQuery?.data}
    <SwipableButton
      onSwipeMaxRelease={() => {
        $profileQuery.refetch();
      }}
    />
  {/if}
</div>
