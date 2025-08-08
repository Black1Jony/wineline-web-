const plugin = require("tailwind-scrollbar-hide");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
          "Arial": ["Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif]
      }
    },
  },
  plugins: [plugin],
};
