import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { createSession, mutationWithAuth, queryWithAuth } from './withAuth';

export const checkSession = queryWithAuth({
  args: {},
  handler: async (ctx) => {
    // 👆 Query with Auth already checks for session Id
    // so we can assume this is protected

    const user = await ctx.db.get(ctx.session.userId);

    if (!user)
      return {
        success: false,
        message: "Can't find user related to session."
      };

    return {
      success: true,
      userIsNew: user?.isNewAccount ?? true,
      message: 'Found user!'
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
      success: true,
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
        success: false
      };

    const user =
      userFromUsername.length === 0 ? userFromEmail[0] : userFromUsername[0];

    // 2. Check password
    const validPassword = compareSync(args.password, user.password);

    if (!validPassword)
      return {
        success: false
      };

    // 3. Create session
    const session = await createSession(ctx, user._id);

    return {
      success: true,
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
        success: true
      };
    }

    return {
      success: false
    };
  }
});
