import React from "react";

// Array of food image URLs
const foodImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836", // Burger
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",     // Pizza
  "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg", // Sweet Dessert
  "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",  // Pasta
  "https://images.unsplash.com/photo-1604152135912-04a56f4be870",  // Biryani
  "https://images.unsplash.com/photo-1512058564366-c9e5c945fdff",  // Ice Cream
  "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7",  // Salad
  "https://images.unsplash.com/photo-1572448862529-2a61f77a0e4e",  // Barbeque
  "https://images.unsplash.com/photo-1576866209830-5bfeaf1180a6",  // Pancakes
  "https://images.unsplash.com/photo-1506084868230-bb9d95c24759",  // Sushi
];

// Function to get a random set of images for the carousel
export const getRandomImages = (num) => {
  const shuffled = [...foodImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};