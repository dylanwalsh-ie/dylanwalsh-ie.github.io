/**
 * @file Vite configuration file for the project.
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description This file configures the Vite build tool, defines the base path for deployment,
 * necessary plugins, and path aliases for cleaner imports.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  /**
   * Base URL the portfolio is ran from
   * NOTE: As this is ran on github.io, this must be '/'.
   */
  base: '/',
  plugins: [react()],
  resolve: {
    /**
     * Defining path aliases to allow for cleaner imports
     * Here the '@' symbol is configured to point to the src directory
     * e.g. 'import Component from '@/components/Component' instead of
     * 'import Component from './src/components/Component''.
     */
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})