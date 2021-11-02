import styled from 'styled-components';
import Link from 'next/link';
import QuizHead from '../components/Layouts/QuizHead';
import { Container, Row, Col } from 'react-bootstrap';
import { AppContext } from '../context/store';

export default function Home() {
  return (
    <HomePageContainer className='mainContainer'>
      <QuizHead>
        <title>Quiz App</title>
        <meta name='description' content='Quiz App!'></meta>
      </QuizHead>
      <Container>
        <h1 className='title text-center'>Quiz App Home Page</h1>
        <Link href='/translation'>Go to Translation Quiz Page</Link>
      </Container>
    </HomePageContainer>
  );
}

const HomePageContainer = styled.div`
  h1.title {
    font-size: 40px;
    margin: 0 0 20px 0;
  }
  @media (min-width: 992px) {
    h1.title {
      font-size: 60px;
      margin-bottom: 40px;
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`;
