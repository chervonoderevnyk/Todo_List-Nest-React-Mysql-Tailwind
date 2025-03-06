import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../services/taskService';

const TaskList = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskData = await getTasks();
        setTasks(taskData);
        setLoading(false);
      } catch (err) {
        setError('Не вдалося завантажити завдання');
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id)); // Оновлюємо список після видалення
      alert('Завдання успішно видалено');
    } catch (err) {
      alert('Не вдалося видалити завдання');
    }
  };

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold">Список Завдань</h2>
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p>{task.description}</p>
            <button 
              onClick={() => handleDelete(task.id)} 
              className="bg-red-500 text-white py-2 px-4 rounded-md mt-2"
            >
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
