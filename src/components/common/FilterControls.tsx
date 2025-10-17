// src/components/common/FilterControls.tsx
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Input from './Input';

// Define the component's props
interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;
  priceRange: { min: string; max: string };
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Map sort keys to human-readable labels for the dropdown
const sortOptions: { [key: string]: string } = {
  default: 'Default Sorting',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'name-asc': 'Name: A to Z',
  'name-desc': 'Name: Z to A',
};

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm, onSearchChange,
  sortOrder, onSortChange,
  priceRange, onPriceChange,
}) => {
  const [isSortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // This effect adds a listener to close the sort dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <ControlsContainer>
      <SearchWrapper>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </SearchWrapper>
      
      <GroupWrapper>
        <FilterGroup>
          <PriceInput name="min" type="number" placeholder="Min $" value={priceRange.min} onChange={onPriceChange} />
          <PriceInput name="max" type="number" placeholder="Max $" value={priceRange.max} onChange={onPriceChange} />
        </FilterGroup>

        <SortWrapper ref={sortRef}>
          <SortButton onClick={() => setSortOpen(!isSortOpen)}>
            {sortOptions[sortOrder]}
            <ChevronIcon $isOpen={isSortOpen} />
          </SortButton>
          {isSortOpen && (
            <SortDropdown>
              {Object.entries(sortOptions).map(([key, label]) => (
                <SortOption
                  key={key}
                  onClick={() => { onSortChange(key); setSortOpen(false); }}
                >
                  {label}
                </SortOption>
              ))}
            </SortDropdown>
          )}
        </SortWrapper>
      </GroupWrapper>
    </ControlsContainer>
  );
};

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components ---
const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.text}20;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1 1 250px;
  max-width: 350px;
`;

const SearchInput = styled(Input)`
  width: 100%;
  padding-left: 2.5rem;
  margin: 0;
  border-radius: 25px;
  border: 1px solid transparent;
  background-color: ${({ theme }) => theme.cardBg};
  transition: border-color 0.2s, background-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.accent}80;
    background-color: ${({ theme }) => theme.body};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="${({ theme }) => theme.text.replace('#', '%23')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>');
  background-size: contain;
  opacity: 0.5;
`;

const GroupWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PriceInput = styled(Input)`
  width: 90px;
  margin: 0;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.text}20;
  border-radius: 4px;
  &:focus {
    border-color: ${({ theme }) => theme.accent}80;
  }
`;

const SortWrapper = styled.div`
  position: relative;
`;

const SortButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  padding: 0.8rem 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const ChevronIcon = styled.div<{ $isOpen: boolean }>`
  width: 10px;
  height: 10px;
  border-left: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: ${({ $isOpen }) => $isOpen ? 'translateY(-2px) rotate(135deg)' : 'translateY(2px) rotate(-45deg)'};
  transition: transform 0.2s ease-out;
`;

const SortDropdown = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  /* THE FIX IS HERE: Changed from 'right: 0' to 'left: 0' */
  left: 0; 
  background-color: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.text}20;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 100;
  width: 220px;
  animation: ${fadeIn} 0.2s ease-out;
`;

const SortOption = styled.div`
  padding: 0.8rem 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.cardBg};
    color: ${({ theme }) => theme.accent};
  }
`;

export default FilterControls;