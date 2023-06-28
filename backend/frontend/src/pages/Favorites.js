import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Nav from "react-bootstrap/Nav";

function Favorites() {
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("#first");
  const [token, setToken] = useState(null);
  const user = JSON.parse(sessionStorage.getItem("user"));

  const config = {
    headers: {
      authorization: user.token,
    },
  };

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await axios.get("/getRecipe/get", config);
        console.log(response.data.favorites);
        setRecipes(response.data.favorites);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRecipes();
  }, []);

  const removeFromFavorites = async (recipeId) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const config = {
      headers: {
        authorization: user.token,
      },
    };

    try {
      // Make a DELETE request to remove the recipe from the user's favorites array
      await axios.delete(`/deleteRecipe/removeFromFavorites/${recipeId}`,config);
      console.log("Recipe removed from favorites:", recipeId);
    } catch (error) {
      console.error(
        "An error occurred while removing the recipe from favorites:",
        error
      );
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const cardColors = ["primary", "secondary", "success", "danger", "warning"];

  return (
    <div className="card-container">
      {recipes.map((recipe, index) => (
        <Card
          className="card"
          style={{ height: "fit-content", width: "25rem" }}
          key={index}
          bg={cardColors[index % cardColors.length]}
          text="white"
        >
          <Card.Header>
            <Nav
              variant="tabs"
              defaultActiveKey="#first"
              activeKey={activeTab}
              onSelect={handleTabChange}
            >
              <Nav.Item>
                <Nav.Link eventKey="#first">Active</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="#ingredients">Ingredients</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="#steps">Steps</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Card.Title>{recipe.title}</Card.Title>
            <Card.Text>{recipe.blurb}</Card.Text>
            {activeTab === "#first" && (
              <ListGroup className="list-group-flush">
                <ListGroup.Item>Time: {recipe.time}</ListGroup.Item>
                <ListGroup.Item>Review: {recipe.rating}</ListGroup.Item>
                <ListGroup.Item>Type: {recipe.type}</ListGroup.Item>
              </ListGroup>
            )}
            {activeTab === "#ingredients" && (
              <Card.Text>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </Card.Text>
            )}
            {activeTab === "#steps" && (
              <Card.Text>
                <ol>
                  {recipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </Card.Text>
            )}
          </Card.Body>
          <Card.Footer>
            <Button
              variant="danger"
              onClick={() => removeFromFavorites(recipe._id)}
            >
              Remove from Favorites
            </Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
}

export default Favorites;
