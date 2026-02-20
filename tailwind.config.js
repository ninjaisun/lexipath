/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "2rem",
        "3xl": "2.5rem",
      },
      boxShadow: {
        'tactile': 'var(--squishy-shadow)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        'liquid': 'var(--glass-blur)',
      },
      keyframes: {
        "squishy-bounce": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.96)" },
        },
        "morph": {
          "0%, 100%": { borderRadius: "1.5rem" },
          "50%": { borderRadius: "2.5rem" },
        }
      },
      animation: {
        "squishy": "squishy-bounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "morphing": "morph 8s ease-in-out infinite",
      },
    },
  },
  plugins: [import("tailwindcss-animate")],
}
