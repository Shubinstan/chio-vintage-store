// src/pages/SignUpPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import styled from 'styled-components';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirmation
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return ""; // No error
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return; // Stop the submission if validation fails
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to home page
    } catch (err: any) {
      // Handle Firebase-specific errors
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already in use. Please log in.");
      } else {
        setError("Failed to create an account. Please try again.");
      }
      console.error("Firebase SignUp Error:", err);
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password (min. 8 chars, 1 number, 1 uppercase)" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Create Account</Button>
      </form>
    </FormContainer>
  );
};

// --- Styled Components ---
export const FormContainer = styled.div` max-width: 400px; margin: 2rem auto; padding: 2rem; background: ${({ theme }) => theme.cardBg}; border: 1px solid ${({ theme }) => theme.text}20; border-radius: 8px; `;
export const ErrorMessage = styled.p` color: #c0392b; margin-bottom: 1rem; text-align: center; `;

export default SignUpPage;