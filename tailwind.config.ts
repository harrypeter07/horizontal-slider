import type { Config } from "tailwindcss"
import defaultConfig from "shadcn/ui/tailwind.config"

const config: Config = {
  ...defaultConfig,
  content: [
    ...defaultConfig.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
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
        ...defaultConfig.theme.extend.borderRadius,
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
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}
export default config
