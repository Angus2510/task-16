const chai = require('chai');
const expect = chai.expect;
const axios = require('axios');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('fetchRecipes', () => {
  let axiosGetStub;
  let consoleErrorStub;
  let setRecipesStub;

  beforeEach(() => {
    axiosGetStub = sinon.stub(axios, 'get');
    consoleErrorStub = sinon.stub(console, 'error');
    setRecipesStub = sinon.stub();
  });

  afterEach(() => {
    axiosGetStub.restore();
    consoleErrorStub.restore();
  });

  it('should fetch recipes and set the state', async () => {
    // Mock response data
    const responseData = { recipes: [/* array of recipe objects */] };
    // Mock the axios GET request to return the response data
    axiosGetStub.resolves({ data: responseData });

    // Call the fetchRecipes function
    await fetchRecipes(setRecipesStub);

    // Expect axios GET to be called with the correct URL
    expect(axios.get).to.have.been.calledWith('/getRecipe/getAll');

    // Expect setRecipesStub to be called with the response data
    expect(setRecipesStub).to.have.been.calledWith(responseData.recipes);

    // Expect console.error not to have been called
    expect(console.error).not.to.have.been.called;
  });

  it('should handle errors and log them to the console', async () => {
    // Mock the axios GET request to throw an error
    axiosGetStub.rejects(new Error('Network Error'));

    // Call the fetchRecipes function
    await fetchRecipes(setRecipesStub);

    // Expect axios GET to be called with the correct URL
    expect(axios.get).to.have.been.calledWith('/getRecipe/getAll');

    // Expect setRecipesStub not to have been called
    expect(setRecipesStub).not.to.have.been.called;

    // Expect console.error to have been called with the error message
    expect(console.error).to.have.been.calledWith('Error: Network Error');
  });
});
