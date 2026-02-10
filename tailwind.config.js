/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "app-bg":
          "radial-gradient(900px 600px at 85% 15%, rgba(56,189,248,0.25), transparent 60%), radial-gradient(700px 500px at 10% 70%, rgba(37,99,235,0.18), transparent 65%), linear-gradient(135deg,#020617 0%,#061a3a 45%,#062874 100%)",
      },
    },
  },
  plugins: [],
};
