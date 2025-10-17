// src/components/layout/Header.tsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuthStore } from '../../store/authStore';
import CartIcon from '../common/CartIcon';

// Define the component's props
interface HeaderProps {
  toggleTheme: () => void;
  theme: string;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  const { user, isLoading } = useAuthStore();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu automatically on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Prevent body from scrolling when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  const categories = ["All", "Furniture", "Tableware", "Decor"];

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  };

  return (
    <StyledHeader>
      <NavSection>
        <NavLinks>
          <NavItem onMouseEnter={() => setDropdownVisible(true)} onMouseLeave={() => setDropdownVisible(false)}>
            <StyledLink to="/catalog">Catalog</StyledLink>
            {isDropdownVisible && (
              <DropdownMenu>
                {categories.map(category => (
                  <DropdownItem key={category}>
                    <DropdownLink to={`/catalog?category=${category.toLowerCase()}`}>{category}</DropdownLink>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </NavItem>
          <NavItem><StyledLink to="/about">About Us</StyledLink></NavItem>
        </NavLinks>
      </NavSection>

      <Logo to="/">Chio Vintage</Logo>
      
      <Controls>
        <DesktopOnlyControls>
          <ThemeButton onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </ThemeButton>
          {isLoading ? null : user ? (
            <>
              <UserName>{user.email}</UserName>
              <AuthButton onClick={handleLogout}>Logout</AuthButton>
            </>
          ) : (
            <Link to="/login"><AuthButton>Login</AuthButton></Link>
          )}
        </DesktopOnlyControls>

        <Link to="/cart"><CartIcon /></Link>
        <HamburgerButton $isOpen={isMenuOpen} onClick={() => setMenuOpen(!isMenuOpen)}>
          <div /><div /><div />
        </HamburgerButton>
      </Controls>
      
      <MobileNav $isOpen={isMenuOpen}>
        <MobileNavLinks>
          <li><StyledLink to="/catalog">Catalog</StyledLink></li>
          <li><StyledLink to="/about">About Us</StyledLink></li>
          <MobileNavSeparator />
          {user ? (
             <li><AuthButton onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</AuthButton></li>
          ) : (
            <>
              <li><StyledLink to="/login">Login</StyledLink></li>
              <li><StyledLink to="/signup">Sign Up</StyledLink></li>
            </>
          )}
           <MobileNavSeparator />
           <li>
             {/* THE FIX IS HERE: Using the simple, icon-only ThemeButton */}
             <ThemeButton onClick={toggleTheme} aria-label="Toggle theme">
               {theme === 'light' ? <MoonIcon /> : <SunIcon />}
             </ThemeButton>
           </li>
        </MobileNavLinks>
      </MobileNav>
    </StyledHeader>
  );
};

// --- Animations ---
const fadeInDown = keyframes`from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); }`;

// --- Styled Components ---
const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.text}30;
  position: sticky;
  top: 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavSection = styled.nav`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  @media (max-width: 900px) {
    display: none;
  }
`;

const Logo = styled(Link)`
  flex: 1;
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  font-family: 'Georgia', serif;
  
  @media (max-width: 900px) {
    text-align: left;
    flex: 0 1 auto;
  }
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Controls = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
`;

const DesktopOnlyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  @media (max-width: 900px) {
    display: none;
  }
`;

const HamburgerButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  padding: 5px;
  
  div {
    width: 25px;
    height: 3px;
    background-color: ${({ theme }) => theme.text};
    margin: 4px 0;
    border-radius: 2px;
    transition: all 0.3s ease-in-out;
  }
  
  ${({ $isOpen }) => $isOpen && `
    position: fixed;
    right: 1rem;
    top: 1rem;

    div:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    div:nth-child(2) {
      opacity: 0;
    }
    div:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  `}

  @media (max-width: 900px) {
    display: block;
  }
`;

const NavLinks = styled.ul` display: flex; list-style: none; gap: 2rem; padding: 0; margin: 0; `;
const NavItem = styled.li` position: relative; `;
const StyledLink = styled(Link)` text-decoration: none; color: ${({ theme }) => theme.text}; font-size: 1rem; transition: color 0.2s ease-in-out; padding: 10px 0; &:hover { color: ${({ theme }) => theme.accent}; }`;
const DropdownMenu = styled.div` position: absolute; top: calc(100% + 10px); left: 0; background-color: ${({ theme }) => theme.cardBg}; border: 1px solid ${({ theme }) => theme.text}20; min-width: 200px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 0.5rem 0; z-index: 999; border-radius: 4px; animation: ${fadeInDown} 0.2s ease-out; `;
const DropdownItem = styled.div``;
const DropdownLink = styled(Link)` display: block; padding: 0.75rem 1.5rem; text-decoration: none; text-transform: capitalize; color: ${({ theme }) => theme.text}; font-size: 1rem; &:hover { background-color: ${({ theme }) => theme.body}; color: ${({ theme }) => theme.accent}; } `;
const AuthButton = styled.button` background: none; border: 1px solid ${({ theme }) => theme.text}80; padding: 0.5rem 1rem; color: ${({ theme }) => theme.text}; cursor: pointer; border-radius: 4px; font-size: 0.9rem; transition: all 0.2s ease-in-out; &:hover { background: ${({ theme }) => theme.text}20; border-color: ${({ theme }) => theme.text}; }`;
const UserName = styled.span` font-size: 0.9rem; white-space: nowrap; `;

const iconStyles = ` height: 24px; width: 24px; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; fill: none; flex-shrink: 0; `;
const MoonIcon = styled.svg.attrs({ viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg', children: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />, })`${iconStyles}`;
const SunIcon = styled.svg.attrs({ viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg', children: ( <> <circle cx="12" cy="12" r="5"></circle> <line x1="12" y1="1" x2="12" y2="3"></line> <line x1="12" y1="21" x2="12" y2="23"></line> <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line> <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line> <line x1="1" y1="12" x2="3" y2="12"></line> <line x1="21" y1="12" x2="23" y2="12"></line> <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line> <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line> </> ), })`${iconStyles}`;

const MobileNav = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.body};
  z-index: 999;
  transition: transform 0.3s ease-in-out;
  transform: ${({ $isOpen }) => $isOpen ? 'translateX(0)' : 'translateX(100%)'};
  
  @media (min-width: 901px) {
    display: none;
  }
`;

const MobileNavLinks = styled.ul` list-style: none; padding: 0; text-align: center; li { margin: 1.5rem 0; } a, button { font-size: 1.8rem; }`;
const MobileNavSeparator = styled.hr` width: 50%; border: 0; border-top: 1px solid ${({ theme }) => theme.text}30; margin: 1rem 0; `;

const ThemeButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.text}30; /* Add a subtle border */
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease-in-out;
  &:hover { 
    transform: scale(1.1) rotate(15deg); 
    background-color: ${({ theme }) => theme.text}10; 
  }
`;

export default Header;