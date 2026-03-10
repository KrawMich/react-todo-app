export default function TaskInput({ task, setTask, addTask }) {
  function handleSubmit(e) {
    e.preventDefault();

    const trimmedTask = task.trim();
    if (!trimmedTask) return;

    addTask(trimmedTask);
    setTask("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-col gap-2 sm:flex-row"
    >
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Nowe zadanie"
        className="w-full flex-1 rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 sm:w-auto"
      >
        Dodaj
      </button>
    </form>
  );
}