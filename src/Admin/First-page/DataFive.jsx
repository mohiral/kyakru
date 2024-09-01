import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaEdit, FaTrash, FaSave, FaTable } from 'react-icons/fa';
import axios from 'axios';

function DataFourth() {
    const [tables, setTables] = useState([]);
    const [savedData, setSavedData] = useState([]);
    const [editing, setEditing] = useState(null);
    const [newData, setNewData] = useState({});
    const [editingSavedData, setEditingSavedData] = useState(null);
    const [newSavedData, setNewSavedData] = useState({});

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch data from the server
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:4002/api/tables');
            console.log('Fetched Data:', response.data); // Debugging log
            setTables(response.data.map(table => table.rows || []));
            setSavedData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Add a new row to a table
    const addRow = (tableIndex) => {
        const newTableData = [...tables];
        newTableData[tableIndex].push({ name: '', yesterday: '', today: '' });
        setTables(newTableData);
    };

    // Delete a row from a table
    const deleteRow = (tableIndex, rowIndex) => {
        const newTableData = [...tables];
        newTableData[tableIndex].splice(rowIndex, 1);
        setTables(newTableData);
    };

    // Handle input changes for a row
    const handleChange = (tableIndex, rowIndex, field, value) => {
        const newTableData = [...tables];
        newTableData[tableIndex][rowIndex] = { ...newTableData[tableIndex][rowIndex], [field]: value };
        setTables(newTableData);
    };

    // Add a new table
    const addTable = () => {
        setTables([...tables, []]);
    };

    // Delete a table
    const deleteTable = (tableIndex) => {
        const newTableData = tables.filter((_, index) => index !== tableIndex);
        setTables(newTableData);
        setSavedData(savedData.filter((data) => data.tableNumber !== tableIndex + 1));
    };

    // Save data to the backend
    const handleSave = async () => {
        const allData = tables.map((table, index) => ({
            tableNumber: index + 1,
            rows: table
        }));
        try {
            const response = await axios.post('http://localhost:4002/api/addData', allData);
            if (response.status === 200) {
                fetchData(); // Fetch the latest data after saving
                alert('Data saved successfully!');
            } else {
                console.error('Failed to save data:', response.status);
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    // Handle edit button click
    const handleEdit = (tableIndex, rowIndex) => {
        setEditing({ tableIndex, rowIndex });
        setNewData(tables[tableIndex][rowIndex]);
    };

    // Save changes after editing
    const handleSaveEdit = () => {
        const newTableData = [...tables];
        newTableData[editing.tableIndex][editing.rowIndex] = newData;
        setTables(newTableData);
        setEditing(null);
    };

    // Handle editing saved data
    const handleEditSavedData = (tableIndex, rowIndex) => {
        setEditingSavedData({ tableIndex, rowIndex });
        setNewSavedData(savedData[tableIndex].rows[rowIndex]);
    };

    // Save changes to saved data
    const handleSaveSavedDataEdit = () => {
        const newSavedDataArray = [...savedData];
        newSavedDataArray[editingSavedData.tableIndex].rows[editingSavedData.rowIndex] = newSavedData;
        setSavedData(newSavedDataArray);
        setEditingSavedData(null);
    };

    // Delete a row from saved data
    const handleDeleteRowSavedData = (tableIndex, rowIndex) => {
        const newSavedData = [...savedData];
        newSavedData[tableIndex].rows.splice(rowIndex, 1);
        setSavedData(newSavedData);
    };

    // Delete a table from saved data
    const handleDeleteTableSavedData = (tableIndex) => {
        const newSavedData = savedData.filter((_, index) => index !== tableIndex);
        setSavedData(newSavedData);
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>

            {tables.map((tableData, tableIndex) => (
                <div key={tableIndex} className="mb-8 border border-gray-300 rounded-lg shadow-lg bg-white">
                    <div className="flex justify-between items-center p-4 bg-yellow-500 text-white">
                        <h3 className="text-lg font-semibold">Table {tableIndex + 1}</h3>
                        <FaTrash className="text-red-500 cursor-pointer" title="Delete Table" onClick={() => deleteTable(tableIndex)} />
                    </div>
                    <div className="overflow-x-auto p-4">
                        <table className="table table-bordered table-striped table-hover w-full">
                            <thead className="bg-yellow-500 text-white">
                                <tr>
                                    <th className="text-center py-3 px-4">सट्टा का नाम</th>
                                    <th className="text-center py-3 px-4">कल आया था</th>
                                    <th className="text-center py-3 px-4">आज का रिज़ल्ट</th>
                                    <th className="text-center py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-gray-100">
                                        <td className="py-2 px-4">
                                            <input
                                                type="text"
                                                value={row.name}
                                                onChange={(e) => handleChange(tableIndex, rowIndex, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                placeholder="सट्टा का नाम"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="text"
                                                value={row.yesterday}
                                                onChange={(e) => handleChange(tableIndex, rowIndex, 'yesterday', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                placeholder="कल आया था"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="text"
                                                value={row.today}
                                                onChange={(e) => handleChange(tableIndex, rowIndex, 'today', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                placeholder="आज का रिज़ल्ट"
                                            />
                                        </td>
                                        <td className="text-center py-2 px-4">
                                            <FaEdit className="text-blue-500 cursor-pointer mx-2" title="Edit" onClick={() => handleEdit(tableIndex, rowIndex)} />
                                            <FaTrash className="text-red-500 cursor-pointer mx-2" title="Delete Row" onClick={() => deleteRow(tableIndex, rowIndex)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={() => addRow(tableIndex)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                            Add Row
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex justify-between items-center mb-6">
                <button onClick={addTable} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                    <FaTable className="inline mr-2" />
                    Add Table
                </button>
                <button onClick={handleSave} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
                    <FaSave className="inline mr-2" />
                    Save
                </button>
            </div>

            {savedData.length > 0 && (
                <div className="mt-8 border border-gray-300 rounded-lg shadow-lg bg-white">
                    <h3 className="p-4 bg-green-500 text-white text-lg font-semibold">Saved Data</h3>
                    <div className="overflow-x-auto p-4">
                        <table className="table table-bordered table-striped table-hover w-full">
                            <thead className="bg-green-500 text-white">
                                <tr>
                                    <th className="text-center py-3 px-4">Table Number</th>
                                    <th className="text-center py-3 px-4">Row Index</th>
                                    <th className="text-center py-3 px-4">Name</th>
                                    <th className="text-center py-3 px-4">Yesterday</th>
                                    <th className="text-center py-3 px-4">Today</th>
                                    <th className="text-center py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedData.map((table, tableIndex) =>
                                    table.rows.map((row, rowIndex) => (
                                        <tr key={`${tableIndex}-${rowIndex}`} className="hover:bg-gray-100">
                                            <td className="text-center py-2 px-4">{table.tableNumber}</td>
                                            <td className="text-center py-2 px-4">{rowIndex + 1}</td>
                                            <td className="py-2 px-4">
                                                {editingSavedData && editingSavedData.tableIndex === tableIndex && editingSavedData.rowIndex === rowIndex ? (
                                                    <input
                                                        type="text"
                                                        value={newSavedData.name}
                                                        onChange={(e) => setNewSavedData({ ...newSavedData, name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                ) : (
                                                    row.name
                                                )}
                                            </td>
                                            <td className="py-2 px-4">
                                                {editingSavedData && editingSavedData.tableIndex === tableIndex && editingSavedData.rowIndex === rowIndex ? (
                                                    <input
                                                        type="text"
                                                        value={newSavedData.yesterday}
                                                        onChange={(e) => setNewSavedData({ ...newSavedData, yesterday: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                ) : (
                                                    row.yesterday
                                                )}
                                            </td>
                                            <td className="py-2 px-4">
                                                {editingSavedData && editingSavedData.tableIndex === tableIndex && editingSavedData.rowIndex === rowIndex ? (
                                                    <input
                                                        type="text"
                                                        value={newSavedData.today}
                                                        onChange={(e) => setNewSavedData({ ...newSavedData, today: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                ) : (
                                                    row.today
                                                )}
                                            </td>
                                            <td className="text-center py-2 px-4">
                                                {editingSavedData && editingSavedData.tableIndex === tableIndex && editingSavedData.rowIndex === rowIndex ? (
                                                    <FaSave className="text-green-500 cursor-pointer mx-2" title="Save" onClick={handleSaveSavedDataEdit} />
                                                ) : (
                                                    <FaEdit className="text-blue-500 cursor-pointer mx-2" title="Edit" onClick={() => handleEditSavedData(tableIndex, rowIndex)} />
                                                )}
                                                <FaTrash className="text-red-500 cursor-pointer mx-2" title="Delete Row" onClick={() => handleDeleteRowSavedData(tableIndex, rowIndex)} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {savedData.length > 1 && (
                            <div className="mt-4">
                                {savedData.map((table, tableIndex) => (
                                    <button key={tableIndex} onClick={() => handleDeleteTableSavedData(tableIndex)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mr-2">
                                        Delete Table {table.tableNumber}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataFourth;
