import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getTodoLists, createTodoList, updateTodoList, deleteTodoList } from "../services/todoListService";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [lists, setLists] = useState<{ id: number; name: string }[]>([]);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    if (authContext?.token) {
      getTodoLists(authContext.token).then(setLists).catch(console.error);
    }
  }, [authContext?.token]);

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    try {
      const newList = await createTodoList(authContext!.token!, newListName);
      setLists([...lists, newList]);
      setNewListName("");
    } catch (error) {
      console.error("Помилка створення списку", error);
    }
  };

  const handleUpdateList = async (id: number, name: string) => {
    try {
      await updateTodoList(authContext!.token!, id, name);
      setLists(lists.map(list => (list.id === id ? { ...list, name } : list)));
    } catch (error) {
      console.error("Помилка оновлення списку", error);
    }
  };

  const handleDeleteList = async (id: number) => {
    try {
      await deleteTodoList(authContext!.token!, id);
      setLists(lists.filter(list => list.id !== id));
    } catch (error) {
      console.error("Помилка видалення списку", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Мої списки завдань</h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Назва нового списку"
          className="border rounded p-2 mr-2"
        />
        <button onClick={handleCreateList} className="bg-blue-500 text-white px-4 py-2 rounded">
          Додати
        </button>
      </div>

      <ul className="w-full max-w-md">
  {lists.map((list) => (
    <li key={list.id} className="bg-white p-4 mb-2 rounded shadow">
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={list.name}
          onChange={(e) => handleUpdateList(list.id, e.target.value)}
          className="border p-2 rounded w-2/3"
        />
        <button
          onClick={() => handleDeleteList(list.id)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Видалити
        </button>
      </div>
      <TaskList listId={list.id} />
    </li>
  ))}
</ul>


      <button
        onClick={() => {
          authContext?.logout();
          navigate("/login");
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Вийти
      </button>
    </div>
  );
}
