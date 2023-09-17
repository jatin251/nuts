import { Doc, Id } from './_generated/dataModel';
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server';
import { ObjectType, PropertyValidators, v } from 'convex/values';
import cryptoRandomString from 'crypto-random-string';
import { ResponseStatus } from './responseStatuses';

export async function getSession(
  ctx: QueryCtx | MutationCtx,
  sessionId: string
) {
  const session = await ctx.db
    .query('sessions')
    .withIndex('sessionId', (q) => q.eq('sessionId', sessionId))
    .first();

  return session;
}

function sessionExpired(expiredAt: string) {
  const currentDate = new Date();
  const expirationDate = new Date(Date.parse(expiredAt));

  if (currentDate > expirationDate) return true;

  return false;
}

export async function createSession(ctx: MutationCtx, userId: string) {
  const sessionId = cryptoRandomString({ length: 24, type: 'base64' });

  const maxAgeDays = 10;
  const expiresOn = new Date().getDate() + maxAgeDays;
  const expireDate = new Date().setDate(expiresOn);

  const sessionInstanceId = await ctx.db.insert('sessions', {
    sessionId: sessionId,
    userId: userId as Id<'users'>,
    expiresAt: expireDate.toString(),
    maxAge: maxAgeDays * 24 * 60 * 60
  });

  // Cast it as not null because we're always sure it's inserted anyway.
  const session = (await ctx.db.get(sessionInstanceId)) as Doc<'sessions'>;

  return session;
}

export function queryWithAuth<
  ArgsValidator extends PropertyValidators,
  Output
>({
  args,
  handler
}: {
  args: ArgsValidator;
  handler: (
    ctx: Omit<QueryCtx, 'auth'> & { session: Doc<'sessions'> },
    args: ObjectType<ArgsValidator>
  ) => Output;
}) {
  return query({
    args: {
      ...args,
      sessionId: v.string()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: async (ctx, args: any) => {
      const session = await getSession(ctx, args.sessionId);

      if (!session)
        return {
          status: ResponseStatus.Fail,
          message: 'No user session found. Please login.'
        };
      if (sessionExpired(session.expiresAt))
        return {
          status: ResponseStatus.Fail,
          message: 'Session has expired.'
        };

      return handler({ ...ctx, session }, args);
    }
  });
}
export function mutationWithAuth<
  ArgsValidator extends PropertyValidators,
  Output
>({
  args,
  handler
}: {
  args: ArgsValidator;
  handler: (
    ctx: Omit<MutationCtx, 'auth'> & { session: Doc<'sessions'> },
    args: ObjectType<ArgsValidator>
  ) => Output;
}) {
  return mutation({
    args: { ...args, sessionId: v.string() },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: async (ctx, args: any) => {
      const session = await getSession(ctx, args.sessionId);

      if (!session)
        return {
          status: ResponseStatus.Fail,
          message: 'No user session found. Please login.'
        };
      if (sessionExpired(session.expiresAt))
        return {
          status: ResponseStatus.Fail,
          message: 'Session has expired.'
        };

      return handler({ ...ctx, session }, args);
    }
  });
}
