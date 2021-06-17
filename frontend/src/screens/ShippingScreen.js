import React,{ useState} from 'react';
import { Form, Button} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions.js';
import FormContainer  from '../components/FormContainer.js'
import CheckoutSteps  from '../components/CheckoutSteps.js'

const ShippingScreen = ({ history,location }) => {

   const cart  = useSelector(state => state.cart)

  const { shippingAddress } = cart;

  const [ address, setAddress ] = useState(shippingAddress.address);
  const [ city, setCity ] = useState(shippingAddress.city);
  const [ postalCode, setPostalCode ] = useState(shippingAddress.postalCode);
  const [ country, setCountry ] = useState(shippingAddress.country);

  const dispatch = useDispatch();

  const submitHandler = (e) =>{
     e.preventDefault();
     dispatch(saveShippingAddress({ address, city, postalCode, country }))

     history.push('/payment');
  }
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <br/><h4 className="p-2 bg-light text-dark border rounded">Shipping</h4><br/>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control type='text' placeholder='Enter Address' value={address} onChange={(e) => setAddress(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId='city'>
          <Form.Label>Email City</Form.Label>
          <Form.Control type='text' placeholder='Enter City' value={city} onChange={(e) => setCity(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control type='password' placeholder='Enter Postal Code' value={postalCode} onChange={(e) => setPostalCode (e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId='country'>
          <Form.Label>Confirm Country</Form.Label>
          <Form.Control type='text' placeholder='Enter Country' value={country} onChange={(e) => setCountry(e.target.value)}></Form.Control>
        </Form.Group>

        <Button type='submit' variant='dark'> Continue</Button>
        
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
