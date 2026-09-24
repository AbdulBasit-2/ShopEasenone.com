/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1F2E",
        teal: { DEFAULT: "#0E7C7B", dark: "#0A5E5D", soft: "#DDF0EE" },
        sun: "#FFC857",
        mist: "#F4F7F6",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
