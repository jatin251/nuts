import { paginationOptsValidator } from 'convex/server';
import { mutationWithAuth, queryWithAuth } from './withAuth';
import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import { nanoid } from 'nanoid';
import { ResponseStatus } from './responseStatuses';
import { QueryCtx } from './_generated/server';

// +---- emulate a post service here -----+
async function getPostsByUserId(
  ctx: Omit<QueryCtx, 'auth'>,
  args: { userId: Id<'users'> }
) {
  const user = await ctx.db.get(args.userId);
  if (!user)
    return {
      status: ResponseStatus.Fail,
      message: 'Could not find user.'
    };

  // Query posts
  const posts = await ctx.db
    .query('posts')
    .withIndex('by_userId', (q) => q.eq('userId', args.userId))
    .order('desc')
    .collect();

  // JOINS
  // 1. Audio Urls
  const audioUrls = await Promise.all(
    posts.map(async (post) => {
      return await ctx.storage.getUrl(post.audioId)!;
    })
  );

  // 2. Profile Pictures
  const profilePictureUrl = user.profilePictureId
    ? await ctx.storage.getUrl(user.profilePictureId)
    : null;

  // 3. Finally join the posts
  const data = posts.map((post, index) => ({
    ...post,
    audioUrl: audioUrls[index],
    user: {
      _id: user._id,
      fullName: user.fullName,
      profilePictureUrl: profilePictureUrl,
      username: user.username,
      isVerified: user.isVerified
    }
  }));

  return {
    status: ResponseStatus.Success,
    posts: data
  };
}

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

    const userIds = posts.page.map((post) => post.userId);

    /** Contains an array of users per page (item in this array). */
    const users = await Promise.all(
      userIds.map(async (userId) => {
        const _user = (await ctx.db.get(userId))!; // Non-null assert (we know it exists)
        const profilePictureUrl = await ctx.storage.getUrl(
          _user.profilePictureId!
        );

        return {
          _id: _user._id,
          fullName: _user.fullName,
          profilePictureUrl: profilePictureUrl,
          username: _user.username,
          isVerified: _user.isVerified
        };
      })
    );

    const audioUrls = await Promise.all(
      posts.page.map(async (post) => {
        return await ctx.storage.getUrl(post.audioId)!;
      })
    );

    const data = posts.page.map((page, index) => {
      return {
        ...page,
        audioUrl: audioUrls[index],
        user: users[index]
      };
    });

    return {
      status: ResponseStatus.Success,
      posts: {
        continueCursor: posts.continueCursor,
        isDone: posts.isDone,
        data: data
      }
    };
  }
});

export const getSelf = queryWithAuth({
  args: {},
  handler: async (ctx) => {
    return await getPostsByUserId(ctx, {
      userId: ctx.session.userId
    });
  }
});

export const getByUser = queryWithAuth({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await getPostsByUserId(ctx, {
      userId: args.userId
    });
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
      lastModified: new Date().toISOString()
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

    let newLikerIds = post.likerIds;
    if (like && !newLikerIds.includes(ctx.session.userId)) {
      newLikerIds.push(ctx.session.userId);
    } else if (!like && newLikerIds.includes(ctx.session.userId)) {
      newLikerIds = post.likerIds.filter(
        (likerId) => likerId !== ctx.session.userId
      );
    }

    await ctx.db.patch(args.postId, {
      likes: newLikerIds.length,
      likerIds: newLikerIds
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
