import axios from "axios";

const API_URL = "http://localhost:3001";

// Get a user's cart from the database
export const getUserCart = async (userId) => {
  const response = await axios.get(`${API_URL}/carts`, {
    params: {
      userId: userId,
    },
  });

  return response.data;
};

// Save a new user's cart
export const saveUserCart = async (cartData) => {
  const response = await axios.post(`${API_URL}/carts`, cartData);

  return response.data;
};

// Update an existing user's cart
export const updateUserCart = async (cartId, cartData) => {
  const response = await axios.put(
    `${API_URL}/carts/${cartId}`,
    cartData
  );

  return response.data;
};

// Delete a user's cart
export const deleteUserCart = async (cartId) => {
  const response = await axios.delete(`${API_URL}/carts/${cartId}`);

  return response.data;
};