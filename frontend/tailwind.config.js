/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					500: '#42D6B2'
				}
			},
			fontFamily: {
				circularstd: ['CircularStd'],
				productsans: ['ProductSans']
			}
		}
	},
	plugins: []
};
