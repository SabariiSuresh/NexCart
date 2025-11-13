
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
        description: { type: String },
        type: { type: String },
        image: { type: String, default: '' }
    },
    { timestamps: true }
);


module.exports = mongoose.model('Category', categorySchema);
