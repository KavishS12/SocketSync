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
          "primary": "#23272f", // very dark gray
          "secondary": "#2d333b", // dark gray
          "accent": "#3a3f4b", // slightly lighter dark
          "neutral": "#1a1d23", // almost black
          "base-100": "#181a20", // almost black
          "base-200": "#23272f", // very dark gray
          "base-300": "#2d333b", // dark gray
          "info": "#4f8cff",
          "success": "#3ad29f",
          "warning": "#ffb454",
          "error": "#ff5c57",
        },
      },
    ],
  },
};
