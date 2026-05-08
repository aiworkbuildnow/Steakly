/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
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
