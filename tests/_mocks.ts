import { Snack } from "../src/domain/models";

export const MOCK_SNACKS: Snack[] = [
    {
      "id": "1",
      "name": "Cosmic Crunch Tortilla Chips",
      "price": 3.49,
      "description": "Zesty lime-flavored chips that are out of this world.",
      "category": "Chips",
      "imageUrl": "https://placehold.co/600x400/2D3748/E2E8F0?text=Cosmic+Crunch",
      "inStock": true,
      "nutritionFacts": { "calories": 160, "fat": 9, "carbs": 18, "protein": 2 }
    },
    {
      "id": "2",
      "name": "Chewy Chocolate Nova Cookies",
      "price": 2.99,
      "description": "Soft-baked cookies with explosive chocolate chunks.",
      "category": "Cookies",
      "imageUrl": "https://placehold.co/600x400/4A5568/E2E8F0?text=Nova+Cookies",
      "inStock": true,
      "nutritionFacts": { "calories": 210, "fat": 11, "carbs": 26, "protein": 3 }
    },
];
