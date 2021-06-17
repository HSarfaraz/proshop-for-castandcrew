import React,{ useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listUsers, deleteUser } from '../actions/userActions.js';

const UserListScreen = ({ history }) => {

  const dispatch = useDispatch();
  //Get userList from store.js 
  const userList = useSelector(state => state.userList);
  const { loading, error, users } = userList;
  
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
 
  const userDelete = useSelector(state => state.userDelete);
  const { success:successDelete } = userDelete;

  useEffect(() => {
    if(userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, successDelete, userInfo])

  const deleteHandler = (id) => {
    //Give confirm to the user about delete 
    if(window.confirm('Are you sure')){
      dispatch(deleteUser(id))
    }
  }
  return (
    <>
     {/* <h4 className="p-2 bg-light text-dark border rounded text-center">Users list</h4><br/> */}
     <h4 className="font-weight-bold text-uppercase">USERS</h4> 
     {loading ? <Loader /> :error ? ( <Message variant='danger'>{error}</Message>) : (
       <Table striped bordered hover responsive className="table-sm text-center">
        <thead>
          <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
          </tr>
        </thead>
        <tbody>
          {/* Loop throught the users what we got from state */}
          {users.map(user => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
              <td>{user.isAdmin ? (<i className='fas fa-check' style={{color: 'green'}}></i>) : (<i className='fas fa-times' style={{color: 'red'}}></i>) }</td>
              <td>
                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                  <Button variant='light' className='btn-sm mr-2'><i className='fas fa-edit'></i></Button>
                </LinkContainer>
                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                  <i className='fas fa-trash'></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
       </Table>
     )}
    </>
  )
}

export default UserListScreen
