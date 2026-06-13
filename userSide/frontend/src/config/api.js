/** Backend API root — override in .env with VITE_API_BASE_URL */
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
console.log("API_BASE =", API_BASE);