<script lang="ts">
  import AudioPlayerCard from '@/components/AudioPlayerCard.svelte';
  import AudioRecorder from '@/components/AudioRecorder.svelte';
  import NewPostRecorder from '@/components/NewPostRecorder.svelte';
  import { api, client } from '@/lib/convexClient';
  import { getSessionId } from '@/lib/getSessionId';
  import { button } from '@/styles/variants';
  import {
    createInfiniteQuery,
    createMutation,
    createQuery,
    useQueryClient
  } from '@tanstack/svelte-query';
  import { inView, scroll } from 'motion';
  import { onMount } from 'svelte';
  import IconLoading from '~icons/eos-icons/three-dots-loading';

  // State for UI
  let isDone = false;

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

  const postsQuery = createInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }) => {
      const sessionId = await getSessionId();
      if (!sessionId) return; // Typeguard

      const getPostsResult = await client.query(api.post.get, {
        sessionId: sessionId,
        paginationOpts: {
          numItems: 2,
          cursor: pageParam ?? null // pageParam will be null meaning first fetch.
        }
      });

      if (getPostsResult.status === 'Fail') throw Error(getPostsResult.message);

      return getPostsResult;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.posts.isDone) return lastPage?.posts.continueCursor;
      isDone = true;
      return undefined; // No more pages to fetch
    }
  });

  const queryClient = useQueryClient();

  const likeMutation = createMutation({
    /** userId is for optimistic rendering only. */
    mutationFn: async (args: {
      postId: string;
      like: boolean;
      userId: string;
    }) => {
      const sessionId = await getSessionId();
      if (!sessionId) return; // Typeguard

      await client.mutation(api.post.likePost, {
        postId: args.postId as any,
        sessionId: sessionId,
        like: args.like
      });
    },
    // Optimistic Update (userId is for optimistic rendering)
    onMutate: async (args: {
      postId: string;
      like: boolean;
      userId: string;
    }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(['posts']);

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData<{
        pages: (typeof api.post.get)['_returnType'][];
      }>(['posts']);

      if (previousPosts && previousPosts.pages.at(0)?.status === 'Success') {
        let postIndex = -1;
        const pageIndex = previousPosts.pages.findIndex((page) => {
          if (page.status === 'Fail') return false;

          const _postIndex = page.posts.data.findIndex(
            (post) => post._id === args.postId
          );
          if (_postIndex === -1) return false;

          postIndex = _postIndex; // Found post (postIndex).
          return true; // Found page (pageIndex).
        });

        const newPostsData = (previousPosts.pages[pageIndex] as any).posts.data;

        // Add/Remove user to like Ids [].
        newPostsData[postIndex].likerIds = args.like
          ? [...newPostsData[postIndex].likerIds, args.userId as any]
          : newPostsData[postIndex].likerIds.filter(
              (likerId: string) => likerId !== args.userId
            );

        // Add/Subtract Like Count
        newPostsData[postIndex].likes = args.like
          ? newPostsData[postIndex].likes + 1
          : newPostsData[postIndex].likes - 1;

        // Set the values.
        queryClient.setQueryData<{
          pages: (typeof api.post.get)['_returnType'][];
        }>,
          {
            ...previousPosts,
            pages: {
              ...previousPosts.pages,
              pageIndex: {
                ...previousPosts.pages[pageIndex],
                posts: {
                  ...(previousPosts.pages[pageIndex] as any).posts,
                  data: newPostsData
                }
              }
            }
          };
      }

      return { previousPosts };
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(['posts']);
    }
  });

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

  $: pages =
    $postsQuery.data?.pages?.filter((page) => page !== undefined) ?? [];
  $: filteredPosts = pages.map((post) => post!.posts);
  $: posts = filteredPosts.map((post) => post.data).flat();

  onMount(() => {
    // Will fetch new posts using intersection observer.
    scroll(
      ({ y }) => {
        if (
          y.progress >= 0.9 &&
          !($postsQuery.isFetching || $postsQuery.isLoading) &&
          !isDone
        ) {
          $postsQuery.fetchNextPage();
        }
      },
      {
        // This is in +layout.svelte <main> which has overflow-auto.
        container: document.getElementById('main-app-container') ?? undefined
      }
    );
  });
</script>

<svelte:head>
  <title>ViChat | Explore</title>
</svelte:head>

<div class="flex-1 bg-[#F3F3F3] pb-16">
  <div class="h-[60px]" />
  <div class="mx-auto flex w-full max-w-lg flex-col gap-y-6 px-9">
    <NewPostRecorder />
    {#if $postsQuery.isLoading}
      <!-- Loading state -->
    {:else if posts}
      {#each posts as post (post._id)}
        <AudioPlayerCard
          fullName={post.user.fullName ?? ''}
          verified={post.user.isVerified ?? undefined}
          profilePictureUrl={post.user.profilePictureUrl ?? undefined}
          username={post.user.username}
          id={post._id}
          lastModified={post.lastModified}
          title={post.caption ?? ''}
          emojiTag={post.emojiTag}
          audioUrl={post.audioUrl ?? ''}
          likesCount={post.likes}
          likerIds={post.likerIds}
          currentUserId={$userQuery.data?.user._id || ''}
          {onLikeClick}
        />
      {/each}
    {/if}
    <div class="grid h-20 place-items-center text-primary-300">
      {#if isDone}
        You're caught up!
      {/if}
      {#if $postsQuery.isFetching || $postsQuery.isLoading}
        <IconLoading font-size={50} />
      {/if}
    </div>
    <!-- <AudioPlayerCard
      fullName="Carlo Taleon"
      verified={true}
      profilePictureUrl="https://avatars.githubusercontent.com/u/38070918?s=400&u=6551a26ca9b85f17911ac38c8dd262b85d57eb4b&v=4"
      username="carlo"
      id="first-audioplayer"
      lastModified="2023-09-10"
      title="Listen to this lol"
      emojiTag={'😂'}
      audioUrl={'https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.mp3'}
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
    /> -->
    <!-- <AudioPlayerCard
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
    /> -->
  </div>
</div>
