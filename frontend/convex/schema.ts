import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  posts: defineTable({
    userId: v.id('users'),
    emojiTag: v.string(),
    caption: v.optional(v.string()),
    audioId: v.string(),
    comments: v.array(
      v.object({
        commentId: v.string(),
        userId: v.id('users'),
        comment: v.string()
      })
    ),
    /** written count for optimized query. */
    likes: v.number(),
    likerIds: v.array(v.id('users')),
    _lastModified: v.string()
  }).index('by_userId', ['userId']),
  friends: defineTable({
    first: v.id('users'),
    second: v.id('users')
  }),
  users: defineTable({
    fullName: v.optional(v.string()),
    oneLiner: v.optional(v.string()),
    profilePictureId: v.optional(v.string()),
    audioBioId: v.optional(v.string()),
    username: v.string(),
    password: v.string(),
    email: v.string(),
    isVerified: v.boolean(),
    isNewAccount: v.boolean()
  })
    .index('by_username', ['username'])
    .index('by_email', ['email']),
  sessions: defineTable({
    sessionId: v.string(),
    userId: v.id('users'),
    maxAge: v.number(),
    expiresAt: v.string()
  })
    .index('by_userId', ['userId'])
    .index('sessionId', ['sessionId'])
});
