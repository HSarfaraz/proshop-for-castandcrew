import React,{ useEffect} from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
//import { Message } from '../components/Message.js';
import CheckoutSteps  from '../components/CheckoutSteps.js'
import { Link } from 'react-router-dom';
import Message from '../components/Message.js';
import { createOrder } from '../actions/orderActions.js';

const PlaceOrderScreen = ({history}) => {

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  //Calculate price
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  
  //  taxPrice totalPrice
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 :100);

  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))

  cart.totalPrice = Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice);

  const orderCreate = useSelector(state => state.orderCreate);

  const { order, success, error } = orderCreate;

  useEffect(() => {
    if(success) {
      history.push(`/order/${order._id}`)
    }
    // eslint-disable-next-line
  },[history, success]);

  const placeOrderHandler = () => {
    // cart.paymentMethod = "paypal";
    dispatch(createOrder({
      orderItems      : cart.cartItems, 
      shippingAddress : cart.shippingAddress,
      paymentMethod   : cart.paymentMethod,
      itemPrice       : cart.itemsPrice,
      shippingPrice   : cart.shippingPrice,
      taxPrice        : cart.taxPrice,
      totalPrice      : cart.totalPrice
    }));
  }

  return (
    <>
       <CheckoutSteps step1 step2 step3 step4 />
       <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroup.Item variant='flush'>
              <h4 className="font-weight-bold text-uppercase">Shipping</h4>
              <p>
                <strong className="badge badge-light mr-3 p-1 px-2">Address: </strong>
                {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}

              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4 className="font-weight-bold text-uppercase">Payment Method</h4>
              <strong className="badge badge-light mr-3 p-1 px-2">Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4 className="font-weight-bold text-uppercase">Order Item</h4>
              {cart.cartItems.length === 0 ? ( 
              <Message> Your Cart is empty </Message> 
               ) : (
                <ListGroup variant='flush'>
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image src={item.image} alt={item.name} fluid rounded/>
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                          </Col>
                          <Col md={4}>
                              {item.qty} x ${item.price} = ${item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        
        <Col md={4}>
            <Card className="no-border">
              <ListGroup vriant='flush'>
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col> Items </Col>
                      <Col> ${cart.itemsPrice} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col> Shipping </Col>
                      <Col> ${cart.shippingPrice} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col> Tax </Col>
                      <Col> ${cart.taxPrice} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col> Total </Col>
                      <Col> ${cart.totalPrice} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {error && <Message variant='danger'>{error}</Message>}
                  </ListGroup.Item>
                  <ListGroup.Item>
                   <Button type='button' className='btn-dark btn-block' disabled={cart.cartItems === 0 } onClick={placeOrderHandler}>Place Order</Button>
                  </ListGroup.Item>
              </ListGroup>
            </Card>          
        </Col>
       </Row>
    </>
  )
}

export default PlaceOrderScreen