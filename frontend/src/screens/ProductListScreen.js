import React,{ useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions.js';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

const ProductListScreen = ({ history, match }) => {

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();
  //Get productList from store.js 
  const productList = useSelector(state => state.productList);
  const { loading, error, products, pages, page } = productList;
  
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
 
  const productDelete = useSelector(state => state.productDelete);
  const { loading: loadingDelete, error:errorDelete,success:successDelete } = productDelete;
  
  const productCreate = useSelector(state => state.productCreate);
  const { loading: loadingCreate, error:errorCreate,success:successCreate, product: createdProduct } = productCreate;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET})
   
    if(!userInfo.isAdmin) {
      history.push('/login')
    }
   
    if(successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts('', pageNumber))
    } 

  }, [
    dispatch, 
    history, 
    userInfo, 
    successDelete, 
    successCreate, 
    createdProduct, 
    pageNumber
  ])

  const deleteHandler = (id) => {
    //Give confirm to the product about delete 
    if(window.confirm('Are you sure')){
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct());
  }
  return (
    <>
     <Row className='align-items-center'>
       <Col className="col-md-3 col-sm-12">
          {/* <h4 className="p-2 bg-light text-dark border text-center">Users list</h4>        */}
          <h4 className="font-weight-bold text-uppercase">PRODUCTS</h4>       
       </Col>
       <Col className='text-right'>
          <Button className='my-3 btn-dark' onClick={createProductHandler}>
            <i className="fa fa-plus"></i> Create Product
          </Button>
       </Col>
     </Row>
     
     {loadingDelete && <Loader /> }
     {errorDelete && <Message variant='danger'>{errorDelete}</Message> }
     {loadingCreate && <Loader /> }
     {errorCreate && <Message variant='danger'>{errorCreate}</Message> }
     {loading ? <Loader /> : error ? ( <Message variant='danger'>{error}</Message>) : (

       <>
       <Table striped bordered hover responsive className="table-sm text-center">
        <thead>
          <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
          </tr>
        </thead>
        <tbody>
          {/* Loop throught the products what we got from state */}
          {products.map(product => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>
                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                  <Button variant='light' className='btn-sm mr-2'><i className='fas fa-edit'></i></Button>
                </LinkContainer>
                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                  <i className='fas fa-trash'></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
       </Table>
       <Paginate pages={pages} page={page} isAdmin={true} />
       </>
     )}
    </>
  )
}

export default ProductListScreen
