/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new ConvexHttpClient(process.env['VITE_CONVEX_URL'] || '');

// Using the client (API methods for queries and mutations)

async function runRegistration() {
  const registration = await client.mutation(api.auth.register, {
    email: 'carlo@gmail.com',
    password: 'carlo123',
    username: 'carlo'
  });

  console.log(registration);
}

// runRegistration();

async function runLogout() {
  const result = await client.mutation(api.auth.logout, {
    sessionId: 'CAhGJv/WpiWC6NVr'
  });

  console.log(result);
}

// runLogout();

async function runLogin() {
  const result = await client.mutation(api.auth.login, {
    usernameOrEmail: 'carlo@gmail.com',
    password: 'carlo123'
  });

  console.log(result);
}

runLogin();

// async function runLogin() {
// 	const login = await client.mutation(api.auth.login, {
// 		usernameOrEmail: "carlo"
// 	})
// }

// const url = process.env['CONVEX_API_ENDPOINT'] || 'localhost:3000/';

// // Using the client (HTTP)
// fetch(url + '/auth/register', {
// 	method: 'POST',
// 	headers: {
// 		'Content-Type': 'application/json'
// 	},
// 	body: JSON.stringify({
// 		email: 'carlo@gmail.com',
// 		username: 'carlo',
// 		password: 'carlo123'
// 	})
// }).then(async (res) => {
// 	if (res.ok) {
// 		// console.log('api is good');
// 		const json = await res.json();
// 		console.log(json);
// 	}
// 	{
// 		console.log(res.statusText);
// 	}
// });
