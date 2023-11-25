/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require("tailwindcss/plugin");
const { createThemes } = require("tw-colors");
const {
  amberO,
  tealO,
  tealDarkO,
  amberDarkO,
  mintDarkO,
  mintO,
  tomatoDarkO,
  tomatoO,
  redDarkO,
  redO,
  crimsonDarkO,
  crimsonO,
  pinkDarkO,
  pinkO,
  plumDarkO,
  plumO,
  purpleDarkO,
  purpleO,
  violetDarkO,
  violetO,
  indigoO,
  indigoDarkO,
  blueDarkO,
  blueO,
  cyanO,
  cyanDarkO,
  greenDarkO,
  greenO,
  grassDarkO,
  grassO,
  orangeDarkO,
  orangeO,
  brownDarkO,
  brownO,
  skyDarkO,
  skyO,
  limeDarkO,
  limeO,
  yellowDarkO,
  yellowO,
} = require("./src/themes/palettes");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // TODO utilizzare la funzione presets di tailwind per non dover scrivere qui le estensioni del tema
  theme: {
    extend: {
      keyframes: {
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: "translateY(2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: "translateX(-2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        slideDownAndFade: {
          from: { opacity: 0, transform: "translateY(-2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: "translateX(2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        slideDown: {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
        enterFromRight: {
          from: { opacity: 0, transform: "translateX(200px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        enterFromLeft: {
          from: { opacity: 0, transform: "translateX(-200px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        exitToRight: {
          from: { opacity: 1, transform: "translateX(0)" },
          to: { opacity: 0, transform: "translateX(200px)" },
        },
        exitToLeft: {
          from: { opacity: 1, transform: "translateX(0)" },
          to: { opacity: 0, transform: "translateX(-200px)" },
        },
        scaleIn: {
          from: { opacity: 0, transform: "rotateX(-10deg) scale(0.9)" },
          to: { opacity: 1, transform: "rotateX(0deg) scale(1)" },
        },
        scaleOut: {
          from: { opacity: 1, transform: "rotateX(0deg) scale(1)" },
          to: { opacity: 0, transform: "rotateX(-10deg) scale(0.95)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
      },
      animation: {
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        scaleIn: "scaleIn 200ms ease",
        scaleOut: "scaleOut 200ms ease",
        fadeIn: "fadeIn 200ms ease",
        fadeOut: "fadeOut 200ms ease",
        enterFromLeft: "enterFromLeft 250ms ease",
        enterFromRight: "enterFromRight 250ms ease",
        exitToLeft: "exitToLeft 250ms ease",
        exitToRight: "exitToRight 250ms ease",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-animated"),
    plugin(({ matchUtilities }) => {
      matchUtilities({
        perspective: (value) => ({
          perspective: value,
        }),
      });
    }),
    // TODO create a plugin that import all radix color themes
    createThemes({
      amberDark: {
        ...amberDarkO,
      },
      amber: {
        ...amberO,
      },
      mint: {
        ...mintO,
      },
      mintDark: {
        ...mintDarkO,
      },
      teal: {
        ...tealO,
      },
      tealDark: {
        ...tealDarkO,
      },
      tomatoDark: {
        ...tomatoDarkO,
      },
      tomato: {
        ...tomatoO,
      },
      redDark: {
        ...redDarkO,
      },
      red: {
        ...redO,
      },
      crimson: {
        ...crimsonO,
      },
      crimsonDark: {
        ...crimsonDarkO,
      },
      pinkDark: {
        ...pinkDarkO,
      },
      pink: {
        ...pinkO,
      },
      plum: {
        ...plumO,
      },
      plumDark: {
        ...plumDarkO,
      },
      purpleDark: {
        ...purpleDarkO,
      },
      purple: {
        ...purpleO,
      },
      violet: {
        ...violetO,
      },
      violetDark: {
        ...violetDarkO,
      },
      indigo: {
        ...indigoO,
      },
      indigoDark: {
        ...indigoDarkO,
      },
      blue: {
        ...blueO,
      },
      blueDark: {
        ...blueDarkO,
      },
      cyan: {
        ...cyanO,
      },
      cyanDark: {
        ...cyanDarkO,
      },
      green: {
        ...greenO,
      },
      greenDark: {
        ...greenDarkO,
      },
      grass: {
        ...grassO,
      },
      grassDark: {
        ...grassDarkO,
      },
      orange: {
        ...orangeO,
      },
      orangeDark: {
        ...orangeDarkO,
      },
      brown: {
        ...brownO,
      },
      brownDark: {
        ...brownDarkO,
      },
      sky: {
        ...skyO,
      },
      skyDark: {
        ...skyDarkO,
      },
      lime: {
        ...limeO,
      },
      limeDark: {
        ...limeDarkO,
      },
      yellow: {
        ...yellowO,
      },
      yellowDark: {
        ...yellowDarkO,
      },
    }),
  ],
};
