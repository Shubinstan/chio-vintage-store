// src/pages/AboutPage.tsx
import styled from 'styled-components';

const AboutPageContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Georgia', serif;
`;

const AboutPage = () => {
  return (
    <AboutPageContainer>
      <Title>Our Story</Title>
      <p>
        Chio Vintage was born from a passion for history, craftsmanship, and the timeless beauty of things with a past. We believe that every vintage item has a unique story to tell, and we travel far and wide to curate a collection of treasures waiting for their next chapter with you.
      </p>
      <p>
        Our mission is to bring you a handpicked selection of clothing, decor, and accessories that stand out in a world of fast fashion and mass production. Thank you for choosing sustainable, stylish, and story-rich pieces.
      </p>
    </AboutPageContainer>
  );
};

export default AboutPage;