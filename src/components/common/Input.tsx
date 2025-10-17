// src/components/common/Input.tsx
import styled from 'styled-components';

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.text}40;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  border-radius: 4px;
`;

export default Input;