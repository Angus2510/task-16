import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Navbar from './pages/Navbar';
import Card from './pages/Card2';
import AddRecipe from './pages/AddRecipe';
import Favorites from './pages/Favorites';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (result) => {
    console.log(result);
    const user = {
      first_name: result.data.first_name,
      token: result.data.token,
      admin: result.data.admin,
    }

    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
    setIsLoggedIn(true);
  };

  const storageLoggedIn = JSON.parse(sessionStorage.getItem("isLoggedIn"));

  return (
    // Render the Login component if the user is not logged in
    <div>
      {!(isLoggedIn || storageLoggedIn) && <Login onLogin={handleLogin} />}
      {(isLoggedIn || storageLoggedIn) && (
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Card />} />
          <Route path="/addRecipe" element={<AddRecipe />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
      )}
      </div>
    )
      }

export default App;
