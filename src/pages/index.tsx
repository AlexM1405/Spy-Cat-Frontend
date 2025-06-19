import "../styles/globals.css";
import { useState, useEffect } from "react";
import CatForm from "../components/CatForm";
import CatList from "../components/CatList";

interface Target {
  id: number;
  name: string;
  country: string;
  notes: string;
  is_completed: boolean;
}

interface Mission {
  id: number;
  is_completed: boolean;
  targets: Target[];
}

interface Cat {
  id: number;
  name: string;
  years_of_experience: number;
  breed: string;
  salary: number;
  mission?: Mission | null;
}

export default function Home() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/cats/");
      if (!res.ok) throw new Error("Failed to fetch cats");
      const data = await res.json();
      setCats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleAddCat = (newCat: Cat) => {
    setCats((prev) => [...prev, newCat]);
  };

  const handleUpdateCat = (updatedCat: Cat) => {
    setCats((prev) =>
      prev.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat))
    );
  };

  const handleDeleteCat = (id: number) => {
    setCats((prev) => prev.filter((cat) => cat.id !== id));
  };

  const markTargetCompleted = async (targetId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/targets/${targetId}/complete`, {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Error marking target as completed");
      }
      fetchCats();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const Missions = ({
    cats,
    onMarkTargetCompleted,
  }: {
    cats: Cat[];
    onMarkTargetCompleted: (targetId: number) => void;
  }) => {
    const missions = cats.filter((cat) => cat.mission);

    if (missions.length === 0)
      return <p className="text-white">No missions assigned yet.</p>;

    return (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">Missions Overview</h2>
        {missions.map((cat) => (
          <div
            key={cat.mission!.id}
            className="mb-6 p-4 bg-gray-700 rounded shadow text-white"
          >
            <h3 className="text-xl font-bold mb-2">{cat.name}'s Mission</h3>
            <p className="mb-2">
              Status: {cat.mission!.is_completed ? "Completed" : "In Progress"}
            </p>
            <ul className="list-disc list-inside">
              {cat.mission!.targets.map((target) => (
                <li
                  key={target.id}
                  className={target.is_completed ? "line-through opacity-60" : ""}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>{target.name}</strong> - {target.country}
                      <p className="italic text-sm">{target.notes}</p>
                    </div>
                    {!target.is_completed && (
                      <button
                        onClick={() => onMarkTargetCompleted(target.id)}
                        className="ml-4 bg-green-600 px-2 py-1 rounded text-white"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-8 text-white">Spy Cat Agency (SCA)</h1>
      {error && <p className="bg-red-600 text-white p-3 rounded mb-6">{error}</p>}

      <section className="mb-8 bg-gray-800 p-6 rounded shadow-md">
        <CatForm onAddCat={handleAddCat} />
      </section>

      <section className="bg-gray-800 p-6 rounded shadow-md">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <CatList cats={cats} onUpdate={handleUpdateCat} onDelete={handleDeleteCat} />
        )}
      </section>

      <section className="bg-gray-800 p-6 rounded shadow-md">
        <Missions cats={cats} onMarkTargetCompleted={markTargetCompleted} />
      </section>
    </main>
  );
}