import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaArrowRight } from 'react-icons/fa';

const DataSecond = () => {
    const [time, setTime] = useState('');
    const [name, setName] = useState('');
    const [result1, setResult1] = useState('');
    const [result2, setResult2] = useState('');
    const [dataList, setDataList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [error, setError] = useState('');

    // Get API URL from environment variables
    // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'; // Fallback URL
    const API_URL = import.meta.env.VITE_API_URL || 'https://satta-3.onrender.com/'; // Fallback URL
    

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await fetch(`${API_URL}/getDataa`);
                const response = await fetch('https://satta-3.onrender.com/getDataa');
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
                setError('Failed to fetch data');
            }
        };

        fetchData();
    }, [API_URL]);

    // Handle form submission for adding or updating data
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newData = { time, name, result1, result2 };

        try {
            const endpoint = editIndex !== null
                ? `${API_URL}/updateDataa/${dataList[editIndex]._id}`
                : `${API_URL}/addDataa`;

            const method = editIndex !== null ? 'PUT' : 'POST';
            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
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
            setResult1('');
            setResult2('');
        } catch (error) {
            setError('Error adding/updating data: ' + error.message);
        }
    };

    // Handle editing a data entry
    const handleEdit = (index) => {
        const dataToEdit = dataList[index];
        setTime(dataToEdit.time);
        setName(dataToEdit.name);
        setResult1(dataToEdit.result1);
        setResult2(dataToEdit.result2);
        setEditIndex(index);
    };

    // Handle deleting a data entry
    const handleDelete = async (index) => {
        const dataToDelete = dataList[index];
        try {
            const response = await fetch(`${API_URL}/deleteDataa/${dataToDelete._id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const updatedDataList = dataList.filter((_, i) => i !== index);
            setDataList(updatedDataList);
            if (editIndex === index) {
                // Clear form if the deleted entry was being edited
                setEditIndex(null);
                setTime('');
                setName('');
                setResult1('');
                setResult2('');
            }
        } catch (error) {
            setError('Error deleting data: ' + error.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Time</label>
                        <input
                            type="text"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
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
                            className="w-full px-4 py-2 border rounded-md"
                            placeholder="Enter name"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-1/2">
                            <label className="block text-gray-700">Result 1</label>
                            <input
                                type="text"
                                value={result1}
                                onChange={(e) => setResult1(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md"
                                placeholder="Enter first result"
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700">Result 2</label>
                            <input
                                type="text"
                                value={result2}
                                onChange={(e) => setResult2(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md"
                                placeholder="Enter second result"
                                required
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        {editIndex !== null ? 'Update Entry' : 'Submit'}
                    </button>
                </form>
            </div>

            {dataList.length > 0 && (
                <div className="mt-8">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                        <thead>
                            <tr className="border-b text-center">
                                <th className="px-4 py-2">Time</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Results</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataList.map((data, index) => (
                                <tr key={data._id} className="border-b text-center">
                                    <td className="px-4 py-2">{data.time}</td>
                                    <td className="px-4 py-2">{data.name}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-center">
                                            <span>{data.result1}</span>
                                            <FaArrowRight size="20px" className="mx-2" />
                                            <span>{data.result2}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 flex space-x-2 justify-center">
                                        <button
                                            onClick={() => handleEdit(index)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="text-red-500 hover:text-red-700"
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
        </div>
    );
};

export default DataSecond;
