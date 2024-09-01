import React from 'react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            

            <main className="flex-grow container mx-auto p-4">
                <section className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                    <form action="/submit-contact" method="post" className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
                            <input type="text" id="name" name="name" required className="mt-1 p-2 block w-full border border-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                            <input type="email" id="email" name="email" required className="mt-1 p-2 block w-full border border-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message:</label>
                            <textarea id="message" name="message" rows="4" required className="mt-1 block w-full border border-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700">Send Message</button>
                    </form>

                    <a href="https://wa.me/+919462833780" target="_blank" rel="noopener noreferrer">
                    <img src="https://lucky-satta.com/whatsAppChat.png" alt="WhatsApp Chat" className="mt-4 mx-auto h-20 w-56 object-cover border-2 border-green-600 rounded-lg" />
                </a>
                </section>
            </main>

            
        </div>
    );
};

export default Contact;
