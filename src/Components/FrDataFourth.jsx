import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResultsTable = () => {
  const [tableNames, setTableNames] = useState([]);
  const [tablesData, setTablesData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/getTableNames`)
      .then((response) => {
        console.log('Table names response:', response.data);
        const filteredTableNames = response.data.filter((name) =>
          name.startsWith('Table')
        );
        setTableNames(filteredTableNames);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching table names:', error);
        setError('Failed to fetch table names.');
        setLoading(false);
      });
  }, [API_URL]);

  useEffect(() => {
    if (tableNames.length > 0) {
      setLoading(true);
      const tableDataPromises = tableNames.map(name =>
        axios.get(`${API_URL}/getTableData/${name}`)
      );

      Promise.all(tableDataPromises)
        .then((responses) => {
          console.log('Table data responses:', responses);
          const fetchedData = responses.map((response, index) => ({
            tableName: tableNames[index],
            rows: response.data
          }));
          setTablesData(fetchedData);
          setLoading(false);
          setError(null);
        })
        .catch((error) => {
          console.error('Error fetching table data:', error);
          setError('Failed to fetch table data.');
          setLoading(false);
        });
    }
  }, [tableNames, API_URL]);

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{`Error: ${error}`}</p>}
        {tablesData.length > 0 ? (
          tablesData.map((tableData, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
              {/* <h2 className="text-xl font-semibold p-4 bg-green-500 text-white">{`Table ${index + 1}`}</h2> */}
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-green-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">सट्टा का नाम</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">कल आया था</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">आज का रिज़ल्ट</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50 divide-y divide-gray-200">
                  {tableData.rows.length > 0 ? (
                    tableData.rows.map((item, idx) => (
                      <tr key={idx} className="hover:bg-green-100">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">
                          <a href={`/chart/${index + 1}/2024`} className="text-green-600 hover:underline">
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
          !loading && <p className="text-center text-gray-500">No tables available</p>
        )}
      </div>
    </section>
  );
};

export default ResultsTable;
