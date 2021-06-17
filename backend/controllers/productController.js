import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @ desc    Fetch all products
// @ route   GET /api/products
// @ access  Public
const getProducts = asyncHandler(async (req, res) => {
  
  const pageSize = 3 //This decide how many items we needed in a page 
  const page = Number(req.query.pageNumber) || 1

  // ---------- Start search functionality -----------------
  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {} 
  // ---------- End search functionality -------------------

  //Get the total account of product 
  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1 ))
  
  res.json({products, page, pages: Math.ceil(count / pageSize )});
})


// @ desc    Fetch single product
// @ route   GET /api/products/:id
// @ access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if(product){
    res.json(product);
  }else{
    res.status(404)
    throw new Error('Product not found')
  }
})

// @ desc    Delete a product
// @ route   DELETE /api/products/:id
// @ access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if(product){
    await product.remove();
    res.json({ message: 'Product Removed '})
  }else{
    res.status(404)
    throw new Error('Product not found')
  }
})

// @ desc    Create a product
// @ route   POST /api/products
// @ access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    category: 'Sample category',
    brand: 'Sample brand',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
})

// @ desc    Update a product
// @ route   PUT /api/products/:id
// @ access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {

  //Get the data from the Body
  const { name, price, image, description, brand, category, countInStock} = req.body;

  const product = await Product.findById(req.params.id)

  if(product){
    product.name = name,
    product.price = price,
    product.description = description,
    product.image = image,
    product.brand = brand,
    product.category = category,
    product.countInStock = countInStock
    
    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  }else{
    res.status(404)
    throw new Error('Product not found')
  }

})



// ********************************** Reviews *****************

// @ desc    Create new review
// @ route   POST /api/products/:id/review
// @ access  Private
const createProductReview = asyncHandler(async (req, res) => {
 
   //Get the data from the Body
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id)
 
  if(product){
    const alreadyReviewed = product.reviews.find((r)=> r.user.toString() === req.user._id.toString())
    
    if(alreadyReviewed){
       res.status(400)
      throw new Error('Product already reviewed')
    } 
    
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id 
    }
    
    product.reviews.push(review);
    product.newReviews = product.reviews.length;
    product.rating = 
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save();
    res.status(201).json({ message: "Review Added"});

  }else{
    res.status(404)
    throw new Error('Product not found')
  }

})

//Corousel 
// @ desc    get Top rated product
// @ route   GET /api/products/top/:top
// @ access  Public
const getTopProducts = asyncHandler(async (req, res) => {

   const products = await Product.find({}).sort({ rating: -1 }).limit(3)
  
  res.json(products)
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts
}