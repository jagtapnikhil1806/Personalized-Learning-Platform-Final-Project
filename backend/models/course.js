const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String
    },
    courseDescription: {
        type: String
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    whatYouWillLearn: {
        type: String
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section'
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RatingAndReview'
        }
    ],
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    tag: {
        type: [String],
        required: true
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    instructions: {
        type: [String]
    },
    status: {
        type: String,
        enum: ['Draft', 'Published']
    },
    // duration: {
    //     type: Number,
    //     description: "Course duration in hours"
    //   },
    createdAt: {
        type: Date,
    }
    ,
    updatedAt: {
        type: Date,
    }

});

module.exports = mongoose.model('Course', courseSchema);

// In your Course model
// courseSchema.virtual('duration').get(function() {
//     if (!this.courseContent) return 0;
//     let minutes = 0;
//     this.courseContent.forEach(section => {
//         section.subSection?.forEach(subSection => {
//             minutes += subSection.timeDuration || 0;
//         });
//     });
//     return Math.ceil(minutes / 60); // Convert to hours
// });

// // Enable virtuals in toJSON output
// courseSchema.set('toJSON', { virtuals: true });