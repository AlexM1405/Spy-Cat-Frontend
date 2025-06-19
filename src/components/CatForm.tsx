import { useState, FormEvent } from "react";

const validBreeds = [
  "Abyssinian", "Aegean", "American Bobtail", "American Curl", "American Shorthair",
  "American Wirehair", "Arabian Mau", "Australian Mist", "Balinese", "Bambino",
  "Bengal", "Birman", "Bombay", "British Longhair", "British Shorthair",
  "Burmese", "Burmilla", "California Spangled", "Chantilly-Tiffany", "Chartreux",
  "Chausie", "Cheetoh", "Colorpoint Shorthair", "Cornish Rex", "Cymric",
  "Cyprus", "Devon Rex", "Donskoy", "Dragon Li", "Egyptian Mau", "European Burmese",
  "Exotic Shorthair", "Havana Brown", "Himalayan", "Japanese Bobtail", "Javanese",
  "Khao Manee", "Korat", "Kurilian", "LaPerm", "Maine Coon", "Malayan",
  "Manx", "Munchkin", "Nebelung", "Norwegian Forest Cat", "Ocicat",
  "Oriental", "Persian", "Pixie-bob", "Ragamuffin", "Ragdoll",
  "Russian Blue", "Savannah", "Scottish Fold", "Selkirk Rex", "Siamese",
  "Siberian", "Singapura", "Snowshoe", "Somali", "Sphynx",
  "Tonkinese", "Toyger", "Turkish Angora", "Turkish Van", "York Chocolate"
];

interface Cat {
  id: number;
  name: string;
  years_of_experience: number;
  breed: string;
  salary: number;
}

interface CatFormProps {
  onAddCat: (cat: Cat) => void;
}

export default function CatForm({ onAddCat }: CatFormProps) {
  const [name, setName] = useState<string>("");
  const [years_of_experience, setYears] = useState<number | "">("");
  const [breed, setBreed] = useState<string>("");
  const [salary, setSalary] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: 0,
    description: "",
    years_of_experience: 0,
    salary: 0,
  });
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (
      years_of_experience === "" ||
      salary === "" ||
      breed === "" || 
      name.trim() === ""
    ) {
      setError("Please fill in all fields correctly");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/cats/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          years_of_experience,
          breed,
          salary,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Error creating cat");
      }
      const data: Cat = await res.json();
      onAddCat(data);
      setName("");
      setYears("");
      setBreed("");
      setSalary("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 mr-2"
      />

      <input
        type="number"
        placeholder="Years of Experience"
        value={years_of_experience}
        onChange={(e) =>
          setYears(e.target.value === "" ? "" : Number(e.target.value))
        }
        required
        className="border p-2 mr-2"
      />

      <select
        value={breed}
        onChange={(e) => setBreed(e.target.value)}
        required
        className="border p-2 mr-2"
      >
        <option value="" disabled>
          Select Breed
        </option>
        {validBreeds.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <input
        type="number"
        step="0.01"
        placeholder="Salary"
        value={salary}
        onChange={(e) =>
          setSalary(e.target.value === "" ? "" : Number(e.target.value))
        }
        required
        className="border p-2 mr-2"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Cat
      </button>
    </form>
  );
}