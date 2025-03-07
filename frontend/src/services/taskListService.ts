import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/task-lists";

export interface TaskList {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  members: { id: number }[];
  tasks: { id: number }[];
  membersCount: number;
  tasksCount: number;
}

export const getTaskLists = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching task lists:', error);
    throw error;
  }
};

export const addMemberToTaskList = async (taskListId: number, email: string) => {
  try {
    const response = await axios.post(`${API_URL}/${taskListId}/members`, { email });
    return response.data;
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
};

export const createTaskList = async (taskListData: {name: string, description: string}) => {
  try {
    const response = await axios.post(API_URL, taskListData);
    return response.data;
  } catch (error) {
    console.error('Error creating taskList:', error);
    throw error;
  }
};

export const fetchTaskListById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const deleteTaskList = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};
