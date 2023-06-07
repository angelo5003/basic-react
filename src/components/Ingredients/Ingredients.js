import React, {useState, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState ([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  const addIngredient = async ingredient => {
    setIsLoading(true);
    const response = await fetch('https://react-hooks-52d62-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type' : 'application/json'}
    });
    const data = await response.json()
    setIsLoading(false);
    setIngredients(prevIngredients => [
          ...prevIngredients, 
          {id: data.name, ...ingredient}
        ]);
  };

  const removeIngredientHandler = async ingredientId => {
    setIsLoading(true);
    const response = await fetch(`https://react-hooks-52d62-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).catch(error => {
      setError(error.message);
      });
    if(response.ok){
      setIsLoading(false);
      setIngredients(prevIngredients => 
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
    }
    };
  
    const clearError = () => {
      setError(null);
      setIsLoading(false);
    };
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredient}
      loading={isLoading}/>

      <section>
        <Search  onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
