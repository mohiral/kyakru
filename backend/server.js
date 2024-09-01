import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using the URI from environment variables
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Define Schemas and Models
const dataSchema = new mongoose.Schema({
    time: String,
    name: String,
    result: String,
});

const Data = mongoose.model('Data', dataSchema);

const dataSchemaA = new mongoose.Schema({
    time: String,
    name: String,
    result1: String,
    result2: String,
});

const DataA = mongoose.model('DataA', dataSchemaA);

const dataThirdSchema = new mongoose.Schema({
    name: String,
    place: String,
});

const DataThird = mongoose.model('DataThird', dataThirdSchema);

// Dynamic Table Model Creation
const getTableModel = (tableName) => {
    const tableSchema = new mongoose.Schema({
        name: String,
        today: String,
        yesterday: String,
    });

    // Ensure the model is created or retrieved correctly
    return mongoose.models[tableName] || mongoose.model(tableName, tableSchema, tableName);
};

// Example of a more generic approach to CRUD operations
const handleCRUD = (Model) => {
    return {
        getAll: async (req, res) => {
            try {
                const data = await Model.find();
                res.status(200).json(data);
            } catch (error) {
                res.status(500).json({ message: 'Internal Server Error', error: error.message });
            }
        },
        create: async (req, res) => {
            try {
                const newData = new Model(req.body);
                await newData.save();
                res.status(201).json(newData);
            } catch (error) {
                res.status(500).json({ message: 'Internal Server Error', error: error.message });
            }
        },
        delete: async (req, res) => {
            try {
                const result = await Model.findByIdAndDelete(req.params.id);
                if (!result) {
                    return res.status(404).json({ message: 'Data not found' });
                }
                res.status(200).json({ message: 'Data deleted successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Internal Server Error', error: error.message });
            }
        },
        update: async (req, res) => {
            try {
                const updatedData = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                if (!updatedData) {
                    return res.status(404).json({ message: 'Data not found' });
                }
                res.status(200).json(updatedData);
            } catch (error) {
                res.status(500).json({ message: 'Internal Server Error', error: error.message });
            }
        }
    };
};

// Routes for the Data model
app.get('/data', handleCRUD(Data).getAll);
app.post('/data', handleCRUD(Data).create);
app.delete('/data/:id', handleCRUD(Data).delete);
app.put('/data/:id', handleCRUD(Data).update);

// Routes for the DataThird model
app.get('/getDataThird', async (req, res) => {
    try {
        const entries = await DataThird.find();
        res.status(200).json(entries);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.post('/addDataThird', async (req, res) => {
    const { name, place } = req.body;
    if (!name || !place) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const newEntry = new DataThird({ name, place });
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.delete('/deleteDataThird/:id', async (req, res) => {
    try {
        const result = await DataThird.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.put('/updateDataThird/:id', async (req, res) => {
    const { name, place } = req.body;
    if (!name || !place) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const updatedData = await DataThird.findByIdAndUpdate(
            req.params.id,
            { name, place },
            { new: true }
        );
        if (!updatedData) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json(updatedData);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Routes for the DataA model
app.get('/getDataa', async (req, res) => {
    try {
        const data = await DataA.find();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.post('/addDataa', async (req, res) => {
    try {
        const { time, name, result1, result2 } = req.body;

        if (!time || !name || !result1 || !result2) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newData = new DataA({ time, name, result1, result2 });
        await newData.save();
        res.status(201).json(newData);
    } catch (error) {
        console.error('Error saving data:', error.message); // Log the error message
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/deleteDataa/:id', async (req, res) => {
    try {
        const result = await DataA.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.put('/updateDataa/:id', async (req, res) => {
    const { time, name, result1, result2 } = req.body;

    if (!time || !name || !result1 || !result2) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const updatedData = await DataA.findByIdAndUpdate(
            req.params.id,
            { time, name, result1, result2 },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ error: 'Data not found' });
        }

        res.status(200).json(updatedData);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Dynamic routes for any table based on the table name
app.get('/:tableName', async (req, res) => {
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

app.post('/:tableName', validateTableData, async (req, res) => {
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

app.delete('/:tableName/:id', async (req, res) => {
    try {
        const { tableName, id } = req.params;
        const Model = getTableModel(tableName);
        const result = await Model.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error(`Error deleting data from ${req.params.tableName}:`, error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.put('/:tableName/:id', validateTableData, async (req, res) => {
    try {
        const { tableName, id } = req.params;
        const { name, today, yesterday } = req.body;

        const Model = getTableModel(tableName);
        const updatedData = await Model.findByIdAndUpdate(
            id,
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

// Validate Table Data Middleware
const validateTableData = (req, res, next) => {
    const { name, today, yesterday } = req.body;
    if (!name || typeof name !== 'string' || !today || !yesterday) {
        return res.status(400).json({ message: 'Missing or invalid required fields' });
    }
    next();
};

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
