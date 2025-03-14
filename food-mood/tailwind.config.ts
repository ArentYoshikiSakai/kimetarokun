import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#f0f7ff',
          '100': '#e0eefe',
          '200': '#baddfe',
          '300': '#7fc2fd',
          '400': '#3aa1fa',
          '500': '#1084ed',
          '600': '#0269d2',
          '700': '#0154aa',
          '800': '#01478c',
          '900': '#063d74',
          '950': '#042854',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config; 