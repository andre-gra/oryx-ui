import plugin from 'tailwindcss/plugin'

//TODO farlo in typescript

let className = 'importedTheme'

module.exports = plugin.withOptions(function () { null }, function (options) {
  return {
    theme: {
      extend: {
        colors: {
          [options.className || className]: {
            primary: {
              1: 'hsl(30, 70.0%, 7.2%)',
              2: 'hsl(28, 100%, 8.4%)',
              3: 'hsl(26, 91.1%, 11.6%)',
              4: 'hsl(25, 88.3%, 14.1%)',
              5: 'hsl(24, 87.6%, 16.6%)',
              6: 'hsl(24, 88.6%, 19.8%)',
              7: 'hsl(24, 92.4%, 24.0%)',
              8: 'hsl(25, 100%, 29.0%)',
              9: 'hsl(24, 94.0%, 50.0%)',
              10: 'hsl(24, 100%, 58.5%)',
              11: 'hsl(24, 100%, 62.2%)',
              12: 'hsl(24, 97.0%, 93.2%)',
            }
          }
        }
      }
    },
  }
})