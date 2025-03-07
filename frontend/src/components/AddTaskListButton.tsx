import React, { useState } from 'react';
import AddTaskListForm from './AddTaskListForm';
import { TaskList } from '../services/taskListService';

interface AddTaskListButtonProps {
    onTaskListAdded: (newTaskList: TaskList) => void;
  }
  
  const AddTaskListButton: React.FC<AddTaskListButtonProps> = ({ onTaskListAdded }) => {
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const handleOpenForm = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  return (  
    <div>
      {!isFormVisible && (
        <button
          onClick={handleOpenForm}
          className="bg-green-500 text-white py-2 px-4 rounded-md"
        >
          Додати список завдань
        </button>
      )}

      {isFormVisible && (
        <div className="mt-4">
            <AddTaskListForm onClose={handleCloseForm} onTaskListAdded={onTaskListAdded} />
        </div>
      )}
    </div>
  );
}

export default AddTaskListButton;