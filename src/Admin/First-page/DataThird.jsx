import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function DataThird() {
    const [entries, setEntries] = useState([]);
    const [name, setName] = useState('');
    const [place, setPlace] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [error, setError] = useState('');

    // Get API URL from environment variables
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'; // Fallback URL

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await fetch(`${API_URL}/getDataThird`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setEntries(data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchEntries();
    }, [API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateInput(name, place)) {
            try {
                if (editIndex !== null) {
                    const updatedEntry = { name, place };
                    const response = await fetch(`${API_URL}/updateDataThird/${entries[editIndex]._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedEntry),
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    const updatedEntries = entries.map((entry, index) =>
                        index === editIndex ? data : entry
                    );
                    setEntries(updatedEntries);
                    setEditIndex(null);
                } else {
                    const newEntry = { name, place };
                    const response = await fetch(`${API_URL}/addDataThird`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newEntry),
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setEntries([...entries, data]);
                }
                setName('');
                setPlace('');
                setError('');
            } catch (error) {
                setError('Error adding or updating data.');
                console.error('Error in handleSubmit:', error.message);
            }
        } else {
            setError('Please enter both name and place.');
        }
    };

    const validateInput = (name, place) => {
        return name.trim() !== '' && place.trim() !== '';
    };

    const handleEdit = (index) => {
        setName(entries[index].name);
        setPlace(entries[index].place);
        setEditIndex(index);
    };

    const handleDelete = async (index) => {
        try {
            const response = await fetch(`${API_URL}/deleteDataThird/${entries[index]._id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const updatedEntries = entries.filter((_, i) => i !== index);
            setEntries(updatedEntries);
            if (editIndex === index) {
                setEditIndex(null);
                setName('');
                setPlace('');
            }
        } catch (error) {
            console.error('Error deleting data:', error.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Data Third Panel</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Place</label>
                        <input
                            type="text"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter place"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        {editIndex !== null ? 'Update Entry' : 'Add Entry'}
                    </button>
                </form>

                <ul className="mt-6 space-y-4">
                    {entries.map((entry, index) => (
                        <li key={entry._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm">
                            <div>
                                <p className="font-semibold">{entry.name}</p>
                                <p>{entry.place}</p>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => handleEdit(index)} className="text-blue-500 hover:underline">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(index)} className="text-red-500 hover:underline">
                                    <FaTrash />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default DataThird;
