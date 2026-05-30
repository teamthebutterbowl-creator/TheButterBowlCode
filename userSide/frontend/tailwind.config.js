/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3E7B35",
        gold: "#E6A817",
        cream: "#F0EDE4",
        dark: "#1A1A1A",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 30px rgba(26, 26, 26, 0.08)",
        cardHover: "0 16px 40px rgba(62, 123, 53, 0.15)",
      },
    },
  },
  plugins: [],
};
