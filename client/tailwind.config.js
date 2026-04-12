/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"]
      },
      colors: {
        brand: {
          50: "#f4fbf7",
          100: "#d9f4e4",
          200: "#b3e8cb",
          300: "#7fd9ad",
          400: "#46c586",
          500: "#1fa667",
          600: "#128250",
          700: "#116843",
          800: "#115338",
          900: "#0f4530"
        }
      },
      boxShadow: {
        soft: "0 20px 80px rgba(15, 23, 42, 0.22)"
      },
      backgroundImage: {
        glow:
          "radial-gradient(circle at top left, rgba(31,166,103,0.28), transparent 30%), radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 22%)"
      }
    }
  },
  plugins: []
};
