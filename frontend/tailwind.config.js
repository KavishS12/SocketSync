import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#a67c52", // warm brown
          "secondary": "#e7d9c1", // muted cream
          "accent": "#e6cfa7", // soft beige
          "neutral": "#d6c3a3", // muted beige
          "base-100": "#f5ecd7", // very soft beige
          "base-200": "#e7d9c1", // muted cream
          "base-300": "#d6c3a3", // muted beige
          "info": "#a67c52",
          "success": "#b5c99a",
          "warning": "#ffe082",
          "error": "#e57373",
        },
        dark: {
          "primary": "#1a1a1a", // very dark black
          "secondary": "#2a2a2a", // dark gray
          "accent": "#3a3a3a", // medium dark gray
          "neutral": "#0a0a0a", // almost pure black
          "base-100": "#0a0a0a", // almost pure black background
          "base-200": "#1a1a1a", // very dark black
          "base-300": "#2a2a2a", // dark gray
          "base-content": "#ffffff", // white text
          "info": "#4f8cff",
          "success": "#3ad29f",
          "warning": "#ffb454",
          "error": "#ff5c57",
        },
      },
    ],
  },
};
