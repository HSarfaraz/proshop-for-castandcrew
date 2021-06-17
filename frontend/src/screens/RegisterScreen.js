import React,{ useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../actions/userActions.js';
import FormContainer  from '../components/FormContainer.js'

const RegisterScreen = ({ history,location }) => {

  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ message, setMessage ] = useState(null);

  const dispatch = useDispatch();

  const userRegister  = useSelector(state => state.userRegister)

  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect (() => {
    if(userInfo) {
      history.push(redirect)
    }
  },[history, userInfo, redirect])

  const submitHandler = (e) =>{
    e.preventDefault();
    if(password !== confirmPassword) {
      setMessage('Password do not match');
    }else{
      //Dispatch Register
      dispatch(register( name, email, password ));
    }
  }

  return (
    <FormContainer>
      <br/>
      <h4 className="p-2 bg-light text-dark border">Sign Up</h4>
      <br/>
      { message && <Message variant='danger'>{message}</Message>}
      { error && <Message variant='danger'>{error}</Message>}
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
        <Button type='submit' variant='dark'> Sign Up</Button>
        <Row className='py-3'>
          <Col>
            Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  )
}

export default RegisterScreen
