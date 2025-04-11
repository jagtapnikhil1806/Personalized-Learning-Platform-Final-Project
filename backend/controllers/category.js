const Category = require('../models/category')

// get Random Integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

// ================ create Category ================
exports.createCategory = async (req, res) => {
    try {
        // extract data
        const { name, description } = req.body;

        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const categoryDetails = await Category.create({
            name: name, description: description
        });

        res.status(200).json({
            success: true,
            message: 'Category created successfully'
        });
    }
    catch (error) {
        console.log('Error while creating Category');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while creating Category',
            error: error.message
        })
    }
}


// ================ get All Category ================
exports.showAllCategories = async (req, res) => {
    try {
        // get all category from DB
        const allCategories = await Category.find({}, { name: true, description: true });

        // return response
        res.status(200).json({
            success: true,
            data: allCategories,
            message: 'All allCategories fetched successfully'
        })
    }
    catch (error) {
        console.log('Error while fetching all allCategories');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching all allCategories'
        })
    }
}



// ================ Get Category Page Details ================
exports.getCategoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body
        // console.log("PRINTING CATEGORY ID: ", categoryId);

        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: "ratingAndReviews",
            })
            .exec()

        // console.log('selectedCategory = ', selectedCategory)
        // Handle the case when the category is not found
        if (!selectedCategory) {
            // console.log("Category not found.")
            return res.status(404).json({ success: false, message: "Category not found" })
        }



        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            // console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                data: null,
                message: "No courses found for the selected category.",
            })
        }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
        )
            .populate({
                path: "courses",
                match: { status: "Published" },
            })
            .exec()

        //console.log("Different COURSE", differentCategory)
        // Get top-selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
            })
            .exec()

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)

        // console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

// ================ Update Category ================
exports.updateCategory = async (req, res) => {
    try {
        const { categoryId, name, description } = req.body;

        // Validation
        if (!categoryId || !name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Category ID, name and description are required'
            });
        }

        // Check if category exists
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Update category
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name, description },
            { new: true } // Return the updated document
        );

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        console.log('Error while updating category');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while updating category',
            error: error.message
        });
    }
}

// ================ Delete Category ================
exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;

        // Validation
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Category ID is required'
            });
        }

        // Check if category exists
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if category has any courses
        if (existingCategory.courses.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with associated courses. Please remove courses first.'
            });
        }

        // Delete category
        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.log('Error while deleting category');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while deleting category',
            error: error.message
        });
    }
}