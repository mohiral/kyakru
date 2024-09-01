import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Table component to display data
const Table = ({ data, columns, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="py-2 px-4 border-b text-left bg-gray-100">
                                {col}
                            </th>
                        ))}
                        <th className="py-2 px-4 border-b text-left bg-gray-100">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="py-2 px-4 border-b">
                                        {row[col.toLowerCase()] || '-'}
                                    </td>
                                ))}
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => onEdit(row._id)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(row._id)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} className="py-2 px-4 border-b text-center">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Main Admin Panel component
const DataFourth = () => {
    const [currentTable, setCurrentTable] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        today: '',
        yesterday: '',
    });
    const [tablesData, setTablesData] = useState({});
    const [tableNames, setTableNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${API_URL}/getTableNames`)
            .then((response) => {
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
        if (currentTable) {
            setLoading(true);
            axios
                .get(`${API_URL}/getTableData/${currentTable}`)
                .then((response) => {
                    setTablesData((prevTablesData) => ({
                        ...prevTablesData,
                        [currentTable]: response.data,
                    }));
                    setLoading(false);
                    setError(null);
                })
                .catch((error) => {
                    console.error('Error fetching table data:', error);
                    setError('Failed to fetch table data.');
                    setLoading(false);
                });
        }
    }, [currentTable, API_URL]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!currentTable) return;

        const url = editingId
            ? `${API_URL}/updateTableData/${currentTable}/${editingId}`
            : `${API_URL}/addTableData`;

        axios
            .post(url, {
                tableName: currentTable,
                ...formData,
            })
            .then((response) => {
                const newData = response.data;
                setTablesData((prevTablesData) => ({
                    ...prevTablesData,
                    [currentTable]: editingId
                        ? prevTablesData[currentTable].map((item) => (item._id === editingId ? newData : item))
                        : [...(prevTablesData[currentTable] || []), newData],
                }));
                setFormData({
                    name: '',
                    today: '',
                    yesterday: '',
                });
                setEditingId(null);
                setError(null);
            })
            .catch((error) => {
                console.error('Error adding/updating table data:', error);
                setError('Failed to add/update table data.');
            });
    };

    const handleTableChange = (e) => {
        setCurrentTable(e.target.value);
    };

    const handleAddTable = () => {
        const newTableName = `Table ${tableNames.length + 1}`;
        if (!tableNames.includes(newTableName)) {
            setTableNames((prevTableNames) => [...prevTableNames, newTableName]);
            setTablesData({
                ...tablesData,
                [newTableName]: [],
            });
            setCurrentTable(newTableName);
        }
    };

    const handleEdit = (id) => {
        const row = tablesData[currentTable]?.find((item) => item._id === id);
        if (row) {
            setFormData({
                name: row.name || '',
                today: row.today || '',
                yesterday: row.yesterday || '',
            });
            setEditingId(id);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/deleteTableData/${id}`);
            if (response.status === 200) {
                setTablesData((prevTablesData) => ({
                    ...prevTablesData,
                    [currentTable]: prevTablesData[currentTable].filter((item) => item._id !== id),
                }));
                setError(null);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting table data:', error);
            setError('Failed to delete table data.');
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <button
                    onClick={handleAddTable}
                    className="bg-blue-500 text-white rounded px-4 py-2"
                >
                    Add Table
                </button>
            </div>
            <div className="mb-4">
                <div className="p-4">
                    <div className="mb-4">
                        <h2>Select a Table</h2>
                        {loading && <p>Loading...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        <select
                            value={currentTable}
                            onChange={handleTableChange}
                            className="border border-gray-300 rounded px-4 py-2"
                        >
                            <option value="">Select a table</option>
                            {tableNames.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p>Selected Table: {currentTable}</p>
                    </div>
                </div>
            </div>
            <form onSubmit={handleFormSubmit} className="mb-4">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Name"
                    className="border border-gray-300 rounded px-4 py-2 mr-2"
                />
                <input
                    type="text"
                    name="yesterday"
                    value={formData.yesterday}
                    onChange={handleFormChange}
                    placeholder="Yesterday's Result"
                    className="border border-gray-300 rounded px-4 py-2 mr-2"
                />
                <input
                    type="text"
                    name="today"
                    value={formData.today}
                    onChange={handleFormChange}
                    placeholder="Today's Result"
                    className="border border-gray-300 rounded px-4 py-2 mr-2"
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white rounded px-4 py-2"
                >
                    {editingId ? 'Update' : 'Add'} Data
                </button>
            </form>
            {currentTable && (
                <Table
                    data={tablesData[currentTable] || []}
                    columns={['Name', 'Yesterday', 'Today']}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default DataFourth;
