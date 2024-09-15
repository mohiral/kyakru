const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableName: { type: String, required: true }, // To distinguish different tables
    name: { type: String, required: true },
    today: { type: String, required: true },
    yesterday: { type: String, required: true }
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
