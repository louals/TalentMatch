export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // already needed for dark mode toggle
  theme: {
    extend: {
      colors: {
        primary: "#003965", // your custom brand blue
      },
    },
  },
  plugins: [],
};
