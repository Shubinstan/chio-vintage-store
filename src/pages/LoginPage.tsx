// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { FormContainer, ErrorMessage } from './SignUpPage'; // Reuse styles
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import styled from 'styled-components';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to home page
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <FormContainer>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Login</Button>
      </form>
      <SignUpLink>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </SignUpLink>
    </FormContainer>
  );
};

const SignUpLink = styled.p` margin-top: 1rem; text-align: center; `;
export default LoginPage;