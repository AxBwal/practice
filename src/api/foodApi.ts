import axios from 'axios';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

export const getCategories = async () => {
  const response = await axios.get(`${BASE_URL}categories.php`);
  return response.data.categories;
};

export const getMealsByCategory = async (category: string) => {
  const response = await axios.get(`${BASE_URL}filter.php?c=${category}`);
  return response.data.meals;
};

export const getMealDetails = async (mealId: string) => {
  const response = await axios.get(`${BASE_URL}lookup.php?i=${mealId}`);
  return response.data.meals[0];
};
