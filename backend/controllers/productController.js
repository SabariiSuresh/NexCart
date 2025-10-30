
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Order = require('../models/order.model');


const generateTags = (name, categoryName) => {
    const tagName = name.split(" ").map(tag => tag.toLowerCase());
    return Array.from(new Set([categoryName.toLowerCase(), ...tagName]));
}

exports.createProduct = async (req, res) => {

    try {

        const { name, description, price, stock, category, brand, rating, tags, discount: fromBody = 0, salesCount = 0, oldPrice = 0, features } = req.body;

        const foundCategory = await Category.findById(category);

        if (!foundCategory) {

            return res.status(400).json({ message: 'Invalid category id' });

        }

        let parsedFeature = {};

        if (features) {
            try {
                parsedFeature = typeof features === 'string' ? JSON.parse(features) : features;
            } catch (err) {
                return res.status(400).json({ message: 'Invalid features format' });
            }
        }


        const productPrice = Number(price);
        const productOldPrice = Number(oldPrice);

        const discount = fromBody && Number(fromBody) > 0
            ? Number(fromBody)
            : productOldPrice > productPrice
                ? Math.round(((productOldPrice - productPrice) / productOldPrice) * 100)
                : 0;

        const makeTag = tags && tags.length > 0 ? tags : generateTags(name, foundCategory.name);

        const images = req.files ? req.files.map(file => `/upload/products/${file.filename}`) : [];

        const product = new Product({ name, description, price: productPrice, images, stock, brand, rating, category: foundCategory._id, tags: makeTag, discount, salesCount, oldPrice: productOldPrice, features: parsedFeature });

        const newProduct = await product.save();
        await newProduct.populate('category', 'name type');

        return res.status(201).json({ message: "Product create successfully", product: newProduct });

    } catch (err) {

        console.error(err)

        return res.status(500).json({ message: 'Failed to create product', error: err.message })

    }

}


exports.getAllProducts = async (req, res) => {

    try {

        const products = await Product.find().populate('category', 'name type');

        return res.status(200).json({ message: 'All products', products: products });

    } catch (err) {

        return res.status(500).json({ message: 'Failed to get all product', error: err.message })

    }

}


exports.getProductsById = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id).populate('category', 'name type');

        if (!product) {

            return res.status(404).json({ message: 'Product not found' });

        }


        const recommended = await Product.find({ category: product.category._id, _id: { $ne: product._id } }).limit(8);


        return res.status(200).json({ message: 'Product', product, recommended });



    } catch (err) {

        return res.status(500).json({ message: 'Failed to get product', error: err.message })

    }

}

const getAllSubCategoryIds = async (categoryId) => {

    const subCategories = await Category.find({ parent: categoryId });

    let ids = subCategories.map(cat => cat._id);

    for (const sub of subCategories) {

        const subIds = await getAllSubCategoryIds(sub._id);

        ids = ids.concat(subIds);

    }

    return ids;

}

exports.getProductsByCategory = async (req, res) => {

    try {

        const categoryId = req.params.id;
        if (!categoryId) return res.status(400).json({ message: 'Category id is required' });

        const category = await Category.findById(categoryId);

        if (!category) {

            return res.status(404).json({ message: 'Category not found' });

        }

        const subCategoryIds = await getAllSubCategoryIds(categoryId);

        const allCategoryIds = [categoryId, ...subCategoryIds];

        const products = await Product.find({ category: { $in: allCategoryIds } }).populate('category', 'name type')

        if (!products || products.length === 0) {

            return res.status(404).json({ message: 'No products found such category' });

        } else {

            return res.status(200).json({ message: 'Products in category', category: category.name, products });

        }

    } catch (err) {

        return res.status(500).json({ message: 'Failed to get products by category', error: err.message })

    }

}


exports.updateProduct = async (req, res) => {

    try {

        const { category } = req.body;

        if (category) {

            const findCategory = await Category.findById(category);

            if (!findCategory) {

                return res.status(404).json({ message: 'Invalid category name ' })

            }

            req.body.category = findCategory._id;
        }

        if ((price || oldPrice) && (!fromBody || Number(fromBody) === 0)) {
            const newPrice = Number(price || foundProduct.price);
            const newOldPrice = Number(oldPrice || foundProduct.oldPrice);
            req.body.discount = newOldPrice > newPrice
                ? Math.round(((newOldPrice - newPrice) / newOldPrice) * 100)
                : 0;
        } else if (fromBody) {
            req.body.discount = Number(fromBody);
        }


        const foundProduct = await Product.findById(req.params.id);
        if (!foundProduct) return res.status(404).json({ message: 'Product not found' });

        const newImages = req.files.map(file => `/upload/products/${file.filename}`);
        const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : foundProduct.images;
        const finalImages = [...existingImages, ...newImages];

        foundProduct.set({ ...req.body, images: finalImages });
        await foundProduct.save();

        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category', 'name')

        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(201).json({ message: 'Product updated', product });

    } catch (err) {

        return res.status(500).json({ message: 'Failed to update product', error: err.message })

    }

}


exports.deleteProduct = async (req, res) => {

    try {

        const product = await Product.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: 'Product deleted', product });

    } catch (err) {

        return res.status(500).json({ message: 'Failed to delete product', error: err.message })

    }

}


exports.searchProduct = async (req, res) => {

    try {

        const { keyword, q, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

        const searchTerm = keyword || q || '';

        let filter = {};

        if (searchTerm) {

            filter.$or = [
                { name: { $regex: searchTerm, $options: "i" } },
                { brand: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } }
            ];

        }


        if (category) {

            const categoryDoc = await Category.findOne({ name: category });

            if (categoryDoc) {

                filter.category = categoryDoc._id;

            } else {

                filter.category = null;

            }

        }

        if (minPrice || maxPrice) {

            filter.price = {}

            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);

        }

        let query = Product.find(filter).populate('category');

        if (sort) {

            const sortOption = sort === 'priceAsc' ? { price: 1 } : sort === 'priceDesc' ? { price: -1 } : { createdAt: -1 };
            query = query.sort(sortOption);

        }

        const skip = (page - 1) * limit;
        const total = await Product.countDocuments(filter);
        const products = await query.skip(skip).limit(Number(limit));

        return res.status(200).json({ page: Number(page), totalPage: Math.ceil(total / limit), totalProducts: total, message: 'Search result', products });

    } catch (err) {

        return res.status(500).json({ message: 'failed to search', error: err.message }),
            console.error(err)

    }
}


exports.quickSearch = async (req, res) => {

    try {

        const q = (req.query.q || '').trim();

        if (!q) return res.status(200).json({ products: [] });

        const regex = new RegExp(q, 'i');

        const products = await Product.find({
            $or: [
                { name: regex },
                { brand: regex },
                { tags: regex }
            ]
        }).limit(8).select('name images price').populate('category', 'name');

        return res.status(200).json({ products });

    } catch (err) {

        return res.status(500).json({ message: 'failed to quick search', error: err.message }),
            console.error(err)
    }
}



async function getAllCategoryIds(rootId) {
    let ids = [rootId];
    const children = await Category.find({ parent: rootId }).select('_id');
    for (const child of children) {
        ids = ids.concat(await getAllCategoryIds(child._id));
    }
    return ids;
}


async function getTopCategory(categoryName, limit) {

    const category = await Category.findOne({
        name: { $regex: new RegExp('^' + categoryName + '$', 'i') }
    }).select('_id');

    if (!category) return [];

    const catIds = await getAllCategoryIds(category._id);

    return Product.find({ category: { $in: catIds } }).sort({ salesCount: -1 }).limit(limit).populate('category', 'name');

}


exports.selections = async (req, res) => {

    try {

        const limit = Math.max(1, Math.min(+req.query.limit || 8, 24));


        let [topProducts, topElectronics, topFashions, topSpeakers, topToys, deals] = await Promise.all([

            Product.find().sort({ salesCount: -1 }).limit(limit).populate('category', 'name'),

            getTopCategory('electronics', limit),
            getTopCategory('fashion', limit),
            getTopCategory('speakers', limit),
            getTopCategory('toys', limit),

            Product.find({ discount: { $gt: 0 } }).sort({ discount: -1 }).limit(limit).populate('category', 'name')

        ]);

        return res.status(200).json({ topProducts, topElectronics, deals, topFashions, topToys, topSpeakers });

    } catch (err) {

        return res.status(500).json({ message: 'failed to load selection', error: err.message }),
            console.error(err)

    }
}


exports.recommended = async (req, res) => {

    try {

        const limit = Math.max(1, Math.min(+req.query.limit || 8, 24));

        const orders = await Order.find({ user: req.user.id }).select('orderItems').populate('orderItems.product', 'category');

        const freq = new Map();

        for (const order of orders) {
            for (const item of order.orderItems) {

                const cat = item.product?.category?.toString();

                if (cat) {
                    freq.set(cat, (freq.get(cat) || 0) + item.qty);
                }
            }
        }

        let cats = [...freq.entries()].sort((x, y) => y[1] - x[1]).map(([id]) => id);

        if (cats.length === 0) {

            const topCats = await Product.aggregate([
                { $group: { _id: '$category', total: { $sum: '$salesCount' } } },
                { $sort: { total: -1 } },
                { $limit: 3 }
            ]);

            cats = topCats.map(c => c._id);
        }


        const products = await Product.find({ category: { $in: cats }, stock: { $gt: 0 } }).sort({ salesCount: -1, createdAt: -1 }).limit(limit).populate('category', 'name');

        return res.status(200).json({ products });

    } catch (err) {

        return res.status(500).json({ message: 'failed to load recommendation', error: err.message }),
            console.error(err)

    }

}