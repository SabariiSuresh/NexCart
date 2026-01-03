exports.getFilteredProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      discount
    } = req.query;

    let query = {};

    // PRICE FILTER
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // BRAND FILTER
    if (brand) {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') }; // case-insensitive
    }

    // RATING FILTER
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // DISCOUNT FILTER
    if (discount) {
      query.discount = { $gte: Number(discount) };
    }

    // CATEGORY FILTER
    if (category) {
      query['category.type'] = category.toLowerCase();
    }

    const products = await Product.find(query)
      .populate('category', 'name type');

    res.status(200).json({
      success: true,
      total: products.length,
      products
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
