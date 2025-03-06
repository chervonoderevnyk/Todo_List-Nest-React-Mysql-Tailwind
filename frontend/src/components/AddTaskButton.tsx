import React, { useState } from 'react';
import AddTaskForm from './AddTaskForm';

const AddTaskButton = ({ taskListId }: { taskListId: number }) => {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  // Обробник для відкриття форми
  const handleOpenForm = () => {
    setIsFormVisible(true);
  };

  // Обробник для закриття форми
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
          Додати завдання
        </button>
      )}

      {isFormVisible && (
        <div className="mt-4">
          <AddTaskForm taskListId={taskListId} onClose={handleCloseForm} />
        </div>
      )}
    </div>
  );
};

export default AddTaskButton;
