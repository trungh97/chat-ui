const sharedConfig = require('shared-ui/tailwind.config.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/shared-ui/dist/**/*.{js,jsx,ts,tsx}',
  ],
  // safelist: [
  //   {
  //     pattern: /./,
  //   },
  // ],
}
