import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        black: "#000",
        light: "#fff",
        dark: "#000",
        neutral: {
          900: "#1a1a1a",
        },
      },
      fontFamily: {
        "pp-neue-corp": ["PP Neue Corp", "Impact", "sans-serif"],
      },
      transitionTimingFunction: {
        "cubic-default": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      fontSize: {
        "1-1vw": "1.1vw",
        "5-625em": "5.625em",
        "0-75em": "0.75em",
        "1em": "1em",
      },
      spacing: {
        "4em": "4em",
        "2em": "2em",
        "1-25em": "1.25em",
        "0-4em": "0.4em",
        "0-75em": "0.75em",
        "0-5em": "0.5em",
        "0-2em": "0.2em",
        "0-25em": "0.25em",
      },
      width: {
        "37-5em": "37.5em",
        "42-5em": "42.5em",
        "4em": "4em",
        "1em": "1em",
        "2ch": "2ch",
        "0-5em": "0.5em",
        "2px": "2px",
      },
      height: {
        "28-125em": "28.125em",
        "28em": "28em",
        "4em": "4em",
        "1em": "1em",
        "0-75em": "0.75em",
        "0-5em": "0.5em",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "0-4em": "0.4em",
        "0-5em": "0.5em",
        "0-25em": "0.25em",
        "10em": "10em",
      },
      rotate: {
        "15": "15deg",
        "-90": "-90deg",
        "180": "180deg",
      },
      scale: {
        "85": "0.85",
        "140": "1.4",
      },
      transitionDuration: {
        "400": "400ms",
        "475": "475ms",
        "525": "525ms",
      },
      transitionDelay: {
        "300": "300ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
