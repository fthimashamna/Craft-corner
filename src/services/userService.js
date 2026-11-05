import axios from "axios";

const API_URL = "http://localhost:3001/users";

export const registerUser = async (userData) => {
  const users = await getUsers();

  const normalizedEmail = userData.email.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.email.trim().toLowerCase() === normalizedEmail
  );

  if (existingUser) {
    throw new Error("This email is already registered.");
  }

  const response = await axios.post(API_URL, {
    ...userData,
    email: normalizedEmail,
    status: "active",
  });

  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};