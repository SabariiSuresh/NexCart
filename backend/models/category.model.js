
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
        description: { type: String },
        type: { type: String },
        image: { type: String, default: '' }
    },
    { timestamps: true }
);

categorySchema.index(
    { name: 1, parent: 1, type: 1 },
    { unique: true }
)

module.exports = mongoose.model('Category', categorySchema);
