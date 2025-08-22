import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#2563EB',
				accent: '#FF6B00',
				secondary: '#00C9A7',
				base: '#F7F8FC',
				neutral: '#1F2937',
			},
			boxShadow: {
				soft: '0 8px 24px rgba(31,41,55,0.08)'
			}
		}
	},
	plugins: []
}
export default config