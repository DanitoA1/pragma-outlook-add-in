module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#6759FF',
        secondary: '#7E7C95',
        'light-pink': '#FAF9FF',
        grey: '#959595',
        'light-grey': '#F1F1F1'
      },
      width: {
        '113px': '113px',
        '162px': '162px',
        '94px': '94px'
      },
      fontSize: {
        '14px': ['14px'],
        '12px': ['12px'],
        '8px': ['8px'],
        '6px': ['6px']
        // Or with a default line-height as well
      },
      boxShadow: {
        'buttom-shadow': '0px 10px 5px rgba(182, 171, 171, 0.25) inset'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
