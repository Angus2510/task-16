import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import '../App.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginDetails = { email: email, password: password };
    try {
      const response = await axios.post('/login', loginDetails);
      //console.log(response);
      onLogin(response); // Call the onLogin prop to update the parent component
      setLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    const userObj = { first_name: firstName, last_name: lastName, email: email, password: password };
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setShowSignUp(false);
    try {
      const response = await axios.post(`/register`, userObj);
      console.log(response);
      setLoggedIn(true);
      onLogin(); // Call the onLogin prop to update the parent component
    } catch (error) {
      console.error("An error occurred while updating the user:", error);
      // Handle the error appropriately
    }
  };

  if (loggedIn) {
    return <p>User is logged in.</p>;
  }

  if (showSignUp) {
    return (
      <Form className="signIn" variant="dark" onSubmit={handleSignUpSubmit}>
        <Form.Group className="mb-3" controlId="formBasicFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmailSignUp">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPasswordSignUp">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleSignUpSubmit} type="submit">
          Sign Up
        </Button>
      </Form>
    );
  }

  return (
    <div>
      <Form className="signIn" variant="dark" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button
          variant="warning"
          onClick={handleSubmit}
          type="submit"
          disabled={!validateForm()}
        >
          Submit
        </Button>
        <Button variant="primary" onClick={() => setShowSignUp(true)}>
          Sign Up
        </Button>
      </Form>
    </div>
  );
}

export default Login;
