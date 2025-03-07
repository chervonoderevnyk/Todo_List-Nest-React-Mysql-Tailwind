import React, { useEffect, useState } from 'react';
import { getTaskLists, TaskList, addMemberToTaskList } from '../services/taskListService';
import AddTaskButton from './AddTaskButton';
import AddTaskListButton from './AddTaskListButton';

const TaskLists = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTaskLists();
        setTaskLists(data.taskLists);
        setLoading(false);
      } catch (err) {
        setError('Не вдалося завантажити списки завдань');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddMember = async (taskListId: number) => {
    if (!email[taskListId]) return alert('Введіть email');

    try {
      await addMemberToTaskList(taskListId, email[taskListId]);

      setEmail(prev => ({ ...prev, [taskListId]: '' }));
      setTaskLists(prev => prev.map(tl => 
        tl.id === taskListId ? { ...tl, membersCount: tl.membersCount + 1 } : tl
      ));

      alert('Співучасника успішно додано');
    } catch (error) {
      alert('Не вдалося додати співучасника');
    }
  };

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Списки завдань</h2>
   
<AddTaskListButton 
  onTaskListAdded={(newTaskList: TaskList) => {
    setTaskLists(prev => [...prev, newTaskList]);
  }} 
/>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="mb-4">
          <p>Загальна кількість списків завдань: {taskLists.length}</p>
          <p>Завдань з учасниками: {taskLists.filter(tl => tl.membersCount > 0).length}</p>
          <p>Завдань без учасників: {taskLists.filter(tl => tl.membersCount === 0).length}</p>
        </div>

        <div className="space-y-4">
          {taskLists.map(taskList => (
            <div key={taskList.id} className="bg-gray-100 p-4 rounded-md">
              <h3 className="text-xl font-semibold">{taskList.name}</h3>
              <p>{taskList.description}</p>
              <p className="text-sm text-gray-500">Кількість учасників: {taskList.membersCount}</p>
              <p className="text-sm text-gray-500">Кількість завдань: {taskList.tasksCount}</p>

              <AddTaskButton taskListId={taskList.id} onTaskAdded={() => {
                setTaskLists(prev => prev.map(tl => tl.id === taskList.id ? { ...tl, tasksCount: tl.tasksCount + 1 } : tl));
              }} />

              <div className="mt-4">
                <input
                  type="email"
                  placeholder="Введіть email співучасника"
                  className="px-4 py-2 border border-gray-300 rounded-md"
                  value={email[taskList.id] || ''}
                  onChange={e => setEmail(prev => ({ ...prev, [taskList.id]: e.target.value }))}
                />
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md ml-2"
                  onClick={() => handleAddMember(taskList.id)}
                >
                  Додати співучасника
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskLists;
