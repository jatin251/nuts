import { ConvexHttpClient } from 'convex/browser';
import { api as ConvexAPI } from '@/../convex/_generated/api';
import { VITE_CONVEX_URL } from '$env/static/private';

export const api = ConvexAPI;
export const client = new ConvexHttpClient(VITE_CONVEX_URL!);
