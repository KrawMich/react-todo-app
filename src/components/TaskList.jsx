import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  deleteTask,
  toggleTask,
  editTask,
  isDark
}) {
  if (tasks.length === 0) {
    return (
      <div
        className={`rounded-lg border border-dashed px-4 py-6 text-center text-sm ${
          isDark
            ? "bg-gray-700 border-gray-600 text-gray-300"
            : "bg-gray-50 border-gray-300 text-gray-500"
        }`}
      >
        Brak zadań do wyświetlenia.
      </div>
    );
  }

  return (
    <SortableContext
      items={tasks.map((task) => task.id)}
      strategy={verticalListSortingStrategy}
    >
      <ul className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleTask={toggleTask}
            editTask={editTask}
            isDark={isDark}
          />
        ))}
      </ul>
    </SortableContext>
  );
}