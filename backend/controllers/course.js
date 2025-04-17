const Course = require('../models/course');
const User = require('../models/user');
const Category = require('../models/category');
const Section = require('../models/section')
const SubSection = require('../models/subSection')
const CourseProgress = require('../models/courseProgress')

const { uploadImageToCloudinary, deleteResourceFromCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require("../utils/secToDuration")



// ================ create new course ================
exports.createCourse = async (req, res) => {
    try {
        // extract data
        let { courseName, courseDescription, whatYouWillLearn, price, category, instructions: _instructions, status, tag: _tag } = req.body;

        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)

        // console.log("tag = ", tag)
        // console.log("instructions = ", instructions)

        // get thumbnail of course
        const thumbnail = req.files?.thumbnailImage;

        // validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price
            || !category || !thumbnail || !instructions.length || !tag.length) {
            return res.status(400).json({
                success: false,
                message: 'All Fileds are required'
            });
        }

        if (!status || status === undefined) {
            status = "Draft";
        }

        // check current user is instructor or not , bcoz only instructor can create 
        // we have insert user id in req.user , (payload , while auth ) 
        const instructorId = req.user.id;


        // check given category is valid or not
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(401).json({
                success: false,
                message: 'Category Details not found'
            })
        }


        // upload thumbnail to cloudinary
        const thumbnailDetails = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create new course - entry in DB
        const newCourse = await Course.create({
            courseName, courseDescription, instructor: instructorId, whatYouWillLearn, price, category: categoryDetails._id,
            tag, status, instructions, thumbnail: thumbnailDetails.secure_url, createdAt: Date.now(),
        });

        // add course id to instructor courses list, this is bcoz - it will show all created courses by instructor 
        await User.findByIdAndUpdate(instructorId,
            {
                $push: {
                    courses: newCourse._id
                }
            },
            { new: true }
        );


        // Add the new course to the Categories
        await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );

        // return response
        res.status(200).json({
            success: true,
            data: newCourse,
            message: 'New Course created successfully'
        })
    }

    catch (error) {
        console.log('Error while creating new course');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while creating new course'
        })
    }
}


// ================ show all courses ================
// exports.getAllCourses = async (req, res) => {
//     try {
//         const allCourses = await Course.find({},
//             {
//                 courseName: true, courseDescription: true, price: true, thumbnail: true, instructor: true,
//                 ratingAndReviews: true, studentsEnrolled: true, category:true,tag:true, status: true,
//             })
//             .populate({
//                 path: 'instructor',
//                 select: 'firstName lastName email image'
//             })
//             .exec();

//         return res.status(200).json({
//             success: true,
//             data: allCourses,
//             message: 'Data for all courses fetched successfully'
//         });
//     }

//     catch (error) {
//         console.log('Error while fetching data of all courses');
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             error: error.message,
//             message: 'Error while fetching data of all courses'
//         })
//     }
// }
// exports.getAllCourses = async (req, res) => {
//     try {
//         const allCourses = await Course.find(
//             { status: 'Published' },  // Only find courses with status 'published'
//             {
//                 courseName: true, 
//                 courseDescription: true, 
//                 price: true, 
//                 thumbnail: true, 
//                 instructor: true,
//                 ratingAndReviews: true, 
//                 studentsEnrolled: true, 
//                 category: true,
//                 tag: true, 
//                 status: true,
//                 duration: true  // Added duration as it's used in the frontend
//             })
//             .populate({
//                 path: 'instructor',
//                 select: 'firstName lastName email image'
//             })
//             .exec();

//         return res.status(200).json({
//             success: true,
//             data: allCourses,
//             message: 'Data for all published courses fetched successfully'
//         });
//     }
//     catch (error) {
//         console.log('Error while fetching data of all courses');
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             error: error.message,
//             message: 'Error while fetching data of all courses'
//         })
//     }
// }
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find(
            { status: 'Published' },
            {
                courseName: true, 
                courseDescription: true, 
                price: true, 
                thumbnail: true, 
                instructor: true,
                ratingAndReviews: true, 
                studentsEnrolled: true, 
                category: true,
                tag: true, 
                status: true,
                courseContent: true  // Include courseContent to calculate duration
            })
            .populate({
                path: 'instructor',
                select: 'firstName lastName email image'
            })
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })
            .lean()  // Convert to plain JavaScript objects
            .exec();

        // Calculate duration for each course (similar to getEnrolledCourses)
        const coursesWithDuration = allCourses.map(course => {
            let totalDurationInSeconds = 0;
            if (course.courseContent) {
                course.courseContent.forEach(section => {
                    if (section.subSection) {
                        totalDurationInSeconds += section.subSection.reduce(
                            (acc, curr) => acc + parseInt(curr.timeDuration || 0), 0
                        );
                    }
                });
            }
            
            // Convert to duration string (similar to getEnrolledCourses)
            const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
            
            return {
                ...course,
                totalDuration,  // Formatted duration string
                duration: Math.ceil(totalDurationInSeconds / 60)  // Duration in hours (rounded up)
            };
        });

        return res.status(200).json({
            success: true,
            data: coursesWithDuration,
            message: 'Data for all published courses fetched successfully'
        });
    }
    catch (error) {
        console.error('Error while fetching data of all courses', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while fetching data of all courses'
        });
    }
};

// Helper function (same as used in getEnrolledCourses)


// ================ Get Course Details ================
exports.getCourseDetails = async (req, res) => {
    try {
        // get course ID
        const { courseId } = req.body;

        // find course details
        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")

            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    select: "-videoUrl",
                },
            })
            .exec()


        //validation
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`,
            });
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        // console.log('courseDetails -> ', courseDetails)
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        //return response
        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
            },
            message: 'Fetched course data successfully'
        })
    }

    catch (error) {
        console.log('Error while fetching course details');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while fetching course details',
        });
    }
}


// ================ Get Full Course Details ================
exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.user.id
        // console.log('courseId userId  = ', courseId, " == ", userId)

        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })

        //   console.log("courseProgressCount : ", courseProgressCount)

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        //   count total time duration of course
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [],
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



// ================ Edit Course Details ================
exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }

        // If Thumbnail Image is found, update it
        if (req.files) {
            // console.log("thumbnail update")
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key])
                } else {
                    course[key] = updates[key]
                }
            }
        }

        // updatedAt
        course.updatedAt = Date.now();

        //   save data
        await course.save()

        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        // success response
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Error while updating course",
            error: error.message,
        })
    }
}



// ================ Get a list of Course for a given Instructor ================
// exports.getInstructorCourses = async (req, res) => {
//     try {
//         // Get the instructor ID from the authenticated user or request body
//         const instructorId = req.user.id

//         // Find all courses belonging to the instructor
//         const instructorCourses = await Course.find({ instructor: instructorId, }).sort({ createdAt: -1 })


//         // Return the instructor's courses
//         res.status(200).json({
//             success: true,
//             data: instructorCourses,
//             // totalDurationInSeconds:totalDurationInSeconds,
//             message: 'Courses made by Instructor fetched successfully'
//         })
//     } catch (error) {
//         console.error(error)
//         res.status(500).json({
//             success: false,
//             message: "Failed to retrieve instructor courses",
//             error: error.message,
//         })
//     }
// }
exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;

        // Find all courses belonging to the instructor with necessary population
        const instructorCourses = await Course.find({ 
            instructor: instructorId 
        })
        .populate({
            path: 'courseContent',
            populate: {
                path: 'subSection'
            }
        })
        .sort({ createdAt: -1 })
        .lean()
        .exec();

        // Calculate duration for each course
        const coursesWithDuration = instructorCourses.map(course => {
            let totalDurationInSeconds = 0;
            if (course.courseContent) {
                course.courseContent.forEach(section => {
                    if (section.subSection) {
                        totalDurationInSeconds += section.subSection.reduce(
                            (acc, curr) => acc + parseInt(curr.timeDuration || 0), 0
                        );
                    }
                });
            }
            
            // Convert to duration string
            const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
            
            return {
                ...course,
                totalDuration,  // Formatted duration string (e.g., "2h 30m")
                duration: Math.ceil(totalDurationInSeconds / 60)  // Duration in hours (rounded up)
            };
        });

        res.status(200).json({
            success: true,
            data: coursesWithDuration,
            message: 'Courses made by Instructor fetched successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        });
    }
};

// Same helper function used in other controllers


// ================ Delete the Course ================
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body

        // Find the course
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            })
        }

        // delete course thumbnail From Cloudinary
        await deleteResourceFromCloudinary(course?.thumbnail);

        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId)
            if (section) {
                const subSections = section.subSection
                for (const subSectionId of subSections) {
                    const subSection = await SubSection.findById(subSectionId)
                    if (subSection) {
                        await deleteResourceFromCloudinary(subSection.videoUrl) // delete course videos From Cloudinary
                    }
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            // Delete the section
            await Section.findByIdAndDelete(sectionId)
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Error while Deleting course",
            error: error.message,
        })
    }
}
// controllers/analytics/getEnrollmentStats.js


exports.getEnrollmentStats = async (req, res) => {
  try {
    // Get current date and calculate date ranges
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    
    // Calculate monthly enrollments for the current year
    const monthlyEnrollments = await Course.aggregate([
      {
        $unwind: "$studentsEnrolled" // Split by each enrollment
      },
      {
        $lookup: {
          from: "users",
          localField: "studentsEnrolled",
          foreignField: "_id",
          as: "student"
        }
      },
      {
        $unwind: "$student"
      },
      {
        $project: {
          month: { $month: "$student.createdAt" },
          year: { $year: "$student.createdAt" }
        }
      },
      {
        $match: {
          year: currentYear
        }
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      },
      {
        $project: {
          month: "$_id",
          count: 1,
          _id: 0
        }
      }
    ])

    // Fill in missing months with zero counts
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1)
    const completeMonthlyData = allMonths.map(month => {
      const found = monthlyEnrollments.find(m => m.month === month)
      return {
        month: month,
        count: found ? found.count : 0
      }
    })

    // Calculate growth percentage compared to previous month
    let monthlyGrowth = 0
    if (completeMonthlyData.length > 1) {
      const currentMonth = currentDate.getMonth() + 1 // 1-12
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
      
      const currentData = completeMonthlyData.find(m => m.month === currentMonth)?.count || 0
      const prevData = completeMonthlyData.find(m => m.month === prevMonth)?.count || 0
      
      monthlyGrowth = prevData > 0 
        ? Math.round(((currentData - prevData) / prevData) * 100) 
        : currentData > 0 ? 100 : 0
    }

    // Calculate total revenue and revenue growth
    const revenueData = await Course.aggregate([
      {
        $project: {
          revenue: {
            $multiply: [
              "$price",
              { $size: { $ifNull: ["$studentsEnrolled", []] } }
            ]
          },
          createdAt: 1
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" },
          currentMonthRevenue: {
            $sum: {
              $cond: [
                { $eq: [{ $month: "$createdAt" }, currentDate.getMonth() + 1] },
                "$revenue",
                0
              ]
            }
          },
          previousMonthRevenue: {
            $sum: {
              $cond: [
                { $eq: [{ $month: "$createdAt" }, currentDate.getMonth()] },
                "$revenue",
                0
              ]
            }
          }
        }
      }
    ])

    const totalRevenue = revenueData[0]?.totalRevenue || 0
    const currentMonthRevenue = revenueData[0]?.currentMonthRevenue || 0
    const previousMonthRevenue = revenueData[0]?.previousMonthRevenue || 0

    const revenueGrowth = previousMonthRevenue > 0
      ? Math.round(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100)
      : currentMonthRevenue > 0 ? 100 : 0

    // Prepare response
    const response = {
      monthlyEnrollments: completeMonthlyData.map(item => ({
        month: new Date(currentYear, item.month - 1, 1).toLocaleString('default', { month: 'short' }),
        count: item.count
      })),
      monthlyGrowth,
      totalEnrollments: completeMonthlyData.reduce((sum, item) => sum + item.count, 0),
      totalRevenue,
      revenueGrowth
    }

    return res.status(200).json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error("Error fetching enrollment stats:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrollment statistics",
      error: error.message
    })
  }
}

// controllers/student/getStudentProgress.js

