import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/features/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			container: {
				center: true,
				padding: "20px",
				screens: {
					// "2xl": "1536px",
					"2xl": "440px",
				},
			},
			colors: {
				tgbutton: "var(--tg-theme-button-color, #3b82f6)",
				tgaccent: "var(--tg-theme-accent-text-color, #3b82f6)",
				redish: "#EF3671",
				
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				appear: "appear 0.5s ease-in-out",
				"logo-cloud": "logo-cloud 30s linear infinite",
				"logo-cloud-reverse": "logo-cloud 30s linear infinite reverse",
				wiggle: "wiggle 0.5s",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				appear: {
					from: {
						scale: "0.01",
						// transform: "rotate(-135deg)",
						opacity: "0",
					},
					to: {
						scale: "1",

						opacity: "1",
					},
				},
				"logo-cloud": {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(calc(-100% - 4rem))" },
				},
				wiggle: {
					"0%,100%": {
						transform: "translateX(0)",
					},
					"25%": {
						transform: "translateX(-4px)",
					},
					"50%": {
						transform: "translateX(4px)",
					},
					"75%": {
						transform: "translateX(-4px)",
					},
				},
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
