import React from 'react';

function ResultDisplay({ time, name, result }) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-gray-700 mb-4">Time: {time}</div>
                <div className="text-gray-700 mb-4">Name: {name}</div>
                <div className="text-gray-700 text-2xl font-bold">{result}</div>
            </div>
        </div>
    );
}

export default ResultDisplay;
