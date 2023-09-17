import { paginationOptsValidator } from 'convex/server';
import { mutationWithAuth, queryWithAuth } from './withAuth';
import { v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { nanoid } from 'nanoid';
import { ResponseStatus } from './responseStatuses';

export const get = queryWithAuth({
  args: {
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    // POLISH: Apply some sort of algorithm here as well for getting the posts of friends
    // Do this later.

    const posts = await ctx.db
      .query('posts')
      .order('desc')
      .paginate(args.paginationOpts);

    return {
      status: ResponseStatus.Success,
      posts: posts
    };
  }
});

export const create = mutationWithAuth({
  args: {
    emojiTag: v.string(),
    audioId: v.string(),
    caption: v.string()
  },
  handler: async (ctx, args) => {
    const createdPostId = await ctx.db.insert('posts', {
      emojiTag: args.emojiTag,
      comments: [],
      audioId: args.audioId,
      likerIds: [],
      likes: 0,
      userId: ctx.session.userId,
      caption: args.caption,
      _lastModified: new Date().toISOString()
    });

    const createdPost = await ctx.db.get(createdPostId);

    if (!createdPost)
      return {
        status: ResponseStatus.Fail,
        message: 'Could not create post.'
      };

    return {
      status: ResponseStatus.Success,
      post: createdPost
    };
  }
});

export const likePost = mutationWithAuth({
  args: {
    postId: v.id('posts'),
    like: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const like = args.like ?? true;

    const post = await ctx.db.get(args.postId);
    if (!post)
      return {
        status: ResponseStatus.Fail,
        message: 'Post does not exist.'
      };

    await ctx.db.patch(args.postId, {
      likes: post.likes + 1,
      likerIds: like
        ? [...post.likerIds, ctx.session.userId]
        : post.likerIds.filter((likerId) => likerId !== ctx.session.userId)
    });

    return {
      status: ResponseStatus.Success,
      message: 'Like has been added.'
    };
  }
});

export const comment = mutationWithAuth({
  args: {
    postId: v.id('posts'),
    comment: v.string()
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post)
      return {
        status: ResponseStatus.Fail,
        message: 'Post does not exist.'
      };

    const newComment: Doc<'posts'>['comments'][number] = {
      commentId: nanoid(),
      comment: args.comment,
      userId: ctx.session.userId
    };

    await ctx.db.patch(args.postId, {
      comments: [...post.comments, newComment]
    });
  }
});
