import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

const exercises = [
  { id: "1", name: "Wrist Extensor Stretch", image: "/images/wrist_extensor.jpg" },
  { id: "2", name: "Wrist Flexor Stretch", image: "/images/wrist_flexor.jpg" },
  { id: "3", name: "Wrist Extension", image: "/images/wrist_extension.jpg" },
  { id: "4", name: "Wrist Flexion", image: "/images/wrist_flexion.jpg" },
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function loadData() {
  return JSON.parse(localStorage.getItem("exerciseData") || "{}");
}

function saveData(data) {
  localStorage.setItem("exerciseData", JSON.stringify(data));
}

function Home() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Daily Exercise Tracker</h1>
      <ul className="space-y-3">
        {exercises.map((ex) => (
          <li key={ex.id} className="border p-3 rounded shadow">
            <Link className="text-blue-600 font-medium" to={`/exercise/${ex.id}`}>
              {ex.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/calendar" className="block mt-6 text-green-600 underline text-center">
        View Calendar
      </Link>
    </div>
  );
}

function ExercisePage() {
  const { id } = useParams();
  const exercise = exercises.find((e) => e.id === id);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const data = loadData();
    const today = getToday();
    setCompleted(data[today]?.[id] || false);
  }, [id]);

  const toggle = () => {
    const data = loadData();
    const today = getToday();
    if (!data[today]) data[today] = {};
    data[today][id] = !completed;
    saveData(data);
    setCompleted(!completed);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-center">{exercise?.name}</h2>

      {exercise?.image && (
        <img
          src={exercise.image}
          alt={exercise.name}
          className="mt-4 rounded-lg shadow w-full"
        />
      )}

      <button
        onClick={toggle}
        className={`mt-6 w-full px-4 py-3 rounded text-white text-lg ${
          completed ? "bg-green-500" : "bg-gray-400"
        }`}>
        {completed ? "Completed ✔" : "Mark Complete"}
      </button>

      <div className="mt-4 text-center">
        <Link to="/" className="underline">Back</Link>
      </div>
    </div>
  );
}

function Calendar() {
  const data = loadData();
  const days = Object.keys(data).sort().reverse();

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-center">Calendar</h2>
      <ul className="mt-4 space-y-2">
        {days.map((day) => (
          <li key={day} className="border p-3 rounded shadow">
            <strong>{day}</strong>
            <ul className="mt-2 list-disc ml-5">
              {Object.entries(data[day]).map(([id, val]) => (
                val && <li key={id}>{exercises.find(e => e.id === id)?.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Link to="/" className="underline mt-4 block text-center">Back</Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:id" element={<ExercisePage />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Router>
  );
}
