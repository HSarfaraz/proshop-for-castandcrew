import React,{ useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer  from '../components/FormContainer.js'
import { getUserDetails, updateUser } from '../actions/userActions.js';
import { USER_UPDATE_RESET } from '../constants/userConstants.js';

const UserEditScreen = ({ history,match }) => {

  const userId = match.params.id;
  
  const [ name,    setName ] = useState('');
  const [ email,   setEmail ] = useState('');
  const [ isAdmin, setIsAdmin ] = useState(false);

  const dispatch = useDispatch();

  const userDetails  = useSelector(state => state.userDetails)
  const { loading, error, user } = userDetails;
  
  const userUpdate  = useSelector(state => state.userUpdate)
  const { loading:loadingUpdate, error:errorUpdate, success:successUpdate } = userUpdate;


  useEffect (() => {

    //check for success update 
    if(successUpdate){
      dispatch({ type: USER_UPDATE_RESET});
      history.push('/admin/userlist')
    } else{
      if(!user.name || user._id !== userId){
        dispatch(getUserDetails(userId))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }
  },[dispatch, userId, user,successUpdate, history])

  const submitHandler = (e) =>{
    e.preventDefault();
   dispatch(updateUser({_id: userId, name, email, isAdmin }))
  }

  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'> <i className="fas fa-chevron-left pr-2"></i> Go back </Link>
    
    <FormContainer>
      <br/><h4 className="p-2 bg-light text-dark border rounded">Edit User</h4><br/>
      { loadingUpdate && <Loader />}
      { errorUpdate && <Message variant='danger'>{errorUpdate}</Message> }
      { loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
        </Form.Group>
        
        <Form.Group controlId='isAdmin'>
          <Form.Check type='checkbox' label='Is Admin' value={isAdmin} checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
        </Form.Group>
        
        <Button type='submit' variant='dark'> Update</Button>
      </Form>

    )}
   </FormContainer>
    </>
  )
}

export default UserEditScreen
