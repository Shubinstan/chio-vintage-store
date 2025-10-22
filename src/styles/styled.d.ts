// src/styles/styled.d.ts
import 'styled-components';
import type { Theme } from './theme'; // Путь должен быть правильным

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}