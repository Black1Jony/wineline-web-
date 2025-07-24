const plugin = require("tailwind-scrollbar-hide");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [plugin],
};
