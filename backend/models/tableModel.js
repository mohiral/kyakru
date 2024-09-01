import mongoose from 'mongoose';

// Function to get or create a model dynamically based on the table name
const getTableModel = (tableName) => {
    const tableSchema = new mongoose.Schema({
        name: String,
        today: String,
        yesterday: String,
    });

    // Ensure the model is created or retrieved correctly
    return mongoose.models[tableName] || mongoose.model(tableName, tableSchema, tableName);
};

export default getTableModel;
