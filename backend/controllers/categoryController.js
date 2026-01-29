
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const cloudinary = require('../config/cloudinary');


const getAllChildCategory = async (parentId) => {

    const childCategories = await Category.find({ parent: parentId }).select('_id');

    let ids = childCategories.map(catId => catId._id);

    for (let category of childCategories) {
        const subIds = await getAllChildCategory(category._id)
        ids = ids.concat(subIds);
    }

    return ids
}


exports.createCategory = async (req, res) => {
    try {
        let { name, description, parent, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({ success: false, message: 'Name and type are required' })
        }

        name = name.trim().toLowerCase();

        const parentValue =
            parent && parent !== 'null' && parent !== '' ? parent : null;

        const existingCategory = await Category.findOne({ name, parent: parentValue, type });

        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'Category already exists under this parent' })
        }

        const image = req.file ? req.file.path : '';

        const category = new Category({
            name,
            description,
            parent: parentValue,
            type,
            image,
        });

        const newCategory = await category.save();

        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category: newCategory,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: err.message,
        });
    }
};



exports.getCategories = async (req, res) => {

    try {

        const rootCategories = await Category.find({ parent: null });

        const buildCategoryTree = async (category) => {

            const children = await Category.find({ parent: category._id });
            const categoryObj = category.toObject();

            if (children.length > 0) {

                categoryObj.children = await Promise.all(children.map(buildCategoryTree));

            }

            return categoryObj;

        }

        const nestedCategories = await Promise.all(rootCategories.map(buildCategoryTree));

        return res.status(200).json({ success: true, message: 'Nested categories', categories: nestedCategories });

    } catch (err) {

        return res.status(500).json({ success: false, message: 'Failed to fetch Nested categories', error: err.message });

    }
};


exports.getCategoryById = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id).populate('parent', 'name');

        if (!category) {

            return res.status(404).json({ success: false, message: 'Category not found' });

        } else {

            return res.status(200).json({ success: true, message: 'Category', category: category });

        }

    } catch (err) {

        return res.status(500).json({ success: false, message: 'Failed to fetch category', error: err.message });

    }
};

exports.updateCategory = async (req, res) => {
    try {
        const data = { ...req.body };

        if (!data.parent || data.parent === 'null' || data.parent === '') {
            data.parent = null;
        }

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        if (req.file) {
            if (category.image) {
                try {

                    const publicId = category.image
                        .split('/')
                        .slice(-2)
                        .join('/')
                        .split('.')[0];

                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error('Failed to delete old image:', err.message);
                }
            }

            data.image = req.file.path;
        }


        if (data.name) {
            data.name = data.name.trim().toLowerCase();
        }

        const duplicateCat = await Category.findOne({
            _id: { $ne: req.params.id },
            name: data.name ?? category.name,
            parent: data.parent ?? category.parent,
            type: data.type ?? category.type
        });

        if (duplicateCat) {
            return res.status(400).json({ success: false, message: 'Category already exists under this parent' })
        }


        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, data, { new: true });

        return res.status(200).json({ success: true, message: 'Category updated successfully', updatedCategory });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to update category', error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }


        if (category.image) {

            try {

                const imageUrl = category.image;
                const segments = imageUrl.split('/');
                const imageFile = segments.pop();
                const fileName = imageFile.split('.')[0];

                const uploadIndex = segments.indexOf('upload');
                const publicId = segments.slice(uploadIndex + 1).join('/') + '/' + fileName;

                await cloudinary.uploader.destroy(publicId);

            } catch (err) {
                console.error('Cloudinary delection failed', err.message);
            }
        }

        await Category.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, message: 'Category deleted successfully' });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: err.message,
        });
    }
};

exports.getCategoriesPublic = async (req, res) => {
    try {
        const categories = await Category.find({ parent: null });
        return res.status(200).json({ success: true, categories, message: 'Public categories fetched successfully', });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch categories', error: err.message });
    }
};


exports.getProductsFromParentCat = async (req, res) => {

    try {

        const parentId = req.params.id;
        const childIds = await getAllChildCategory(parentId);

        childIds.push(parentId);

        const products = await Product.find({ category: { $in: childIds } }).populate('category', 'name type');;

        return res.status(200).json({
            success: true,
            total: products.length,
            products
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch products', error: err.message });
    }
}


exports.getFilteredProducts = async (req, res) => {
    try {
        const {
            parentCategoryId,
            subcategories,
            brand,
            minPrice,
            maxPrice,
            rating,
            discount
        } = req.query;

        let categoryIds = [];

        if (parentCategoryId) {
            categoryIds = await getAllChildCategory(parentCategoryId);
            categoryIds.push(parentCategoryId);
        }

        const matchStage = {};

        if (categoryIds.length) {
            matchStage.category = { $in: categoryIds };
        }

        if (minPrice || maxPrice) {
            matchStage.price = {};
            if (minPrice) matchStage.price.$gte = Number(minPrice);
            if (maxPrice) matchStage.price.$lte = Number(maxPrice);
        }

        if (brand) {
            matchStage.brand = {
                $in: brand.split(',').map(b => new RegExp(`^${b}$`, 'i'))
            };
        }

        if (rating) {
            matchStage.rating = { $gte: Number(rating) };
        }

        if (discount) {
            matchStage.discount = { $gte: Number(discount) };
        }

        const pipeline = [
            { $match: matchStage },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' }
        ];

        if (subcategories) {
            const subArray = subcategories.split(',').map(s => s.toLowerCase());

            pipeline.push({
                $match: {
                    $expr: {
                        $in: [{ $toLower: '$category.type' }, subArray]
                    }
                }
            });
        }

        const products = await Product.aggregate(pipeline);

        res.status(200).json({
            success: true,
            total: products.length,
            products
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
