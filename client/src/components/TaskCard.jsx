const TaskCard = ({
  task,
  completeTask,
  deleteTask,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition">
      <h2 className="text-xl font-bold mb-2">
        {task.title}
      </h2>

      <p className="text-gray-600 mb-3">
        {task.description}
      </p>

      <div className="mb-2">
        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${
            task.priority === "High"
              ? "bg-red-500"
              : task.priority === "Medium"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="mb-4">
        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${
            task.completed
              ? "bg-green-600"
              : "bg-orange-500"
          }`}
        >
          {task.completed
            ? "Completed"
            : "Pending"}
        </span>
      </div>

      <div className="flex gap-2">
        {!task.completed && (
          <button
            onClick={() => completeTask(task)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Complete
          </button>
        )}

        <button
          onClick={() => deleteTask(task._id)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;