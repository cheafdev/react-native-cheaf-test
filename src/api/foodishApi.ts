/**
 * Service for integrating with TheMealDB API to fetch real meal images
 * API Documentation: https://www.themealdb.com/api.php
 */

const THEMEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

interface MealResponse {
  meals: Meal[] | null;
}

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
}

/**
 * Maps snack categories to TheMealDB categories and ingredients
 */
const CATEGORY_MAPPING: Record<string, string[]> = {
  'Chips': ['Starter', 'chicken_breast'], // Use appetizers or chicken dishes
  'Cookies': ['Dessert'], // Use dessert category
  'Candy': ['Dessert'], // Use dessert category
  'Drinks': ['Dessert'], // Use dessert as fallback
  'Healthy': ['Vegetarian', 'Vegan'], // Use vegetarian/vegan categories
  'Baked Goods': ['Dessert', 'Breakfast'], // Use dessert or breakfast
  'Default': ['Dessert', 'Chicken', 'Pasta'] // Default categories
};

/**
 * Curated list of high-quality meal images from TheMealDB as fallbacks
 */
const CURATED_MEAL_IMAGES = [
  'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg', // Pizza
  'https://www.themealdb.com/images/media/meals/1550441882.jpg', // Burger
  'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg', // Pasta
  'https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg', // Dessert
  'https://www.themealdb.com/images/media/meals/k29viq1585565980.jpg', // Salad
  'https://www.themealdb.com/images/media/meals/1548772327.jpg', // Healthy
  'https://www.themealdb.com/images/media/meals/ryppsv1511815505.jpg', // Baked Goods
  'https://www.themealdb.com/images/media/meals/txsupu1511815755.jpg', // Snacks
  'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg', // Chicken
  'https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg', // Fish
];

export class TheMealDBService {
  /**
   * Get a random meal image from TheMealDB
   */
  static async getRandomImage(): Promise<string> {
    try {
      const response = await fetch(`${THEMEALDB_BASE_URL}/random.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MealResponse = await response.json();
      
      if (data.meals && data.meals.length > 0) {
        return data.meals[0].strMealThumb;
      }
      throw new Error('No meals found');
    } catch (error) {
      console.warn('Failed to fetch random meal from TheMealDB, using curated fallback:', error);
      // Return a random curated image as fallback
      const randomIndex = Math.floor(Math.random() * CURATED_MEAL_IMAGES.length);
      return CURATED_MEAL_IMAGES[randomIndex];
    }
  }

  /**
   * Get a meal image from a specific category
   */
  static async getImageByCategory(category: string): Promise<string> {
    try {
      const response = await fetch(`${THEMEALDB_BASE_URL}/filter.php?c=${category}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MealResponse = await response.json();
      
      if (data.meals && data.meals.length > 0) {
        // Get a random meal from the category
        const randomIndex = Math.floor(Math.random() * data.meals.length);
        return data.meals[randomIndex].strMealThumb;
      }
      throw new Error(`No meals found for category: ${category}`);
    } catch (error) {
      console.warn(`Failed to fetch meal from category ${category}, using fallback:`, error);
      // Fallback to random image
      return this.getRandomImage();
    }
  }

  /**
   * Get multiple random meal images
   */
  static async getMultipleImages(count: number = 3): Promise<string[]> {
    try {
      const images: string[] = [];
      
      // Fetch multiple random meals
      for (let i = 0; i < count; i++) {
        const image = await this.getRandomImage();
        images.push(image);
        // Small delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      return images;
    } catch (error) {
      console.warn('Failed to fetch multiple meals from TheMealDB, using curated fallbacks:', error);
      // Return random selection from curated images
      const shuffled = [...CURATED_MEAL_IMAGES].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
  }

  /**
   * Get an appropriate meal image for a snack category
   */
  static async getImageForSnackCategory(snackCategory: string): Promise<string> {
    const mappedCategories = CATEGORY_MAPPING[snackCategory] || CATEGORY_MAPPING['Default'];
    
    // Try each mapped category until one works
    for (const category of mappedCategories) {
      try {
        const image = await this.getImageByCategory(category);
        return image;
      } catch (error) {
        console.warn(`Failed to get meal from category ${category}:`, error);
        continue;
      }
    }
    
    // If all categories fail, try random
    return this.getRandomImage();
  }

  /**
   * Preload meal images for better performance
   */
  static async preloadImagesForSnacks(snacks: Array<{ id: string; category: string }>): Promise<Record<string, string>> {
    const imageMap: Record<string, string> = {};

    // Process snacks sequentially to avoid overwhelming the API
    for (let i = 0; i < snacks.length; i++) {
      const snack = snacks[i];
      try {
        const image = await this.getImageForSnackCategory(snack.category);
        imageMap[snack.id] = image;
        
        // Small delay between requests to be respectful to the API
        if (i < snacks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.warn(`Failed to get image for snack ${snack.id}:`, error);
        // Fallback to curated image based on index
        const fallbackIndex = i % CURATED_MEAL_IMAGES.length;
        imageMap[snack.id] = CURATED_MEAL_IMAGES[fallbackIndex];
      }
    }

    return imageMap;
  }
}
