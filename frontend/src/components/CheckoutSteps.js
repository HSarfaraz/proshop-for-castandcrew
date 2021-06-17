import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


const CheckoutSteps = ({ step1, step2, step3, step4}) => {
  return (
    <Nav className="justify-content-center mb-4 col-sm-12 m-0 p-0">
      <Nav.Item>
        {step1 ? (
          <LinkContainer to='/login'>
            <Nav.Link><button className="btn btn-dark">Sign In <i className="fas fa-chevron-right pl-2"></i></button></Nav.Link>
          </LinkContainer>
        ) : <Nav.Link disabled><button className="btn btn-light">Sign In </button> </Nav.Link>}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link><button className="btn btn-dark">Shipping <i className="fas fa-chevron-right pl-2"></i></button></Nav.Link>
          </LinkContainer>
        ) : <Nav.Link disabled><button className="btn btn-light">Shipping</button> </Nav.Link>}
      </Nav.Item>
      
      <Nav.Item>
        {step3 ? (
          <LinkContainer to='/payment'>
            <Nav.Link><button className="btn btn-dark">Payment <i className="fas fa-chevron-right pl-2"></i></button></Nav.Link>
          </LinkContainer>
        ) : <Nav.Link disabled><button className="btn btn-light">Payment </button> </Nav.Link>}
      </Nav.Item>
      
      <Nav.Item>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link><button className="btn btn-dark">Place Order </button></Nav.Link>
          </LinkContainer>
        ) : <Nav.Link disabled><button className="btn btn-light">Place Order </button> </Nav.Link>}
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
