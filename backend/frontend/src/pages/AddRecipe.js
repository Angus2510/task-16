import React, { useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import '../App.css';

function AddRecipe() {
  const [recipe, setRecipe] = useState({
    title: "",
    time: "",
    rating: 0,
    blurb: "",
    steps: [""],
    ingredients: [""],
    approved: false,
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({ ...prevRecipe, [name]: value }));
  };

  const handleStepChange = (e, index) => {
    const { value } = e.target;
    setRecipe((prevRecipe) => {
      const updatedSteps = [...prevRecipe.steps];
      updatedSteps[index] = value;
      return { ...prevRecipe, steps: updatedSteps };
    });
  };

  const handleIngredientChange = (e, index) => {
    const { value } = e.target;
    setRecipe((prevRecipe) => {
      const updatedIngredients = [...prevRecipe.ingredients];
      updatedIngredients[index] = value;
      return { ...prevRecipe, ingredients: updatedIngredients };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(sessionStorage.getItem("user"));

      const config = {
        headers: {
          authorization: user.token
        }
      }
    try {    

      if (recipe.title.trim() !== "") {
        const newRecipe = { value: recipe };
        await axios.post("addRecipe/add", newRecipe, config);
        console.log("Recipe added successfully");
        // Optionally, you can redirect or show a success message here
      }
    } catch (error) {
      console.error('An error occurred while adding the recipe:', error);
      // Handle error response
      // Show an error message to the user
    }
  };

  const handleAddStep = () => {
    setRecipe((prevRecipe) => ({ ...prevRecipe, steps: [...prevRecipe.steps, ""] }));
  };

  const handleAddIngredient = () => {
    setRecipe((prevRecipe) => ({ ...prevRecipe, ingredients: [...prevRecipe.ingredients, ""] }));
  };

  return (
    <div className="addRecipes">
      <h1>Create Recipe</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={recipe.title}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Time:
          <input
            type="text"
            name="time"
            value={recipe.time}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Rating:
          <input
            type="number"
            name="rating"
            value={recipe.rating}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Blurb:
          <input
            type="text"
            name="blurb"
            value={recipe.blurb}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={recipe.type}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Steps:
          {recipe.steps.map((step, index) => (
            <input
              key={index}
              type="text"
              value={step}
              onChange={(e) => handleStepChange(e, index)}
            />
          ))}
          <Button
            type="button"
            variant="success"
            size="sm"
            onClick={handleAddStep}
          >
            Add Step
          </Button>
        </label>
        <br />
        <label>
          Ingredients:
          {recipe.ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(e, index)}
            />
          ))}
          <Button
            type="button"
            variant="success"
            size="sm"
            onClick={handleAddIngredient}
          >
            Add Ingredient
          </Button>
        </label>
        <br />
        <Button type="submit" variant="success" size="sm">
          Create Recipe
        </Button>
      </form>
    </div>
  );
}

export default AddRecipe;
