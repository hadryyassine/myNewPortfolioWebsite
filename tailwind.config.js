import typography from '@tailwindcss/typography'
export default {
  content: ["./index.html","./src/**/*.{js,jsx,md,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#38BDF8" } },
      fontFamily: { sans: ["Inter","ui-sans-serif","system-ui","sans-serif"] },
    },
  },
  plugins: [typography],
}
