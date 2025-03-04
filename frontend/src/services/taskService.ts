import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/tasks";
// const API_URL = "http://localhost:3002/tasks";

export const getTasks = async (token: string, listId: number) => {
  const response = await axios.get(`${API_URL}?listId=${listId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTask = async (token: string, listId: number, title: string, description: string) => {
  const response = await axios.post(API_URL, { listId, title, description }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTask = async (token: string, id: number, updates: Partial<{ title: string; description: string; completed: boolean }>) => {
  await axios.put(`${API_URL}/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTask = async (token: string, id: number) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
