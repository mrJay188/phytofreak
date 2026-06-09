const fs = require('fs');
const path = require('path');

const classesFile = path.join(__dirname, 'assets', 'tailwind-classes.txt');
const safelist = fs.existsSync(classesFile)
  ? fs.readFileSync(classesFile, 'utf8').split(/\r?\n/).filter(Boolean)
  : [];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../index.html',
    '../product.html',
    '../about.html',
    '../contact.html',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './layout/**/*.liquid',
  ],
  safelist,
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#050a14', light: '#070f1c', card: '#0c1528', dark: '#03060c' },
        lime: { DEFAULT: '#d2ff34', dark: '#b8e63a', light: '#ddff69' },
        cyan: { DEFAULT: '#4ab8c4', dim: '#2d8a96' },
        gold: '#e8c04a',
      },
      fontFamily: { sans: ['Montserrat', 'system-ui', 'sans-serif'] },
      maxWidth: { content: '1320px' },
    },
  },
};
