// import { ConvexHttpClient } from 'convex/browser';
// import { api } from './convex/_generated/api';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// const client = new ConvexHttpClient(process.env['VITE_CONVEX_URL'] || '');

// Using the client (API methods for queries and mutations)
// console.log(client);
// client.query(api.tasks.get).then(console.log);

const url = process.env['CONVEX_API_ENDPOINT'] || 'localhost:3000/';

// Using the client (HTTP)
fetch(url + '/auth/register', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		email: 'carlo@gmail.com',
		username: 'carlo',
		password: 'carlo123'
	})
}).then(async (res) => {
	if (res.ok) {
		// console.log('api is good');
		const json = await res.json();
		console.log(json);
	}
	{
		console.log(res.statusText);
	}
});
