/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['DM Sans','sans-serif'], display: ['Fraunces','serif'] },
      colors: {
        teal:  { 50:'#e6faf5',100:'#b3f0e0',200:'#80e5cb',400:'#26cfa1',500:'#00b38a',600:'#009672',700:'#00795b',800:'#005c44' },
        slate: { 50:'#f0f4f8',100:'#d9e2ec',200:'#bcccdc',400:'#829ab1',500:'#627d98',600:'#486581',700:'#334e68',800:'#243b53',900:'#102a43' },
      },
      boxShadow: {
        card:    '0 1px 3px rgba(0,0,0,.06),0 4px 16px rgba(0,179,138,.06)',
        'card-lg':'0 4px 6px rgba(0,0,0,.05),0 10px 40px rgba(0,179,138,.10)',
        chat:    '0 8px 32px rgba(0,0,0,.15)',
      },
      keyframes: {
        fadeIn:  { '0%':{ opacity:0 }, '100%':{ opacity:1 } },
        slideUp: { '0%':{ opacity:0,transform:'translateY(16px)' }, '100%':{ opacity:1,transform:'translateY(0)' } },
        slideRight:{ '0%':{ opacity:0,transform:'translateX(20px)' }, '100%':{ opacity:1,transform:'translateX(0)' } },
      },
      animation: {
        'fade-in':'fadeIn .4s ease-out',
        'slide-up':'slideUp .35s ease-out',
        'slide-right':'slideRight .3s ease-out',
      },
    },
  },
  plugins: [],
};
