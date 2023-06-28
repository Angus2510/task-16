import Container from 'react-bootstrap/Container';
import { useState, useEffect } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../images/logo2.png'

function Navbars() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    setUserName(user.first_name);
  }, []);
  return (
    <>
      <Navbar bg="light" variant="light" sticky="top">
        <Container className='navbar'>
            <img src = {logo} alt='logo'/>         
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/favorites">Favorites</Nav.Link>
            <Nav.Link href="/addRecipe">Add Recipe</Nav.Link>
          </Nav>
          <Navbar.Text>
            Signed in as: <a href="#login">{userName}</a>
          </Navbar.Text>
        </Container>
      </Navbar>
      
      
    </>
  );
}

export default Navbars;