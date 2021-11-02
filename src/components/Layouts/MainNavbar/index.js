import { useState, useEffect, useContext, useRef } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { Navbar, Nav, Button, Container, NavDropdown } from 'react-bootstrap';
import { getToken, logoutAPI } from '../../../apis';
import { AppContext } from '../../../context/store';
import * as ACTION_TYPE from '../../../context/types';
import useOutsideClick from '../../../hooks/useOutsideClick';
import useWindowSize from '../../../hooks/useWindowSize';

const MainNavbar = () => {
  const selfRef = useRef();
  const { state, dispatch } = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);
  const size = useWindowSize();

  useOutsideClick(selfRef, () => {
    setExpanded(false);
  });

  useEffect(() => {
    if (size.width >= 992) setExpanded(false);
  }, [size.width]);

  return (
    <MainNavbarContainer
      ref={selfRef}
      expand='lg'
      bg='dark'
      variant='dark'
      fixed='top'
      onToggle={() => {
        setExpanded(!expanded);
      }}
      expanded={expanded}
    >
      <Container className='quiz-container'>
        <Navbar.Brand href='/'>Quiz App</Navbar.Brand>
        <Navbar.Toggle aria-controls='quiz-navbar-nav' />
        <Navbar.Collapse id='quiz-navbar-nav'>
          {state.auth.id !== -1 && (
            <>
              <MainNav className='me-auto'>
                <Nav.Link
                  onClick={() => {
                    if (size.width < 992) setExpanded(!expanded);
                    Router.push('/lists');
                  }}
                >
                  Lists
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    if (size.width < 992) setExpanded(!expanded);

                    Router.push('/translation');
                  }}
                >
                  Translations
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    if (size.width < 992) setExpanded(!expanded);

                    Router.push('/quiz');
                  }}
                >
                  Quiz
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    if (size.width < 992) setExpanded(!expanded);

                    Router.push('/stats');
                  }}
                >
                  Stats
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    if (size.width < 992) setExpanded(!expanded);

                    Router.push('/ranking');
                  }}
                >
                  Ranking
                </Nav.Link>
              </MainNav>
              <RightNav>
                <MainNavDropDown
                  id='auth-user-dropdown'
                  title={state.auth.nickname}
                  wrapperClass='auth-nav-dropdown'
                >
                  <NavDropdown.Item
                    onClick={() => {
                      if (size.width < 992) setExpanded(!expanded);

                      Router.push('/profile');
                    }}
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      if (size.width < 992) setExpanded(!expanded);

                      logoutAPI();
                      dispatch({
                        type: ACTION_TYPE.ACTION_LOGOUT,
                        payload: {},
                      });
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </MainNavDropDown>
              </RightNav>
            </>
          )}
          {state.auth.id === -1 && (
            <>
              <MainNav className='me-auto'>
                <Nav.Link
                  onClick={() => {
                    if (size.width < 992) setExpanded(!expanded);
                    Router.push('/lists');
                  }}
                >
                  Lists
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    if (size.width < 992) setExpanded(!expanded);
                    Router.push('/quiz');
                  }}
                >
                  Quiz
                </Nav.Link>
              </MainNav>
              <RightNav>
                <Nav.Link
                  onClick={() => {
                    if (size.width < 992) setExpanded(!expanded);
                    Router.push('login');
                  }}
                >
                  Login
                </Nav.Link>
                <Button
                  className='btn-auth btn-register'
                  variant='outline-primary'
                  onClick={() => {
                    if (size.width < 992) setExpanded(!expanded);
                    Router.push('/register');
                  }}
                >
                  Register
                </Button>
              </RightNav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </MainNavbarContainer>
  );
};
export default MainNavbar;

const MainNavDropDown = ({
  id = new Date().valueOf(),
  wrapperClass = '',
  title = '',
  children,
}) => {
  const rootClass = ['mainnav-dropdown-menu'];
  if (wrapperClass) rootClass.push(wrapperClass);

  // const [show, setShow] = useState(false);
  // const showDropdown = (e) => {
  //   setShow(!show);
  // };
  // const hideDropdown = (e) => {
  //   setShow(false);
  // };

  return (
    <NavDropdown
      id={id}
      title={title}
      className={rootClass.join(' ')}
      renderMenuOnMount={true}
      // show={show}
      // onMouseEnter={showDropdown}
      // onMouseLeave={hideDropdown}
    >
      {children}
    </NavDropdown>
  );
};

const MainNavbarContainer = styled(Navbar)`
  padding-top: 0;
  padding-bottom: 0;

  .navbar-brand {
    padding-top: 0;
    padding-bottom: 0;
    min-height: 64px;
    display: flex;
    align-items: center;
  }

  &.navbar-dark {
    .navbar-nav {
      .nav-link {
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        padding: 10px;
        margin: 0 10px;
        font-size: 1rem;
        &:hover {
          color: rgba(255, 255, 255, 0.75);
        }
      }
    }
  }
`;

const MainNav = styled(Nav)`
  align-items: center;
  flex: 1 1 100%;
  justify-content: center;

  @media (min-width: 992px) {
    margin-left: 100px;
  }
`;

const RightNav = styled(Nav)`
  .btn-auth {
    color: white;
    border-color: white;
  }
  .btn-register {
    height: 44px;
    margin: 10px 0;
  }

  .mainnav-dropdown-menu {
    &.auth-nav-dropdown {
      > .dropdown-toggle {
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1rem;
        line-height: 1.5;
        padding: 20px 0;

        &:after {
          content: ' ';
          display: inline-block;
          margin-left: 0.255em;
          vertical-align: 0.255em;
          content: '';
          border-top: 0.3em solid;
          border-right: 0.3em solid transparent;
          border-bottom: 0;
          border-left: 0.3em solid transparent;
        }
      }
    }
    .dropdown-menu {
      width: 100%;
      border: none;
      background-color: rgba(
        var(--bs-dark-rgb),
        var(--bs-bg-opacity)
      ) !important;

      > .dropdown-item {
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1rem;
        line-height: 1.5;
        width: 100%;
        cursor: pointer;
        &:hover {
          background: transparent;
          color: rgba(255, 255, 255, 0.75);
        }
      }
    }
  }

  @media (min-width: 992px) {
    .mainnav-dropdown-menu {
      .dropdown-menu {
        width: 120px;
        min-width: auto;
        right: 10px;
        > .dropdown-item {
          justify-content: flex-start;
        }
      }
      &.auth-nav-dropdown {
        margin-left: auto;
      }
    }
  }
`;
