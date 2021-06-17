import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import ProductsCarousel from '../components/ProductsCarousel';
import Paginate from '../components/Paginate';
import { listProducts } from '../actions/productActions';



//import axios from 'axios';
// import products from '../products'; //We fetched it fron frontend 

const HomeScreen = ({ match }) => {

  // Without Redux, we are calling from products.js
  // const [products, setProducts] = useState([]);
  // useEffect(()=> {
  //   const fetchProducts = async () =>{
  //     const { data } = await axios.get('/api/products')
  //     setProducts(data)
  //   }
  //   fetchProducts()
  // },[])

  const dispatch = useDispatch();
  
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;
  
  const productList = useSelector(state => state.productList);
  const { loading, error, products, pages, page } = productList

  useEffect(()=> {
    dispatch(listProducts(keyword, pageNumber))
  },[dispatch, keyword, pageNumber])

  return (
    <>
     {/* <Helmet>
          <meta charSet="utf-8" />
          <title>Welcome To ProShop</title>
          <meta name="description" content='We sell the best products for cheap' />
          <meta name="Keywords" content='Buy Electronics, Cheap Electronics' />
          <link rel="canonical" href="http://mysite.com/example" />
      </Helmet> */}
      <Meta/>
    { !keyword ? (<ProductsCarousel /> ) : ( 
     <Link to='/' className="pl-2 btn btn-light my-3"> <i className="fas fa-chevron-left pr-2"></i> Go Back </Link>
     ) }

     <h4 className="font-weight-bold text-uppercase">Latest Products</h4>
     {loading ? (<Loader /> ) : error ? ( <Message variant='danger'>{error}</Message> ) 
     : (
       <>
      <Row >
        {products.map(product => (
          <Col sm={12} md={6} lg={3} key={product._id} className="m-0 px-3 py-2">
            {/* <h3>{product.name}</h3> */}
            <Product product={product}/>
          </Col>
        ))} 
      </Row> 
      <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''}/>
      </>
     )}
    </>
  )
}

export default HomeScreen;
