/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#AC6AFF",
        secondary: "#FFC876",
        danger: "#FF776F",
        success: "#7ADB78",
        neutral: "#757185",
        background: "#FFFFFF",
        dark: "#15131D",
        red: "#EF5A6F",
        yellow: "#FFF1DB",
        brown: "#D4BDAC",
        blue: "#536493",
      },
      fontFamily: {
        sans: ["var(--font-sora)", ...fontFamily.sans],
        grotesk: "var(--font-grotesk)",
      },
      letterSpacing: {
        tagline: ".15em",
      },
      spacing: {
        7.5: "1.875rem",
        15: "3.75rem",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        DEFAULT: "linear",
      },
      zIndex: {
        1: "1",
        5: "5",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities }) {
      addComponents({
        ".container": {
          "@apply max-w-[77.5rem] mx-auto px-5 md:px-10 lg:px-15": {},
        },
        ".h1": { "@apply font-semibold text-[2.5rem] leading-[3.25rem]": {} },
        ".button": {
          "@apply font-grotesk text-xs font-bold uppercase tracking-wider": {},
        },
      });
      addUtilities({
        ".tap-highlight-color": {
          "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
        },
      });
    }),
  ],
};
