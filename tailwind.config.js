/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#BC9C33",
                "navy-deep": "#103065",
            },
            fontFamily: {
                display: ["var(--font-heading)", "serif"],
                body: ["var(--font-body)", "sans-serif"],
                serif: ["var(--font-heading)", "serif"],
                sans: ["var(--font-body)", "sans-serif"],
            },
            borderRadius: {
                "card": "2rem",
                "card-sm": "1rem",
                "input": "1rem",
            },
        },
    },
    plugins: [],
}
