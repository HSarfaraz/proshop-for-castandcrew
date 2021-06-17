import React from 'react';
import { Image, Container, Row, Col } from 'react-bootstrap';
import sarfarazImg from '../sarfaraz-img.jfif'
const Footer = () => {
  return (
    <footer className="footer bg-light p b-0">
      {/* <Container>
        <Row>
          <Col className="text-center pt-3 pb-0">
            <Image src={sarfarazImg} alt="sarfaraz Image " className="rounded" style={{height:'50px'}} />
          </Col>  
        </Row>  
        <Row>
          <Col className="text-center py-3">
            © MERN ProShop &nbsp; | &nbsp; By <b> Sarfaraz Hussain</b>
          </Col>  
        </Row>  
      </Container> */}
       <Container>
        <Row>
        
          <Col className="text-left py-4 col-sm-4 mt-3">
            © MERN ProShop 
          </Col>  
          <Col className="text-right py-3 col-sm-8">
            <Image src={sarfarazImg} alt="sarfaraz Image " className="rounded" style={{height:'50px'}} />
            &nbsp; | &nbsp; By <b> Sarfaraz Hussain</b>
          </Col>  
        </Row>  
      </Container>
    </footer>
  )
}

export default Footer;
