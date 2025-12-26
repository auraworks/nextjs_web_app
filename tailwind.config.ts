import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        "safe-top": "max(env(safe-area-inset-top), 0px)",
        "safe-bottom": "max(env(safe-area-inset-bottom), 0px)",
        "safe-left": "max(env(safe-area-inset-left), 0px)",
        "safe-right": "max(env(safe-area-inset-right), 0px)",
      },
    },
  },
} satisfies Config;
