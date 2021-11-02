import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';

const FullSpinner = () => {
  return (
    <ComponentWrapper>
      <Spinner animation='border' variant='primary' />
    </ComponentWrapper>
  );
};

export default FullSpinner;

const ComponentWrapper = styled.div`
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
