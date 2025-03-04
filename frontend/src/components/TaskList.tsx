import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function TaskList({ listId }: { listId: number }) {
  const authContext = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  useEffect(() => {
    if (authContext?.token) {
      getTasks(authContext.token, listId).then(setTasks).catch(console.error);
    }
  }, [authContext?.token, listId]);

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const task = await createTask(authContext!.token!, listId, newTask.title, newTask.description);
      setTasks([...tasks, task]);
      setNewTask({ title: "", description: "" });
    } catch (error) {
      console.error("Помилка створення завдання", error);
    }
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    try {
      await updateTask(authContext!.token!, id, updates);
      setTasks(tasks.map(task => (task.id === id ? { ...task, ...updates } : task)));
    } catch (error) {
      console.error("Помилка оновлення завдання", error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(authContext!.token!, id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Помилка видалення завдання", error);
    }
  };

  return (
    <div className="bg-gray-200 p-4 rounded shadow mt-4">
      <h2 className="text-xl font-semibold mb-2">Завдання</h2>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Назва завдання"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="border p-2 rounded mr-2 w-1/3"
        />
        <input
          type="text"
          placeholder="Опис"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="border p-2 rounded mr-2 w-1/3"
        />
        <button onClick={handleCreateTask} className="bg-blue-500 text-white px-4 py-2 rounded">
          Додати
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleUpdateTask(task.id, { completed: !task.completed })}
              className="mr-2"
            />
            <input
              type="text"
              value={task.title}
              onChange={(e) => handleUpdateTask(task.id, { title: e.target.value })}
              className="border p-2 rounded w-1/3"
            />
            <input
              type="text"
              value={task.description}
              onChange={(e) => handleUpdateTask(task.id, { description: e.target.value })}
              className="border p-2 rounded w-1/3"
            />
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Видалити
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
