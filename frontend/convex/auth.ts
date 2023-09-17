import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { createSession, mutationWithAuth, queryWithAuth } from './withAuth';
import { ResponseStatus } from './responseStatuses';

export const checkSession = queryWithAuth({
  args: {},
  handler: async (ctx) => {
    // 👆 Query with Auth already checks for session Id
    // so we can assume this is protected

    const user = await ctx.db.get(ctx.session.userId);

    if (!user)
      return {
        status: ResponseStatus.Fail,
        message: "Can't find user related to session."
      };

    return {
      status: ResponseStatus.Success,
      userIsNew: user?.isNewAccount ?? (true as boolean)
    };
  }
});

export const register = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    password: v.string()
  },
  handler: async (ctx, args) => {
    // Hash the password
    const salt = await genSaltSync(10);
    const hashed_pass = await hashSync(args.password, salt);

    // Create the account
    const createdUserId = await ctx.db.insert('users', {
      username: args.username,
      email: args.email,
      password: hashed_pass,
      isNewAccount: true,
      isVerified: false
    });

    // Create session
    const session = await createSession(ctx, createdUserId);

    return {
      status: ResponseStatus.Success,
      session: session,
      username: args.username,
      email: args.email
    };
  }
});

export const login = mutation({
  args: {
    usernameOrEmail: v.string(),
    password: v.string()
  },
  handler: async (ctx, args) => {
    // 1. Find user
    const userFromUsername = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.usernameOrEmail))
      .collect();
    const userFromEmail = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.usernameOrEmail))
      .collect();

    if (userFromUsername.length === 0 && userFromEmail.length === 0)
      return {
        status: ResponseStatus.Fail,
        message: 'Invalid credentials.'
      };

    const user =
      userFromUsername.length === 0 ? userFromEmail[0] : userFromUsername[0];

    // 2. Check password
    const validPassword = compareSync(args.password, user.password);

    if (!validPassword)
      return {
        status: ResponseStatus.Fail,
        message: 'Invalid credentials.'
      };

    // 3. Create session
    const session = await createSession(ctx, user._id);

    return {
      status: ResponseStatus.Success,
      session: session,
      username: user.username,
      email: user.email
    };
  }
});

export const logout = mutationWithAuth({
  args: {},
  handler: async (ctx) => {
    const foundSession = ctx.session;

    if (foundSession) {
      await ctx.db.delete(foundSession._id);

      return {
        status: ResponseStatus.Success
      };
    }

    return {
      status: ResponseStatus.Fail
    };
  }
});
