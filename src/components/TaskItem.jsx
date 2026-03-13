import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

export default function TaskItem({ task, deleteTask, toggleTask, editTask, isDark }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditText(task.text);
  }, [task.text]);

  function handleSave() {
    const trimmedText = editText.trim();

    if (!trimmedText) {
      setEditText(task.text);
      setIsEditing(false);
      return;
    }

    editTask(task.id, trimmedText);
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
    setEditText(task.text);
  }

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      className={`my-2 flex items-center gap-2 rounded-lg border px-2 py-2 shadow-sm ${
      isDark ? "bg-gray-700" : "bg-white"
      } ${isDragging ? "opacity-60" : ""}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      {!isEditing && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="shrink-0 cursor-grab rounded px-2 py-1 text-gray-500 active:cursor-grabbing"
          aria-label="Drag task"
          title="Drag task"
        >
          ☰
        </button>
      )}

      <input
        className="shrink-0"
        type="checkbox"
        checked={task.done}
        onChange={() => toggleTask(task.id)}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          className="min-w-0 flex-1 rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
        />
      ) : (
        <span
          className={`min-w-0 flex-1 break-words text-sm ${
            task.done
              ? isDark
                ? "text-gray-500 line-through"
                : "text-gray-400 line-through"
              : isDark
              ? "text-gray-200"
              : "text-gray-800"
          }`}
        >
          {task.text}
        </span>
      )}

      <div className="flex shrink-0 gap-2">
        <button
          className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
          onClick={() => deleteTask(task.id)}
        >
          Delete
        </button>

        {!isEditing ? (
          <button
            className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        ) : (
          <button
            className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
            onClick={handleSave}
          >
            Save
          </button>
        )}
      </div>
    </motion.li>
  );
}