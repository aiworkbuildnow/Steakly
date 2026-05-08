/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2D6A4F",
          lime: "#52B788",
          light: "#95D5B2",
          cream: "#F8F4E9",
          gold: "#E9C46A",
          orange: "#F4A261",
          red: "#E76F51",
          dark: "#1B4332",
        },
      },
    },
  },
  plugins: [],
};
