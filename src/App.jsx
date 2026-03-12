import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import useLocalStorage from "./hooks/useLocalStorage";

export default function App() {
  const [filter, setFilter] = useState("all");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const allTasksCompleted = tasks.length > 0 && tasks.every((task) => task.done);
  const hasCompletedTasks = tasks.some((task) => task.done);
  const hasAnyTasks = tasks.length > 0;
  const isDark = theme === "dark";

  function addTask(text) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setTasks((prevTasks) => [
      ...prevTasks,
      {
        id: crypto.randomUUID(),
        text: trimmedText,
        done: false,
      },
    ]);
  }

  function deleteTask(id) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  function editTask(id, newText) {
    const trimmedText = newText.trim();
    if (!trimmedText) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: trimmedText } : task
      )
    );
  }

  function toggleTask(id) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function toggleAllTasks() {
    setTasks((prevTasks) => {
      const shouldCompleteAll = prevTasks.some((task) => !task.done);

      return prevTasks.map((task) => ({
        ...task,
        done: shouldCompleteAll,
      }));
    });
  }

  function clearCompleted() {
    const confirmDelete = window.confirm("Usunąć wszystkie ukończone zadania?");

    if (confirmDelete) {
      setTasks((prevTasks) => prevTasks.filter((task) => !task.done));
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    setTasks((prevTasks) => {
      const oldIndex = prevTasks.findIndex((task) => task.id === active.id);
      const newIndex = prevTasks.findIndex((task) => task.id === over.id);

      return arrayMove(prevTasks, oldIndex, newIndex);
    });
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "done") return task.done;
    return true;
  });

  const doneTasks = tasks.filter((t) => t.done).length;

  function toggleTheme() {
  setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
}

  return (
    <div
      className={`min-h-screen flex justify-center px-4 py-10 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-xl p-5 shadow-lg sm:p-6 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h1
          className={`mb-5 text-center text-2xl font-semibold ${
          isDark ? "text-gray-300" : "text-gray-800"
          }`}
        >
          Todo App
        </h1>

        <div className="mb-4 flex justify-end">
          <button
            onClick={toggleTheme}
            className={` rounded px-3 py-1 text-sm ${isDark ? "bg-gray-600" : "bg-gray-200"}`}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <TaskInput task={task} setTask={setTask} addTask={addTask} />

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={
              "rounded px-3 py-1 text-sm " +
              (filter === "all" ? "bg-blue-500 text-white" : `${isDark ? "bg-gray-600" : "bg-gray-200"}`)
            }
          >
            Wszystkie
          </button>

          <button
            onClick={() => setFilter("active")}
            className={
              "rounded px-3 py-1 text-sm " +
              (filter === "active" ? "bg-blue-500 text-white" : `${isDark ? "bg-gray-600" : "bg-gray-200"}`)
            }
          >
            Aktywne
          </button>

          <button
            onClick={() => setFilter("done")}
            className={
              "rounded px-3 py-1 text-sm " +
              (filter === "done" ? "bg-blue-500 text-white" : `${isDark ? "bg-gray-600" : "bg-gray-200"}`)
            }
          >
            Ukończone
          </button>
        </div>

        {hasAnyTasks && (
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={toggleAllTasks}
              className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
            >
              {allTasksCompleted ? "Odznacz wszystkie" : "Oznacz wszystkie"}
            </button>

            {hasCompletedTasks && (
              <button
                onClick={clearCompleted}
                className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
              >
                Usuń ukończone
              </button>
            )}
          </div>
        )}

        {filter !== "all" && (
          <p className="mb-3 text-sm text-orange-600">
            Przeciąganie działa tylko w widoku „Wszystkie”.
          </p>
        )}

        {filter === "all" ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <TaskList
              tasks={filteredTasks}
              deleteTask={deleteTask}
              toggleTask={toggleTask}
              editTask={editTask}
              isDark={isDark}
            />
          </DndContext>
        ) : (
          <TaskList
            tasks={filteredTasks}
            deleteTask={deleteTask}
            toggleTask={toggleTask}
            editTask={editTask}
            isDark={isDark}
          />
        )}

        <p className="mt-4 text-sm text-gray-500">
          Wszystkie: {tasks.length} <br />
          Ukończone: {doneTasks}
        </p>
      </div>
    </div>
  );
}