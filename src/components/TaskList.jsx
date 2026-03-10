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
}) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
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
          />
        ))}
      </ul>
    </SortableContext>
  );
}