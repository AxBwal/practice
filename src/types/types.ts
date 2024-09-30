export type Category = {
    idCategory: string;
    strCategory: string;
  };
  
  export type Meal = {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
  };
  
  export type MealDetails = {
    idMeal: string;
    strMeal: string;
    strInstructions: string;
    strMealThumb: string;
    [key: string]: string;
  };

 
  
  