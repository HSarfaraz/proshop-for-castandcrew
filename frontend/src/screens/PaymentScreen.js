import React,{ useState} from 'react';
import { Form, Button, Col} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions.js';
import FormContainer  from '../components/FormContainer.js'
import CheckoutSteps  from '../components/CheckoutSteps.js'

const PaymentScreen = ({ history,location }) => {

  const cart  = useSelector(state => state.cart)
  const { shippingAddress } = cart;

  if(!shippingAddress) {
    history.push('/shipping')
  }
  const [ paymentmethod, setPaymentmethod ] = useState('PayPal');
  
  const dispatch = useDispatch();


  const submitHandler = (e) =>{
     e.preventDefault();
     dispatch(savePaymentMethod(paymentmethod))

     history.push('/placeorder');
  }
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3/>
      <h4 className="p-2 bg-light text-dark rounded">Payment Method</h4><br/>
      
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
        
          <Col>
            <Form.Check type="radio" label="PayPal or Credit Card" id="PayPal" name="paymentMethod" value="PayPal" checked onChange={(e) => setPaymentmethod(e.target.value)}>
            </Form.Check>
          </Col>
        </Form.Group>

        <Button type='submit' variant='dark'> Continue</Button>
        
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
