/**
 * @file PostCSS config for the portfolio
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Sets up the plugins for PostCSS, which gets useed by Vite to process CSS files.
 * It enables tailwind and autoprefixer.
 * 'tailwindcss': processes tailwind's directives and utility classes.
 * 'autoprefixer': supports compatibility with different browsers through adding vendor prefixes (e.g. -moz) to CSS rules
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}