module.exports = {
  plugins: [
    require("postcss-nested"),
    require("postcss-advanced-variables"),
    require("tailwindcss/nesting"),
    require("tailwindcss"),
    require("autoprefixer"),
  ],
};
