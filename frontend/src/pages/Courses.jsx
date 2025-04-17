
import React, { useEffect, useState } from 'react';
import { getAllCourses, fetchCourseCategories } from '../services/operations/courseDetailsAPI';
import { getUserEnrolledCourses } from '../services/operations/profileAPI';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import ProgressBar from "@ramonak/react-progress-bar";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all courses and categories in parallel
        const [coursesData, categoriesData] = await Promise.all([
          getAllCourses(),
          fetchCourseCategories()
        ]);
        
        // Create a map of category IDs to names
        const map = {};
        categoriesData.forEach(cat => {
          if (cat?._id && cat?.name) {
            map[cat._id] = cat.name;
          }
        });

        // Fetch enrolled courses if user is logged in
        let enrolledData = [];
        
        if (token) {
          enrolledData = await getUserEnrolledCourses(token);
          console.log("Enrolled courses:", enrolledData);
        }
        
        setCourses(coursesData);
        setCategories(['All', ...categoriesData.map(cat => cat.name)]);
        setCategoryMap(map);
        setEnrolledCourses(enrolledData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Helper function to get category name
  const getCategoryName = (course) => {
    if (!course?.category) return 'Uncategorized';
    
    if (typeof course.category === 'object' && course.category?.name) {
      return course.category.name;
    }
    
    if (typeof course.category === 'string') {
      return categoryMap[course.category] || 'Uncategorized';
    }
    
    return 'Uncategorized';
  };

  // Check if a course is enrolled
  const isCourseEnrolled = (courseId) => {
    return enrolledCourses.some(course => course._id === courseId);
  };

  
  // Updated getRecommendedCourses function
  const getRecommendedCourses = () => {
    try {
      if (enrolledCourses.length > 0) {
        const enrolledCategoryIds = [...new Set(
          enrolledCourses.map(course => {
            if (!course.category) return null;
            return typeof course.category === 'object'
              ? course.category._id
              : course.category;
          }).filter(Boolean)
        )];
  
        console.log("Enrolled category IDs:", enrolledCategoryIds);
  
        const recommended = courses.filter(course => {
          if (!course.category) return false;
  
          const courseCategoryId = typeof course.category === 'object'
            ? course.category._id
            : course.category;
  
          return enrolledCategoryIds.includes(courseCategoryId) &&
                 !isCourseEnrolled(course._id);
        });
  
        console.log("Recommended same-category:", recommended);
  
        if (recommended.length > 0) {
          return recommended.slice(0, 4);
        }
      }
  
      const beginnerCourses = courses.filter(course =>
        (course?.tag?.includes('beginner') ||
        course?.difficulty?.toLowerCase() === 'beginner')
      );
  
      console.log("Fallback beginner courses:", beginnerCourses);
  
      return beginnerCourses.slice(0, 4);
    } catch (error) {
      console.error("Error in getRecommendedCourses:", error);
      return [];
    }
  };
  

  const recommendedCourses = getRecommendedCourses();
  const showRecommended = recommendedCourses.length > 0 && !loading;

  const filteredCourses = courses.filter(course => {
    const courseCategory = getCategoryName(course);
    const categoryMatch = activeCategory === 'All' || 
                         courseCategory === activeCategory;
    const searchMatch = course?.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       course?.courseDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });
  
 
  return (
    <div className="bg-richblack-900 text-richblack-5 min-h-[calc(100vh-3.5rem)]">
      {/* Hero Section */}
      <div className="bg-richblack-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Browse Our Courses</h1>
          <p className="text-lg text-richblack-200 max-w-3xl mx-auto">
            Find the perfect course to advance your skills and career.
          </p>
        </div>
      </div>

      {/* Recommended Section */}
      {/* {showRecommended && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h2 className="text-2xl font-bold mb-4">
            {enrolledCourses.length > 0 
              ? 'Recommended for you' 
              : 'Start learning with these beginner courses'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-richblack-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                <div className="h-40 bg-richblack-700 overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-richblack-600 flex items-center justify-center">
                      <span className="text-richblack-200">No thumbnail</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-richblack-5 line-clamp-1">
                      {course.courseName}
                    </h3>
                    <span className="bg-richblack-600 text-richblack-5 text-xs px-2 py-1 rounded-full">
                      {getCategoryName(course)}
                    </span>
                  </div>
                  <p className="text-richblack-200 text-xs mb-2 line-clamp-2">
                    {course.courseDescription}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-50 text-sm font-medium">
                      {course.price === 0 ? 'Free' : `₹${course.price}`}
                    </span>
                    <span className="text-richblack-300 text-xs">
                      {course.duration} hours
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}
     {showRecommended && (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <h2 className="text-2xl font-bold mb-4">
      {enrolledCourses.length > 0 
        ? 'Recommended for you' 
        : 'Start learning with these beginner courses'}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {recommendedCourses.map((course) => (
        <div
          key={course._id}
          className="bg-richblack-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer relative"
          onClick={() => navigate(`/courses/${course._id}`)}
        >
          {/* Recommended Tag with Gradient Background */}
          <div className="absolute top-3 right-3 z-10">
            <span 
              className="text-white text-xs font-medium px-2 py-1 rounded-full"
              style={{
                background: "linear-gradient(to right, #3F5EFB, #FC466B)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
              }}
            >
              Recommended
            </span>
          </div>

          <div className="h-40 bg-richblack-700 overflow-hidden">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-richblack-600 flex items-center justify-center">
                <span className="text-richblack-200">No thumbnail</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-richblack-5 line-clamp-1">
                {course.courseName}
              </h3>
              <span className="bg-richblack-600 text-richblack-5 text-xs px-2 py-1 rounded-full">
                {getCategoryName(course)}
              </span>
            </div>
            <p className="text-richblack-200 text-xs mb-2 line-clamp-2">
              {course.courseDescription}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-yellow-50 text-sm font-medium">
                {course.price === 0 ? 'Free' : `₹${course.price}`}
              </span>
              <span className="text-richblack-300 text-xs">
                {course.totalDuration}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
      {/* Filter and Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-yellow-50 text-richblack-900'
                    : 'bg-richblack-700 text-richblack-5 hover:bg-richblack-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 bg-richblack-700 text-richblack-5 px-4 py-2 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-50"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-richblack-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50 mx-auto mb-4"></div>
            <p>Loading courses...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p className="mb-2">Error loading courses</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-yellow-50 underline"
            >
              Try again
            </button>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = isCourseEnrolled(course._id);
              return (
                <div
                  key={course._id}
                  className={`bg-richblack-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer relative ${
                    isEnrolled ? 'ring-2 ring-yellow-50' : ''
                  }`}
                  onClick={() => {
                    if (isEnrolled) {
                      navigate(
                        `/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                      );
                    } else {
                      navigate(`/courses/${course._id}`);
                    }
                  }}
                >
                  {isEnrolled && (
                    <div className="absolute top-2 right-2 bg-yellow-50 text-richblack-900 text-xs px-2 py-1 rounded-full">
                      Enrolled
                    </div>
                  )}
                  <div className="h-48 bg-richblack-700 overflow-hidden">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-richblack-600 flex items-center justify-center">
                        <span className="text-richblack-200">No thumbnail</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-richblack-5">
                        {course.courseName}
                      </h3>
                      <span className="bg-richblack-600 text-richblack-5 text-xs px-2 py-1 rounded-full">
                        {getCategoryName(course)}
                      </span>
                    </div>
                    <p className="text-richblack-200 text-sm mb-4 line-clamp-2">
                      {course.courseDescription}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-50 font-medium">
                        {course.price === 0 ? 'Free' : `₹${course.price}`}
                      </span>
                      <span className="text-richblack-300 text-sm">
                        {course.totalDuration} 
                      </span>
                    </div>
                    {isEnrolled && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress:</span>
                          <span>
                            {enrolledCourses.find(ec => ec._id === course._id)?.progressPercentage || 0}%
                          </span>
                        </div>
                        <ProgressBar
                          completed={enrolledCourses.find(ec => ec._id === course._id)?.progressPercentage || 0}
                          height="6px"
                          isLabelVisible={false}
                          bgColor="#F1C40F"
                          baseBgColor="#2D3748"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-richblack-5 mb-2">
              No courses found
            </h3>
            <p className="text-richblack-200">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
