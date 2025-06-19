import React, { useState } from 'react'

interface Cat {
  id: number
  name: string
  years_of_experience: number
  breed: string
  salary: number
}

interface CatListProps {
  cats: Cat[]
  onUpdate: (cat: Cat) => void
  onDelete: (id: number) => void
}

const CatList: React.FC<CatListProps> = ({ cats, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [salaryInput, setSalaryInput] = useState<number | string>('')

  const startEditing = (cat: Cat) => {
    setEditingId(cat.id)
    setSalaryInput(cat.salary)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setSalaryInput('')
  }

  const saveSalary = async () => {
    if (editingId === null) return
    try {
      const res = await fetch(`http://localhost:8000/cats/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salary: Number(salaryInput) }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Error updating salary')
      }
      const updatedCat: Cat = await res.json()
      onUpdate(updatedCat)
      cancelEditing()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const deleteCat = async (id: number) => {
    if (!confirm('Are you sure you want to delete this cat?')) return
    try {
      const res = await fetch(`http://localhost:8000/cats/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Error deleting cat')
      }
      onDelete(id)
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2">Name</th>
          <th className="border border-gray-300 p-2">Experience (years)</th>
          <th className="border border-gray-300 p-2">Breed</th>
          <th className="border border-gray-300 p-2">Salary</th>
          <th className="border border-gray-300 p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {cats.map((cat) => (
          <tr key={cat.id} className="text-center">
            <td className="border border-gray-300 p-2">{cat.name}</td>
            <td className="border border-gray-300 p-2">{cat.years_of_experience}</td>
            <td className="border border-gray-300 p-2">{cat.breed}</td>
            <td className="border border-gray-300 p-2">
              {editingId === cat.id ? (
                <input
                  type="number"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value === '' ? '' : Number(e.target.value))}
                  className="border p-1 w-20"
                />
              ) : (
                cat.salary.toFixed(2)
              )}
            </td>
            <td className="border border-gray-300 p-2 space-x-2">
              {editingId === cat.id ? (
                <>
                  <button
                    onClick={saveSalary}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEditing(cat)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCat(cat.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CatList