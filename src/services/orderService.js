import axios from "axios";

export const createOrder = async(orderDate)=>{
    const response = await axios.post("http://localhost:3001/orders",orderDate);
    return response.data;
};

export const getUserOrders = async (userId) => {
  const response = await axios.get(
    `http://localhost:3001/orders?userId=${userId}`
  );
  return response.data;
};

