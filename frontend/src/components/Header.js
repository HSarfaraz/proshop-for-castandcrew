import React from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Navbar,Nav, Image, NavDropdown } from 'react-bootstrap';
import SearchBox from './SearchBox';
import { logout } from '../actions/userActions.js';
import logo from '../cart.png'

const Header = () => {

  const dispatch = useDispatch()

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin;

  const logoutHandler = () =>{
    dispatch(logout());
  }

  return (
    <header className="mb-3">
      <Navbar className="navbar navbar-expand-lg navbar-dark bg-dark p-0" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand> 
              <Image src={logo} width={40}  rounded className="bg-light p-1 mr-1"  /> ProShop
          </Navbar.Brand>
          </LinkContainer>
          {/* <i className="fa fa-shopping-cart fa-2x" aria-hidden="true"></i> */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            
            <Route render={ ({history}) => <SearchBox history={history} /> }/>
            
            <Nav className="ml-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart "></i> Cart
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : <LinkContainer to="/login">
                <Nav.Link> 
                  <i className="fas fa-user"></i> Sigin
                </Nav.Link>
              </LinkContainer>}
              
              {userInfo && userInfo.isAdmin &&  (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  
                </NavDropdown>
              )}              
            </Nav>          
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header;
