import React, { useEffect, useState } from 'react';

const FrdataThird = () => {
    const [entries, setEntries] = useState([]);
    const API_URL = 'http://localhost:3002'; // Make sure this matches the backend API

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/getDataThird`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched data:', data); // Log the data
                setEntries(data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
    
        fetchData();
    }, [API_URL]);

    return (
        <div className="bg-white border-2 border-green-600 rounded-lg p-6 shadow-lg w-full mx-auto">
            <div className="bg-green-100 p-4 rounded-t-lg text-center mb-6">
                <p className="text-lg font-semibold text-green-800 mb-2">
                    <strong>सीधे सट्टा कंपनी का No 1 खाईवाल</strong>
                </p>
                <p className="text-xl font-bold text-green-800 mb-4">
                    <span className="text-2xl">♕♕</span> AL Official Group <span className="text-2xl">♕♕</span>
                </p>

                <div className="space-y-2 mb-6">
                    {entries.map((entry, index) => (
                        <p key={index} className="text-lg font-semibold text-center text-gray-800">
                            {entry.name} ------------ {entry.place}
                        </p>
                    ))}
                </div>
            </div>

            <div className="bg-green-100 p-4 rounded-lg mb-6">
                <p className="text-lg font-semibold text-green-800 text-center mb-2">♕♕ PAYMENT OPTION ♕♕</p>
                <p className="text-lg font-semibold text-center text-gray-800 mb-2">PAYTM // BANK TRANSFER // PHONE PAY // GOOGLE PAY</p>
                <p className="text-lg font-bold text-green-600 text-center">9462833780</p>
            </div>

            <div className="bg-green-100 p-4 rounded-lg mb-6">
                <p className="text-lg font-semibold text-green-800 text-center mb-2">♕♕ जोड़ी रेट ♕♕</p>
                <p className="text-lg font-bold text-gray-800 text-center mb-1">जोड़ी रेट 10 ------- 960</p>
                <p className="text-lg font-bold text-gray-800 text-center">हरूफ रेट 100 ----- 960</p>
            </div>

            <div className="text-center">
                <p className="text-xl font-bold text-green-800 mb-4">♕♕ AL Official Group ♕♕</p>
                <h3 className="text-lg font-semibold mb-4">
                    <a href="https://wa.me/+919462833780" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                        Game Play करने के लिये नीचे लिंक पर क्लिक करे
                    </a>
                </h3>
                <a href="https://wa.me/+919462833780" target="_blank" rel="noopener noreferrer">
                    <img src="https://lucky-satta.com/whatsAppChat.png" alt="WhatsApp Chat" className="mt-4 mx-auto h-20 w-56 object-cover border-2 border-green-600 rounded-lg" />
                </a>
            </div>
        </div>
    );
};

export default FrdataThird;
