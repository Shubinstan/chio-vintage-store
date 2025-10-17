// src/components/common/CartIcon.tsx
import styled from 'styled-components';
import { useCartStore } from '../../store/cartStore';

const CartIcon = () => {
  const items = useCartStore(state => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <IconWrapper>
      <CartSvg />
      {totalItems > 0 && <ItemCount>{totalItems}</ItemCount>}
    </IconWrapper>
  );
};

// --- Styled Components ---

const IconWrapper = styled.div`
  position: relative;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  
  /* Add a smooth transition for the transform property */
  transition: transform 0.2s ease-in-out;

  /* Apply the animation on hover */
  &:hover {
    transform: scale(1.1) rotate(-5deg);
  }
`;

const ItemCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.body};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: bold;
`;

const CartSvg = styled.svg.attrs({
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
  children: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18m-5 4a4 4 0 1 1-8 0"
    />
  ),
})`
  width: 28px;
  height: 28px;
`;

export default CartIcon;