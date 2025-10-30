
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: { type: [String], required: true },
    stock: { type: Number, required: true, default: 100 },
    brand: { type: String, required: true },
    salesCount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 4.5 },
    oldPrice: { type: Number, default: 0 },
    features: { type: Object, of: String, default: {} }

}, { timestamps: true });

productSchema.index({ salesCount: -1 });
productSchema.index({ category: 1, salesCount: -1 });
productSchema.index({ discount: -1 });

module.exports = mongoose.model('Product', productSchema);