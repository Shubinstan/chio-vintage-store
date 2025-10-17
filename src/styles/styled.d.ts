import 'styled-components';
import { Theme } from './theme'; // Importing the Theme type

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}