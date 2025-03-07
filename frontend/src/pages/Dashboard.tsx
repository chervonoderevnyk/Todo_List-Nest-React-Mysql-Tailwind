import React from 'react';
import TaskLists from '../components/TaskLists';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Люби те, що бачиш!</h1>
      
      {/* Виводимо компонент TaskLists */}
      <TaskLists />
    </div>
  );
};

export default Dashboard;
