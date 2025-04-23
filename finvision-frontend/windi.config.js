import { defineConfig } from "windicss/helpers";

export default defineConfig({
  extract: {
    include: ["./src/**/*.{js,jsx,ts,tsx}"],
  },
  theme: {
    extend: {
      colors: {
        primary: "#1E2A38", // Dark Blue (Navbar & Header)
        secondary: "#4CAF7D", // Green Highlights (Buttons & Active)
        accent: "#F0F3FA", // Light Gray Background (Overall Page)
        cardBg: "#FFFFFF", // White (Cards & Widgets)
        textPrimary: "#1D1D1D", // Dark text for contrast
        textSecondary: "#6B7280", // Grayish text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Ensure modern UI
      },
      boxShadow: {
        card: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadows for cards
      },
      borderRadius: {
        md: "10px", // Slightly rounded cards & buttons
      },
      spacing: {
        18: "4.5rem", // Custom spacing for UI elements
      },
    },
  },
  plugins: [],
});
