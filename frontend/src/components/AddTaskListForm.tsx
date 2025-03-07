import React, { useState } from 'react';
import { createTaskList, TaskList } from '../services/taskListService';

interface AddTaskListFormProps {
  onClose: () => void;
  onTaskListAdded: (newTaskList: TaskList) => void;
}

const AddTaskListForm: React.FC<AddTaskListFormProps> = ({ onClose, onTaskListAdded }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newTaskList = await createTaskList({ name, description });
      setName('');
      setDescription('');
      alert('Новий список завдань успішно додано');
      onTaskListAdded(newTaskList);
      onClose();
    } catch (err) {
      setError('Не вдалося створити список завдань');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Назва списку завдань</label>
        <input
          type="text"
          className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Опис списку завдань</label>
        <textarea
          className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex space-x-4">
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md" disabled={loading}>
          {loading ? 'Завантаження...' : 'Додати список завдань'}
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
  )
};

export default AddTaskListForm;