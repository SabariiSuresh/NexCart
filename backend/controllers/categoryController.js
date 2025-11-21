
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
        const { name, description, parent, type } = req.body;

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'Category name already exists' })
        }

        const parentValue =
            parent && parent !== 'null' && parent !== '' ? parent : null;

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
            const imageUrl = category.image;
            const publicId = imageUrl.substring(
                imageUrl.lastIndexOf('nexcart/categories/'),
                imageUrl.lastIndexOf('.')
            );
            await cloudinary.uploader.destroy(publicId);
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

        const products = await Product.find({ category: { $in: childIds } });

        return res.status(200).json({
            success: true,
            total: products.length,
            products
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch products', error: err.message });
    }
}


