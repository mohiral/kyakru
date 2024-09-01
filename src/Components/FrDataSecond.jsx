import React, { useState, useEffect } from 'react';
import { MdArrowForward } from 'react-icons/md'; // Import the desired icon

const FrDataSecond = () => {
    const [results, setResults] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'; // Fallback URL

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/getDataa`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, [API_URL]);

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
                {results.length > 0 ? (
                    <ul className="space-y-4">
                        {results.map((result) => (
                            <li key={result._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <a href="/chart/2/2024" className="block text-gray-800 hover:text-blue-600 mb-4">
                                    <h3 className="text-2xl font-bold">{result.name}</h3>
                                </a>
                                <p className="text-xl mb-2">{result.time}</p>
                                <strong className="text-3xl flex items-center justify-center mb-4">
                                    {result.result1}
                                    <MdArrowForward className="mx-2 h-5 w-5" /> {/* Using the icon here */}
                                    {result.result2}
                                </strong>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results available.</p>
                )}
            </div>
        </div>
    );
};

export default FrDataSecond;
