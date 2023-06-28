import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function RecipeCard() {
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("#first");
  const [token, setToken] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRecipeId, setEditRecipeId] = useState(null);
  const [editRecipeValue, setEditRecipeValue] = useState({
    title: "",
    time: "",
    rating: 0,
    blurb: "",
    steps: [""],
    ingredients: [""],
    approved: false,
    type: "",
  });
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isAdmin = user.admin; // Check if the user is an admin

  const config = {
    headers: {
      authorization: user.token,
    },
  };

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await axios.get("/getRecipe/getAll", config);
        console.log(response.data.recipes);
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRecipes();
  }, []);

  const addToFavorites = async (recipeId) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const config = {
      headers: {
        authorization: user.token,
      },
    };
    console.log(recipeId);
    try {
      // Make a PUT request to update the user's favorites array
      await axios.put(`/addRecipe/addToFavorites/${recipeId}`, {}, config);
      console.log("Recipe added to favorites:", recipeId);
    } catch (error) {
      console.error(
        "An error occurred while adding the recipe to favorites:",
        error
      );
    }
  };

  const editRecipe = (recipeId, updatedRecipe) => {
    setEditRecipeId(recipeId);
    setEditRecipeValue(updatedRecipe);
    setShowEditModal(true);
  };

  const handleFieldChange = (event, field) => {
    setEditRecipeValue((prevState) => ({
      ...prevState,
      [field]: event.target.value,
    }));
  };

  const handleStepChange = (event, index) => {
    const updatedSteps = [...editRecipeValue.steps];
    updatedSteps[index] = event.target.value;
    setEditRecipeValue((prevState) => ({
      ...prevState,
      steps: updatedSteps,
    }));
  };

  const handleIngredientChange = (event, index) => {
    const updatedIngredients = [...editRecipeValue.ingredients];
    updatedIngredients[index] = event.target.value;
    setEditRecipeValue((prevState) => ({
      ...prevState,
      ingredients: updatedIngredients,
    }));
  };

  const saveEditedRecipe = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const config = {
      headers: {
        Authorization: user.token,
      },
    };

    try {
      // Make a PUT request to the backend API endpoint
      await axios.put(
        `/editRecipe/updateOne/${editRecipeId}`,
        { value: editRecipeValue },
        config
      );
      console.log(`Recipe ${editRecipeId} updated`);
      setShowEditModal(false);
    } catch (error) {
      console.error("An error occurred while updating the recipe:", error);
    }
  };

  const deleteRecipe = async (recipeId) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const config = {
      headers: {
        authorization: user.token,
      },
    };
    try {
      // Make a DELETE request to remove the item using axios
      await axios.delete(`/deleteRecipe/delete/${recipeId}`, config);
      console.log("Item removed successfully");
    } catch (error) {
      console.error("An error occurred while removing the item:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (recipes.length === 0) {
    return <div>Loading...</div>;
  }

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
                <Nav.Link eventKey="#first">Recipe</Nav.Link>
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
            <ButtonGroup className="group" aria-label="Basic example">
              <Button variant="success" onClick={() => addToFavorites(recipe._id)}>
                Add to Favorites
              </Button>
              {isAdmin && (
                <>
                  <Button variant="warning" onClick={() => editRecipe(recipe._id, recipe)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => deleteRecipe(recipe._id)}>
                    Delete
                  </Button>
                </>
              )}
            </ButtonGroup>
          </Card.Footer>
        </Card>
      ))}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editRecipeTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editRecipeValue.title}
                onChange={(event) => handleFieldChange(event, "title")}
              />
            </Form.Group>
            <Form.Group controlId="editRecipeTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="text"
                value={editRecipeValue.time}
                onChange={(event) => handleFieldChange(event, "time")}
              />
            </Form.Group>
            <Form.Group controlId="editRecipeRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                value={editRecipeValue.rating}
                onChange={(event) => handleFieldChange(event, "rating")}
              />
            </Form.Group>
            <Form.Group controlId="editRecipeBlurb">
              <Form.Label>Blurb</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editRecipeValue.blurb}
                onChange={(event) => handleFieldChange(event, "blurb")}
              />
            </Form.Group>
            <Form.Group controlId="editRecipeSteps">
              <Form.Label>Steps</Form.Label>
              {editRecipeValue.steps.map((step, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={step}
                  onChange={(event) => handleStepChange(event, index)}
                />
              ))}
              <Button
                variant="secondary"
                onClick={() =>
                  setEditRecipeValue((prevState) => ({
                    ...prevState,
                    steps: [...prevState.steps, ""],
                  }))
                }
              >
                Add Step
              </Button>
            </Form.Group>
            <Form.Group controlId="editRecipeIngredients">
              <Form.Label>Ingredients</Form.Label>
              {editRecipeValue.ingredients.map((ingredient, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={ingredient}
                  onChange={(event) => handleIngredientChange(event, index)}
                />
              ))}
              <Button
                variant="secondary"
                onClick={() =>
                  setEditRecipeValue((prevState) => ({
                    ...prevState,
                    ingredients: [...prevState.ingredients, ""],
                  }))
                }
              >
                Add Ingredient
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={saveEditedRecipe}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RecipeCard;
