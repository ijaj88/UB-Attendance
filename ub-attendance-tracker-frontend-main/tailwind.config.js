/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: "tw-",
  important: true,
  corePlugins: {
      preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
