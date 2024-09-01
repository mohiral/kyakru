import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DataFirst = () => {
    const [time, setTime] = useState('');
    const [name, setName] = useState('');
    const [result, setResult] = useState('');
    const [dataList, setDataList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    // Get API URL from environment variables
    // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'; // Fallback URL
    const API_URL = import.meta.env.VITE_API_URL || 'https://satta-3.onrender.com/'; // Fallback URL

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://satta-3.onrender.com/getData');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const contentType = response.headers.get('Content-Type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Invalid content type');
                }
                const data = await response.json();
                setDataList(data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, [API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newData = { time, name, result };

        try {
            const endpoint = editIndex !== null
                ? `${API_URL}/updateData/${dataList[editIndex]._id}`
                : `${API_URL}/addData`;

            const method = editIndex !== null ? 'PUT' : 'POST';
            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (editIndex !== null) {
                const updatedDataList = dataList.map((data, index) =>
                    index === editIndex ? result : data
                );
                setDataList(updatedDataList);
                setEditIndex(null);
            } else {
                setDataList([...dataList, result]);
            }

            setTime('');
            setName('');
            setResult('');
        } catch (error) {
            console.error('Error adding/updating data:', error.message);
        }
    };

    const handleEdit = (index) => {
        const dataToEdit = dataList[index];
        setTime(dataToEdit.time);
        setName(dataToEdit.name);
        setResult(dataToEdit.result);
        setEditIndex(index);
    };

    const handleDelete = async (index) => {
        const dataToDelete = dataList[index];
        try {
            const response = await fetch(`${API_URL}/deleteData/${dataToDelete._id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const updatedDataList = dataList.filter((_, i) => i !== index);
            setDataList(updatedDataList);
            if (editIndex === index) {
                setEditIndex(null);
                setTime('');
                setName('');
                setResult('');
            }
        } catch (error) {
            console.error('Error deleting data:', error.message);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            {dataList.length > 0 && (
                <div className="w-full max-w-4xl mt-16">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="w-1/4 px-4 py-2">Time</th>
                                <th className="w-1/4 px-4 py-2">Name</th>
                                <th className="w-1/4 px-4 py-2">Result</th>
                                <th className="w-1/4 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataList.map((data, index) => (
                                <tr key={index} className="border-t text-center">
                                    <td className="px-4 py-2">{data.time}</td>
                                    <td className="px-4 py-2">{data.name}</td>
                                    <td className="px-4 py-2">{data.result}</td>
                                    <td className="px-4 py-2 flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(index)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mt-16">
                <h2 className="text-2xl font-bold text-center mb-6">Admin Panel</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Time</label>
                        <input
                            type="text"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter time"
                            required
                        />
                    </div>
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
                        <label className="block text-gray-700">Result</label>
                        <input
                            type="text"
                            value={result}
                            onChange={(e) => setResult(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter result"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        {editIndex !== null ? 'Update' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DataFirst;
