import React, { useState } from 'react';
import { createTask } from '../services/taskService';

const AddTaskForm = ({ taskListId, onClose, onTaskAdded }: { 
  taskListId: number, 
  onClose: () => void,
  onTaskAdded: () => void
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTask({ title, description, taskListId });
      setTitle('');
      setDescription('');
      alert('Завдання успішно додано');
      onTaskAdded(); // Оновлюємо кількість завдань у TaskLists
      onClose(); // Закриваємо форму після успішного додавання завдання
    } catch (err) {
      setError('Не вдалося додати завдання');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Назва завдання</label>
        <input 
          type="text" 
          className="mt-1 px-4 py-2 border border-gray-300 rounded-md" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Опис завдання</label>
        <textarea 
          className="mt-1 px-4 py-2 border border-gray-300 rounded-md" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
      </div>

      <div className="flex space-x-4">
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md" disabled={loading}>
          {loading ? 'Завантаження...' : 'Додати завдання'}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="bg-red-500 text-white py-2 px-4 rounded-md"
        >
          Скасувати
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
};

export default AddTaskForm;
