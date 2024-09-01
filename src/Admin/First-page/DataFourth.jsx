import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Table = ({ data, columns, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="py-2 px-4 border-b text-left bg-gray-100">
                                {col.label}
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
                                        {row[col.key] || '-'}
                                    </td>
                                ))}
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => onEdit(row._id)}
                                        className="text-blue-500 hover:text-blue-700"
                                        aria-label={`Edit ${row.name}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(row._id)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                        aria-label={`Delete ${row.name}`}
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

const DataFourth = () => {
    const [currentTable, setCurrentTable] = useState('');
    const [formData, setFormData] = useState({ name: '', today: '', yesterday: '' });
    const [tablesData, setTablesData] = useState({});
    const [tableNames, setTableNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const API_URL ='https://satta-3.onrender.com/'; // Fallback URL

    useEffect(() => {
        const fetchTableNames = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/getTableNames`);
                const filteredTableNames = response.data.filter((name) => name.startsWith('Table'));
                setTableNames(filteredTableNames);
                setError(null);
            } catch (error) {
                console.error('Error fetching table names:', error);
                setError('Failed to fetch table names.');
            } finally {
                setLoading(false);
            }
        };
        fetchTableNames();
    }, [API_URL]);

    useEffect(() => {
        const fetchTableData = async () => {
            if (currentTable) {
                setLoading(true);
                try {
                    const encodedTableName = encodeURIComponent(currentTable);
                    const response = await axios.get(`${API_URL}/getTableData/${encodedTableName}`);
                    setTablesData((prevTablesData) => ({
                        ...prevTablesData,
                        [currentTable]: response.data,
                    }));
                    setError(null);
                } catch (error) {
                    console.error('Error fetching table data:', error);
                    setError('Failed to fetch table data.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchTableData();
    }, [currentTable, API_URL]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const isFormValid = () => {
        return formData.name.trim() !== '' && formData.today.trim() !== '' && formData.yesterday.trim() !== '';
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!currentTable || !isFormValid()) {
            setError('Please fill out all fields.');
            return;
        }

        const url = editingId
            ? `${API_URL}/${currentTable}/${editingId}`
            : `${API_URL}/${currentTable}`;

        try {
            const response = await axios[editingId ? 'put' : 'post'](url, formData);
            const newData = response.data;
            setTablesData((prevTablesData) => ({
                ...prevTablesData,
                [currentTable]: editingId
                    ? prevTablesData[currentTable].map((item) => (item._id === editingId ? newData : item))
                    : [...(prevTablesData[currentTable] || []), newData],
            }));
            setFormData({ name: '', today: '', yesterday: '' });
            setEditingId(null);
            setError(null);
        } catch (error) {
            setError('Failed to add/update table data.');
        }
    };

    const handleTableChange = (e) => {
        setCurrentTable(e.target.value);
    };

    const handleAddTable = () => {
        const newTableName = `Table ${tableNames.length + 1}`;
        if (!tableNames.includes(newTableName)) {
            setTableNames((prevTableNames) => [...prevTableNames, newTableName]);
            setTablesData({ ...tablesData, [newTableName]: [] });
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
            }
        } catch (error) {
            setError('Failed to delete table data.');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Admin Panel</h1>
            {error && <div className="bg-red-100 border border-red-500 text-red-700 p-4 rounded mb-4">{error}</div>}
            <div className="mb-4">
                <select value={currentTable} onChange={handleTableChange} className="border p-2">
                    <option value="">Select Table</option>
                    {tableNames.map((tableName) => (
                        <option key={tableName} value={tableName}>
                            {tableName}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddTable} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
                    Add New Table
                </button>
            </div>
            {currentTable && (
                <div>
                    <form onSubmit={handleFormSubmit} className="mb-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            placeholder="Name"
                            className="border p-2 mr-2"
                        />
                        <input
                            type="text"
                            name="yesterday"
                            value={formData.yesterday}
                            onChange={handleFormChange}
                            placeholder="Yesterday's Result"
                            className="border p-2 mr-2"
                        />
                        <input
                            type="text"
                            name="today"
                            value={formData.today}
                            onChange={handleFormChange}
                            placeholder="Today's Result"
                            className="border p-2 mr-2"
                        />
                        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                            {editingId ? 'Update' : 'Add'} Data
                        </button>
                    </form>
                    {loading && <p className="text-gray-500">Loading data...</p>}
                    <Table
                        data={tablesData[currentTable] || []}
                        columns={[
                            { key: 'name', label: 'Name' },
                            { key: 'yesterday', label: "Yesterday's Result" },
                            { key: 'today', label: "Today's Result" },
                        ]}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}
        </div>
    );
};

export default DataFourth;
