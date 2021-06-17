import React,{ useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table} from 'react-bootstrap';
import { LinkContainer} from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions.js';
import { listMyOrders } from '../actions/orderActions.js';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants.js'
const ProfileScreen = ({ history,location }) => {

  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ message, setMessage ] = useState(null);

  const dispatch = useDispatch();

  const userDetails  = useSelector(state => state.userDetails)
  const { loading, error, user} = userDetails;

  const userLogin  = useSelector(state => state.userLogin)
  const { userInfo} = userLogin;
 
  const userUpdateProfile  = useSelector(state => state.userUpdateProfile)
  const { success } = userUpdateProfile;

  const orderListMy  = useSelector(state => state.orderListMy)
  const { loading:loadingOrders, error:errorOrders, orders} = orderListMy;

  useEffect (() => {
    if(!userInfo) {
      history.push('/login')
    } else{
      if(!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET})
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders())
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  },[history, userInfo, dispatch, user, success])

  const submitHandler = (e) =>{
    e.preventDefault();
    if(password !== confirmPassword) {
      setMessage('Password do not match');
    }else{
      //Dispatch update profile
      dispatch(updateUserProfile( { id: user._id, name, email, password } ));
    }
  }

  return (
    <Row>
      <Col md={3}>
        <br/>
        <h4 className="p-2 bg-light text-dark border rounded">User Profile</h4>
        <br/>
        {/* <h4 className="font-weight-bold text-uppercase">User Profile</h4>  */}
      { message && <Message variant='danger'>{message}</Message>}
      { error && <Message variant='danger'>{error}</Message>}
      { success && <Message variant='success'>Profile Updated</Message>}
      { loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Enter Passwrod' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type='password' placeholder='Enter Confirm Passwrod' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
        </Form.Group>
       <Button type='submit' variant='dark'> Update</Button>
      </Form>
      </Col>
      <Col md={9}>
        {/* <br/>
        <h4 className="p-2 bg-light text-dark border rounded">My Orders</h4>
        <br/> */}
        <br/><h4 className="font-weight-bold text-uppercase">My Orders</h4><br/> 
        {loadingOrders ? <Loader /> : errorOrders ? <Message variant='danger'>{errorOrders}</Message> : (
          <Table striped bordered hover responsive className='table-md text-center'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>---</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : ( <i className='fas fa-times' style={{ color: 'red' }}></i> )}</td>
                  <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : ( <i className='fas fa-times' style={{ color: 'red' }}></i> )}</td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm text-center bg-white' variant='light'>Detail</Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
      
    </Row>
  )
}

export default ProfileScreen
