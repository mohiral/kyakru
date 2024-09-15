// import getTableModel from '../models/tableModel.js';
const express = require('express');
const router = express.Router();
const Table = require('../models/tableModel.js');

// Add or update data
router.post('/addTableData', async (req, res) => {
    const { tableName, name, today, yesterday, id } = req.body;
    try {
        const query = id ? { _id: id } : { tableName, name };
        const update = { tableName, name, today, yesterday };
        const options = { new: true, upsert: true };

        const result = await Table.findOneAndUpdate(query, update, options);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding/updating table data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Get all table names
router.get('/getTableNames', async (req, res) => {
    try {
        const tableNames = await Table.distinct('tableName');
        res.json(tableNames);
    } catch (error) {
        console.error('Error fetching table names:', error);
        res.status(500).json({ error: 'Failed to fetch table names.' });
    }
});

// Get data for a specific table
router.get('/getTableData/:tableName', async (req, res) => {
    const tableName = req.params.tableName;
    try {
        const data = await Table.find({ tableName });
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching table data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Update data for a specific table and id
router.put('/updateTableData/:id', async (req, res) => {
    const { id } = req.params;
    const { name, tableName, today, yesterday } = req.body;
    try {
        const updatedData = await Table.findByIdAndUpdate(
            id,
            { tableName, name, today, yesterday },
            { new: true }
        );
        if (!updatedData) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json(updatedData);
    } catch (error) {
        console.error('Error updating table data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Delete data for a specific id
router.delete('/deleteTableData/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Table.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting table data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
