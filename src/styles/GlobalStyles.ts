import { createGlobalStyle } from 'styled-components';
import type { Theme } from './theme'; // Importing the Theme type

// Creating a global styles component
export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Courier New', Courier, monospace; // Винтажный шрифт для примера
    transition: all 0.25s linear;
  }
`;