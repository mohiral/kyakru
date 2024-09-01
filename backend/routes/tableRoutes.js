import express from 'express';
import getTableModel from '../models/tableModel.js';
import validateTableData from '../middlewares/validateTableData.js'; // Adjust path if necessary

const router = express.Router();

// Routes for CRUD operations on dynamic tables
router.get('/:tableName', async (req, res) => {
    try {
        const { tableName } = req.params;
        const Model = getTableModel(tableName);
        const data = await Model.find();
        res.status(200).json(data);
    } catch (error) {
        console.error(`Error fetching data from ${req.params.tableName}:`, error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.post('/:tableName', validateTableData, async (req, res) => {
    try {
        const { tableName } = req.params;
        const { name, today, yesterday } = req.body;

        const Model = getTableModel(tableName);
        const newData = new Model({ name, today, yesterday });

        await newData.save();
        res.status(201).json(newData);
    } catch (error) {
        console.error(`Error adding data to ${req.params.tableName}:`, error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.delete('/:tableName/:id', async (req, res) => {
    try {
        const { tableName } = req.params;
        const Model = getTableModel(tableName);
        const result = await Model.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error(`Error deleting data from ${req.params.tableName}:`, error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.put('/:tableName/:id', validateTableData, async (req, res) => {
    try {
        const { tableName } = req.params;
        const { name, today, yesterday } = req.body;

        const Model = getTableModel(tableName);
        const updatedData = await Model.findByIdAndUpdate(
            req.params.id,
            { name, today, yesterday },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json(updatedData);
    } catch (error) {
        console.error(`Error updating data in ${req.params.tableName}:`, error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

export default router;
