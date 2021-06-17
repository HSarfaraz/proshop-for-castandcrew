import React from 'react'
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({product}) => {
  return (
    <Card className="my-2 p-0 rounded" >
      <Link to={`/product/${product._id}`} className="text-dark">
        <Card.Img src={product.image} variant='top' />
      </Link>
      <Card.Body className="my-0" style={{height:'60px'}}>
        <Link to={`/product/${product._id}`} >
          <Card.Title as="div" className="text-dark mx-2 my-1 "><strong>{product.name}</strong></Card.Title>
        </Link>
      </Card.Body>
      <Card.Text as="div" className="mx-4 my-2">
        <Rating value={product.rating} text={`${product.numReviews} Reviews` } />
        
        {/* old */}
        {/* <div className="m-3">
            {product.rating} from {product.numReviews} Reviews 
        </div> */}
      </Card.Text>
      <Card.Text as='h5' className="mx-4 mb-4">
        $ {product.price}
      </Card.Text>
    </Card>    
  )
}

export default Product;
