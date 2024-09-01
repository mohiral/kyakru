import React, { useState, useEffect } from 'react';

const FrDataFive = () => {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4002/api/tables'); // Update URL as needed
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Fetched data:', result); // Check the structure of the result
        setTables(result); // Adjust based on your data structure
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(error.message);
      }
    };
    
    fetchData();
  }, []);

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        {error ? (
          <p className="text-center text-red-500">{`Error: ${error}`}</p>
        ) : tables.length > 0 ? (
          tables.map((table, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
              <h2 className="text-xl font-semibold p-4 bg-green-500 text-white">{`Table ${table.tableNumber}`}</h2>
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-green-500 text-white">
                  <tr>
                    <td className="table_chart_section_01 forfirtcolor col-md-2 text-center">
                      <strong className="fon">Date</strong>
                    </td>
                    <td className="table_chart_section forfirtcolor text-center">FARIDABAD</td>
                    <td className="table_chart_section forfirtcolor text-center">GAZIYABAD</td>
                    <td className="table_chart_section forfirtcolor text-center">GALI</td>
                    <td className="table_chart_section forfirtcolor text-center">DISAWER</td>
                  </tr>
                </thead>
                <tbody className="bg-gray-50 divide-y divide-gray-200">
                  {table.rows && table.rows.length > 0 ? (
                    table.rows.map((item, idx) => (
                      <tr key={idx} className="hover:bg-green-100">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">
                          <a href={`/chart/${table.tableNumber}/2024`} className="text-green-600 hover:underline">
                            {item.name}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.yesterday}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.today === "Waiting" ? (
                            <img src="/uploads/wait.gif" alt="Waiting" className="h-8 w-8 mx-auto" />
                          ) : (
                            item.today
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No tables available</p>
        )}
      </div>
    </section>
  );
};

export default FrDataFive;
