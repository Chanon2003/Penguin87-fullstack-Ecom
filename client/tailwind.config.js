module.exports = {
  content: [
    "./index.html", // ถ้ามีไฟล์ HTM
    "./src/**/*.{js,ts,jsx,tsx}", 
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "primary-200":"#ffbf00",
        "primary-100" : "#ffc929",
        "secondary-200":"#00b050",
        "secondary-100":"#0b1a78"
      }
    },
  },
  plugins: [],
};
