import { ResponseStatus } from './responseStatuses';
import { randChoice } from './utils/randChoice';
import { mutationWithAuth, queryWithAuth } from './withAuth';
import { v } from 'convex/values';

export const create = mutationWithAuth({
  args: {
    fullName: v.string(),
    oneLiner: v.string(),
    profilePictureId: v.string(),
    audioBioId: v.string()
  },
  handler: async (ctx, args) => {
    const session = ctx.session;

    await ctx.db.patch(session.userId, {
      fullName: args.fullName,
      oneLiner: args.oneLiner,
      profilePictureId: args.profilePictureId,
      audioBioId: args.audioBioId,
      isNewAccount: false
    });

    return {
      status: ResponseStatus.Success,
      message: 'Profile is created.'
    };
  }
});

export const getSelf = queryWithAuth({
  args: {},
  handler: async (ctx) => {
    // probably wrap below in a function.
    const user = await ctx.db.get(ctx.session.userId);

    if (!user)
      return {
        status: ResponseStatus.Fail,
        message: 'User not found.'
      };

    let profileImageUrl = null;
    if (user.profilePictureId)
      profileImageUrl = await ctx.storage.getUrl(user.profilePictureId);

    let audioBioUrl = null;
    if (user.audioBioId)
      audioBioUrl = await ctx.storage.getUrl(user.audioBioId);

    return {
      status: ResponseStatus.Success,
      profileImageUrl: profileImageUrl,
      audioBioUrl: audioBioUrl,
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      oneLiner: user.oneLiner,
      joinDate: user._creationTime,
      isVerified: user.isVerified
    };
  }
});

export const getById = queryWithAuth({
  args: {
    userId: v.id('users')
  },
  handler: async (ctx, args) => {
    // probably wrap below in a function.
    const user = await ctx.db.get(args.userId);

    if (!user)
      return {
        status: ResponseStatus.Fail,
        message: 'User not found.'
      };

    let profileImageUrl = null;
    if (user.profilePictureId)
      profileImageUrl = await ctx.storage.getUrl(user.profilePictureId);

    let audioBioUrl = null;
    if (user.audioBioId)
      audioBioUrl = await ctx.storage.getUrl(user.audioBioId);

    return {
      status: ResponseStatus.Success,
      profileImageUrl: profileImageUrl,
      audioBioUrl: audioBioUrl,
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      oneLiner: user.oneLiner,
      joinDate: user._creationTime,
      isVerified: user.isVerified
    };
  }
});

export const getRandom = queryWithAuth({
  args: {
    previousUserId: v.optional(v.id('users'))
  },
  handler: async (ctx, args) => {
    // If still can't find a unique user after 10, just give it anyway.
    // To avoid longrunning query.
    const MAX_ROLLS = 10;

    const allUsers = await ctx.db.query('users').collect();
    const session = await ctx.session;
    const userMe = await ctx.db.get(session.userId);
    if (!userMe)
      return {
        status: ResponseStatus.Fail,
        message: 'Current user not found.'
      };

    // Roll for random user
    let randomUser = randChoice(allUsers);
    let rollCount: number = 0;
    // Keep rolling if same as current user OR if new account (new accounts dont have profile pictures etc.)
    while (
      randomUser._id === userMe?._id ||
      randomUser.isNewAccount ||
      randomUser._id === args.previousUserId
    ) {
      randomUser = randChoice(allUsers);

      rollCount += 1;
      if (rollCount >= MAX_ROLLS) break;
    }

    // probably wrap below in a function.
    const user = await ctx.db.get(randomUser._id);

    if (!user)
      return {
        status: ResponseStatus.Fail,
        message: 'Random User not found.'
      };

    let profileImageUrl = null;
    if (user.profilePictureId)
      profileImageUrl = await ctx.storage.getUrl(user.profilePictureId);

    let audioBioUrl = null;
    if (user.audioBioId)
      audioBioUrl = await ctx.storage.getUrl(user.audioBioId);

    return {
      status: ResponseStatus.Success,
      profileImageUrl: profileImageUrl,
      audioBioUrl: audioBioUrl,
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      oneLiner: user.oneLiner,
      joinDate: user._creationTime,
      isVerified: user.isVerified
    };
  }
});
