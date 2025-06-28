export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@clerk/**/*.{js,ts,jsx,tsx}", // for Clerk components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
