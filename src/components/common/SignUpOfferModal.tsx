// src/components/common/SignUpOfferModal.tsx

import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Define the component's props: a function to close it.
interface SignUpOfferModalProps {
  onClose: () => void;
}

const SignUpOfferModal: React.FC<SignUpOfferModalProps> = ({ onClose }) => {
  return (
    <ModalBackdrop onClick={onClose}>
      {/* Stop propagation to prevent closing when clicking inside the modal */}
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Get 10% Off Your First Order</Title>
        <Subtitle>
          Create an account to unlock your exclusive discount and save your favorite items.
        </Subtitle>
        <SignUpButton to="/signup" onClick={onClose}>
          Sign Up Now
        </SignUpButton>
        <LaterButton onClick={onClose}>Maybe Later</LaterButton>
      </ModalContent>
    </ModalBackdrop>
  );
};

// --- Styled Components with Animation ---

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 2rem 3rem;
  border-radius: 8px;
  text-align: center;
  max-width: 450px;
  position: relative;
  animation: ${slideUp} 0.4s ease-out;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  color: ${({ theme }) => theme.text}80;
  cursor: pointer;
  &:hover { color: ${({ theme }) => theme.text}; }
`;

const Title = styled.h2`
  font-family: 'Georgia', serif;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.text}99;
`;

const SignUpButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  color: ${({ theme }) => theme.body};
  background-color: ${({ theme }) => theme.accent};
  border: none;
  border-radius: 4px;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
`;

const LaterButton = styled.button`
  margin-top: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text}80;
  cursor: pointer;
  text-decoration: underline;
  &:hover { color: ${({ theme }) => theme.text}; }
`;

export default SignUpOfferModal;