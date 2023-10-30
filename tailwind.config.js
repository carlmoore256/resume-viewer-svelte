/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            fontFamily: {
                forum: ["Forum", "serif"],
                sans: ["Lato", "sans-serif"],
            },
        },
    },
    plugins: [],
};
