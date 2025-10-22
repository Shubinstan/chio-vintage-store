// src/styles/GlobalStyles.ts

import { createGlobalStyle } from 'styled-components';

// Define my global styles. These will apply everywhere.
// Using CSS variables (--color-bg, --color-text) now instead of directly accessing the theme object.
// This avoids the tricky TypeScript error I was getting with createGlobalStyle and theme types.
export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    /* Using CSS variables set in App.tsx */
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; // My chosen base font
    /* Adding transition for smooth theme changes */
    transition: background-color 0.25s linear, color 0.25s linear;
  }

  /* Basic reset for links */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Ensure buttons use the same font as the body */
  button {
    font-family: inherit;
  }

  /* Defining other CSS variables derived from the ones set in App.tsx,
     just in case I need them directly in other styled components later. */
  :root {
    --color-accent: var(--color-accent-val);
    --color-card-bg: var(--color-card-bg-val);
  }
`;