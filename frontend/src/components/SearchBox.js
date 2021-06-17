import React,{ useState } from 'react';
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({ history }) => {
  
  const [ keyword, setKeyword] = useState(''); 

  const submitHandler = (e) => {
    e.preventDefault();
    if(keyword.trim()) {
      history.push(`/search/${keyword}`)
    } else {
       history.push(`/`)
    }
  }

  return (
    <Form onSubmit={submitHandler} inline className="col-sm-6">
     
      {/* <Form.Control
        type='text' 
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search Products'
        className='mr-sm-2 ml-sm-5'>
      </Form.Control>
      <Button type='submit' variant='warning' className='btn btn-md'>Search</Button> */}

      {/* <Form.Label htmlFor="inlineFormInputGroup" srOnly>
        Username
      </Form.Label>
      <Form.InputGroup className="mb-2">
        <Form.InputGroup.Prepend>
          <Form.InputGroup.Text>@</Form.InputGroup.Text>
        </Form.InputGroup.Prepend>
        <Form.Control id="inlineFormInputGroup" placeholder="Username" />
      </Form.InputGroup> */}

      <div className="input-group">
        {/* <Form.Control type="text" className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" /> */}

        <Form.Control
        type='text' 
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search Products'
        aria-describedby="basic-addon2"
        className='ml-sm-5' />
        <span className="input-group-append">
          <Button id="basic-addon2" type='submit' variant='info' className='btn btn-md bg-custom-info'>Search</Button>
        </span>
      </div>
      
    </Form>
  )
}

export default SearchBox
