// src/components/common/Button.tsx
import styled from 'styled-components';

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.body};
  background-color: ${({ theme }) => theme.accent};
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  border-radius: 4px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button;