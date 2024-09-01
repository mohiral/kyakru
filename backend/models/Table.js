// models/Table.js
import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true, unique: true },
    rows: [{ name: String, yesterday: String, today: String }]
});

const Table = mongoose.model('Table', tableSchema);

export default Table;
