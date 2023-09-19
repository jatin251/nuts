/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getSessionId } from '../getSessionId';
import { api, client } from '../convexClient';
import { derived } from 'svelte/store';
// import { readable } from 'svelte/store';

export const useLikeMutation = (postsKey: string) => {
  const queryClient = useQueryClient();

  const likeMutation = createMutation({
    mutationFn: async (args: {
      postId: string;
      like: boolean;
      userId: string;
    }) => {
      const sessionId = getSessionId();
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
      await queryClient.cancelQueries([postsKey]);

      type DataToEdit = (typeof api.post.getSelf)['_returnType'];
      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData<DataToEdit>([postsKey]);

      if (previousPosts?.status === 'Success') {
        const toEditIndex = previousPosts.posts.findIndex(
          (post) => post._id === args.postId
        );

        const newPosts = structuredClone(previousPosts);

        // Edit Like Count
        newPosts.posts[toEditIndex].likes = args.like
          ? newPosts.posts[toEditIndex].likes + 1 // To like
          : newPosts.posts[toEditIndex].likes - 1; // Remove like

        // Edit  Likers Array
        newPosts.posts[toEditIndex].likerIds = args.like
          ? [...newPosts.posts[toEditIndex].likerIds, args.userId as any]
          : newPosts.posts[toEditIndex].likerIds.filter(
              (likerId) => likerId !== args.userId
            );

        queryClient.setQueryData<DataToEdit>([postsKey], () => {
          return newPosts;
        });
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries([postsKey]);
    }
  });

  return derived(likeMutation, ($) => $);
};
