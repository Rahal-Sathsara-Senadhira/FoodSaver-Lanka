// src/api/adapters/client.js
import axios from 'axios'

// Create axios instance with baseURL from Vite env
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // set to true if your API uses cookies
})

// Optional: intercept responses
client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error)
    throw error
  }
)

export default client
