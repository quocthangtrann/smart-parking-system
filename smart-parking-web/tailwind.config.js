/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#210F7A',    // Màu header và nút action
        roleBtn: '#FFD85A',    // Nút chọn Admin/HCMUT
        loginBtn: '#006DCC',   // Nút login/clear
        inputBorder: '#777777',// Viền input admin
        status: {
          success: '#2E7D32',  // In progress / > 20 slots
          warning: '#ED6C02',  // < 20 slots
          danger: '#D32F2F',   // 0 slots / Alert
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Áp dụng font Inter cho toàn dự án
      }
    },
  },
  plugins: [],
}