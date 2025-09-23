/** 
 * @type {import('tailwindcss').Config} 
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Config object for tailwind css
 * This file defines the portfolio's colour palette, type scale,
 * fonts, breakpoints, and other design values
 */
export default {
  /**
   * The content array tells tailwind which files to check for class names.
   * This allows tailwind to remove unused CSS to minimise the stylesheet size
   */
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom spacing values for distinct separation of sections in the layout
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // Custom fonts for the cyberpunk theme
      fontFamily: {
        'mono': ['"Share Tech Mono"', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  /**
   * The plugins array allows official or third-party plugins to be
   * added to extended functionality
   */
  plugins: [
    // Allows for more responsiveness with the container queries
    require('@tailwindcss/container-queries'),
  ],
}