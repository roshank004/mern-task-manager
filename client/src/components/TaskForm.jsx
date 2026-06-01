const TaskForm = ({
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  createTask,
}) => {
  return (
    <form
      onSubmit={createTask}
      className="bg-white p-5 rounded-xl shadow-lg mb-8"
    >
      <div className="grid md:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="border p-3 rounded-lg"
        />

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
          className="border p-3 rounded-lg"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;