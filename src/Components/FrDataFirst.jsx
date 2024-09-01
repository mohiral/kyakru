import React, { useState, useEffect } from 'react';

const FrDataFirst = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [results, setResults] = useState([]);
    const API_URL = 'http://localhost:3002'; // Make sure this matches the backend API

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update the time every second

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/getData`);
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

    const formatDate = (date) => {
        const options = {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true, // This ensures 12-hour format with AM/PM
        };
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#fff] text-black py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-4">Welcome to SATTA Results</h1>
                    <p className="text-lg mb-6">Get the latest Satta results instantly. Stay updated with every draw!</p>
                    <button className="bg-[#4CAF50] text-[#fff] font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-[#38873a] transition duration-300">
                        View Today's Results
                    </button>
                </div>
            </section>

            {/* Today's Results */}
            <section className="container mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold text-center mb-8">{formatDate(currentTime)}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {results.map((result, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h3 className="text-xl font-semibold mb-2">{result.name}</h3>
                            <p className="text-5xl font-bold text-[#4CAF50] mb-2">{result.result}</p>
                            <p className="text-gray-600">{result.time}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default FrDataFirst;
