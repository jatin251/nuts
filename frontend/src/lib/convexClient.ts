// Use this for server.

import { ConvexHttpClient } from 'convex/browser';
// import { api as ConvexAPI } from '@/../convex/_generated/api';
import { api as ConvexAPI } from '../../convex/_generated/api';
import { PUBLIC_CONVEX_URL } from '$env/static/public';

export const api = ConvexAPI;
export const client = new ConvexHttpClient(PUBLIC_CONVEX_URL!);
