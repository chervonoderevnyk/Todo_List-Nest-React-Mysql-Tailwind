import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/task-lists";
// const API_URL = "http://localhost:3002/task-lists";

export const getTodoLists = async (token: string) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTodoList = async (token: string, name: string) => {
  const response = await axios.post(API_URL, { name }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTodoList = async (token: string, id: number, name: string) => {
  await axios.put(`${API_URL}/${id}`, { name }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTodoList = async (token: string, id: number) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
