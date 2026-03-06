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
                gold: "#BC9C33",
                "navy-deep": "#103065",
                "navy-deep-light": "#1a4a9a",
                "soft-gold": "#FCF4DC",
                "soft-gray": "#F5F5F5",
                "pale-blue": "#E3EAF4",
            },
            fontFamily: {
                display: ["Georgia", "Lora", "serif"],
                heading: ["Georgia", "Lora", "serif"],
                body: ["'Source Sans Pro'", "sans-serif"],
                serif: ["Georgia", "Lora", "serif"],
                sans: ["'Source Sans Pro'", "sans-serif"],
            },
            borderRadius: {
                "card": "6px",
                "card-sm": "6px",
                "input": "6px",
                "none": "0",
                "sm": "2px",
                DEFAULT: "6px",
                "md": "6px",
                "lg": "6px",
                "xl": "6px",
                "2xl": "6px",
                "3xl": "6px",
                "full": "9999px",
            },
        },
    },
    plugins: [],
}
