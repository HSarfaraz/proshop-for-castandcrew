import React,{ useState,useEffect} from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
//import { Message } from '../components/Message.js';
import Loader  from '../components/Loader.js'
import { Link } from 'react-router-dom';
import Message from '../components/Message.js';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants.js'

const OrderScreen = ({ match, history }) => {

  const orderId = match.params.id;
  
  const [sdkReady, setSdkReady ] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
 
  const orderPay = useSelector((state) => state.orderPay);
  // We are renaming here loadingPay & successPay
  const { loading:loadingPay, success:successPay } = orderPay;
  
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading:loadingDeliver, success:successDeliver } = orderDeliver;

  // Give us logged in user
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  if(order){
    //Calculate price
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }
  
    order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  }

  useEffect(() => {

    if(!userInfo) {
      history.push('/login')
    }
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      //It is adding dynamically paypal script
      document.body.appendChild(script);
    }

    //addPayPalScript();

    if(!order || order._id !== orderId || successPay || successDeliver) {
        dispatch({ type: ORDER_PAY_RESET }); //if not given this line, the page keep refrehing 
        dispatch({ type: ORDER_DELIVER_RESET }); 
        dispatch(getOrderDetails(orderId));
    } else if(!order.isPai) {
      if(!window.paypal){
        addPayPalScript();
      } else{
        setSdkReady(true);
      }
    }
}, [order, orderId, dispatch, successPay, successDeliver]) 

  const successPaymentHandler = (paymentResult) => {
    //call the payorder fro action 
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult)); //it will updat the db that it is paid
    dispatch(deliverOrder(order._id)); 
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return ( loading ? <Loader /> : error ? ( <Message variant='danger'>{error}</Message> ) : 
    <>
      <h1>Order {order._id}</h1>
       <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroup.Item variant='flush'>
              <h4 className="font-weight-bold text-uppercase">Shipping</h4>
              <p><strong className="badge badge-light mr-3 p-1 px-2">Name: </strong> {order.user.name} </p>
              <p><strong className="badge badge-light mr-3 p-1 px-2">Email: </strong><a href={`mailto:${order.user.email}`}> {order.user.email}</a> </p>
              <p>
                <strong className="badge badge-light mr-3 p-1 px-2">Address: </strong>
                {order.shippingAddress.address},{' '}
                {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? ( <Message variant='success'>Delivered on {order.deliveredAt}</Message>) : ( <Message variant='danger'>Not Delivered </Message> )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h4 className="font-weight-bold text-uppercase">Payment Method</h4>
              <p><strong className="badge badge-light mr-3 p-1 px-2">Method: </strong>
              {order.paymentMethod}</p>
              {order.isPaid ? ( <Message variant='success'>Paid on {order.paidAt}</Message>) : ( <Message variant='danger'>Not Paid </Message> )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4 className="font-weight-bold text-uppercase">Order Item</h4>
              {order.orderItems.length === 0 ? ( 
              <Message> Your Cart is empty </Message> 
               ) : (
                <ListGroup variant='flush'>
                    {order.orderItems.map((item, index) => (
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
                      <Col> ${order.itemsPrice} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col> Shipping </Col>
                      <Col> ${order.shippingPrice} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col> Tax </Col>
                      <Col> ${order.taxPrice} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col> Total </Col>
                      <Col> ${order.totalPrice} </Col>
                    </Row>
                  </ListGroup.Item>
                  {/* If order is not paid */}
                  {!order.isPaid && (
                    <ListGroup.Item>
                      {loadingPay && <Loader /> }
                      {!sdkReady ? <Loader /> : (
                        // <PayPalButton ammount={order.totalPrice} onSuccess={successPaymentHandler} />
                        
                        // <PayPalButton
                        //   createOrder={(data, actions) => {
                        //       return actions.order.create({
                        //           purchase_units: [{
                        //               amount: {
                        //                   currency_code: "USD",
                        //                   value: order.totalPrice
                        //               }
                        //           }]
                        //       })
                        //   }}
                        //   onSuccess={successPaymentHandler} />

                        <PayPalButton                    
                          currency="USD"                       
                          amount={order.totalPrice}                       
                          onSuccess={successPaymentHandler}                     
                          />
                      )}
                    </ListGroup.Item>
                  )}

                  {loadingDeliver && <Loader /> }
                  {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <ListGroup.Item>
                      {loadingDeliver && <Loader /> }
                      <Button type="button" className="btn btn-dark btn-block" onClick={deliverHandler}>MARK AS DELIVERED</Button>
                    </ListGroup.Item>
                  )}
              </ListGroup>
            </Card>          
        </Col>
       </Row>
    </>
  )
}

export default OrderScreen
