// import React, { useEffect, useState } from "react"
// import { useParams } from "react-router-dom"

// import Footer from "../components/common/Footer"
// import Course_Card from '../components/core/Catalog/Course_Card'
// import Course_Slider from "../components/core/Catalog/Course_Slider"
// import Loading from './../components/common/Loading';

// import { getCatalogPageData } from '../services/operations/pageAndComponentData'
// import { fetchCourseCategories } from './../services/operations/courseDetailsAPI';




// function Catalog() {

//     const { catalogName } = useParams()
//     const [active, setActive] = useState(1)
//     const [catalogPageData, setCatalogPageData] = useState(null)
//     const [categoryId, setCategoryId] = useState("")
//     const [loading, setLoading] = useState(false);

//     // Fetch All Categories
//     useEffect(() => {
//         ; (async () => {
//             try {
//                 const res = await fetchCourseCategories();
//                 console.log( "fetchCourseCategories---->",res)
//                 const selectedCategory = res.find(
//                     (ct) => ct.name.toLowerCase().replace(/\s+/g, "-") === catalogName
//                   )
                  
//                   if (selectedCategory) {
//                     setCategoryId(selectedCategory._id)
//                   } else {
//                     console.error("Category not found for:", catalogName)
//                     setCatalogPageData(null)
//                   }
//                   console.log("Catalog name from URL:", catalogName)
// console.log("Category names:", res.map(ct => ct.name.toLowerCase().replace(/\s+/g, "-")))

//                 // const category_id = res.filter(
//                 //     (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
//                 // )[0]._id
//                 // setCategoryId(category_id)
//                 // console.log("category_id................",category_id)
//             } catch (error) {
//                 console.log("Could not fetch Categories.", error)
//             }
//         })()
//     }, [catalogName])


//     useEffect(() => {
//         if (categoryId) {
//             ; (async () => {
//                 setLoading(true)
//                 try {
//                     const res = await getCatalogPageData(categoryId)
//                     console.log( "getCatalogPageData---->",res)
//                     setCatalogPageData(res)
//                 } catch (error) {
//                     console.log(error)
//                 }
//                 setLoading(false)
//             })()
//         }
//     }, [categoryId])

//     console.log('======================================= ', catalogPageData)
//     console.log('categoryId ==================================== ', categoryId)

//     if (loading) {
//         return (
//             <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
//                 <Loading />
//             </div>
//         )
//     }
//     if (!loading && !catalogPageData) {
//         return (
//             <div className="text-white text-4xl flex justify-center items-center mt-[20%]">
//                 No Courses found for selected Category
//             </div>)
//     }



//     return (
//         <>
//             {/* Hero Section */}
//             <div className=" box-content bg-richblack-800 px-4">
//                 <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
//                     <p className="text-sm text-richblack-300">
//                         {`Home / Catalog / `}
//                         <span className="text-yellow-25">
//                             {catalogPageData?.selectedCategory?.name}
//                         </span>
//                     </p>
//                     <p className="text-3xl text-richblack-5">
//                         {catalogPageData?.selectedCategory?.name}
//                     </p>
//                     <p className="max-w-[870px] text-richblack-200">
//                         {catalogPageData?.selectedCategory?.description}
//                     </p>
//                 </div>
//             </div>

//             {/* Section 1 */}
//             <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
//                 <div className="section_heading">Courses to get you started</div>
//                 <div className="my-4 flex border-b border-b-richblack-600 text-sm">
//                     <p
//                         className={`px-4 py-2 ${active === 1
//                             ? "border-b border-b-yellow-25 text-yellow-25"
//                             : "text-richblack-50"
//                             } cursor-pointer`}
//                         onClick={() => setActive(1)}
//                     >
//                         Most Populer
//                     </p>
//                     <p
//                         className={`px-4 py-2 ${active === 2
//                             ? "border-b border-b-yellow-25 text-yellow-25"
//                             : "text-richblack-50"
//                             } cursor-pointer`}
//                         onClick={() => setActive(2)}
//                     >
//                         New
//                     </p>
//                 </div>
//                 <div>
//                     <Course_Slider
//                         Courses={catalogPageData?.selectedCategory?.courses}
//                     />
//                 </div>
//             </div>

//             {/* Section 2 */}
//             <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
//                 <div className="section_heading">
//                     Top courses in {catalogPageData?.differentCategory?.name}
//                 </div>
//                 <div>
//                     <Course_Slider
//                         Courses={catalogPageData?.differentCategory?.courses}
//                     />
//                 </div>
//             </div>

//             {/* Section 3 */}
//             <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
//                 <div className="section_heading">Frequently Bought</div>
//                 <div className="py-8">
//                     <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//                         {catalogPageData?.mostSellingCourses
//                             ?.slice(0, 4)
//                             .map((course, i) => (
//                                 <Course_Card course={course} key={i} Height={"h-[300px]"} />
//                             ))}
//                     </div>
//                 </div>
//             </div>

//             <Footer />
//         </>
//     )
// }

// export default Catalog


// ..............................................................................
// ..................................................................................

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/common/Footer";
import Course_Card from '../components/core/Catalog/Course_Card';
import Course_Slider from "../components/core/Catalog/Course_Slider";
import Loading from './../components/common/Loading';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import { fetchCourseCategories, getAllCourses } from './../services/operations/courseDetailsAPI';

function Catalog() {
    const { catalogName } = useParams();
    const [active, setActive] = useState(1);
    const [allCourses, setAllCourses] = useState([]); // State to store all courses
    const [categories, setCategories] = useState([]); // State to store all categories
    const [selectedCategories, setSelectedCategories] = useState([]); // State to store selected categories
    const [filteredCourses, setFilteredCourses] = useState([]); // State to store filtered courses
    const [loading, setLoading] = useState(false);

    // Fetch All Courses and Categories
    useEffect(() => {
        ; (async () => {
            setLoading(true);
            try {
                // Fetch all courses
                const courses = await getAllCourses();
                console.log("All Courses:", courses); // Log all courses
                setAllCourses(courses);
                setFilteredCourses(courses); // Initially, show all courses

                // Fetch all categories
                const categories = await fetchCourseCategories();
                setCategories(categories);
            } catch (error) {
                console.log("Could not fetch data.", error);
            }
            setLoading(false);
        })();
    }, []);

    // Handle Category Selection
    const handleCategoryChange = (categoryId) => {
        const updatedSelectedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter((id) => id !== categoryId) // Deselect category
            : [...selectedCategories, categoryId]; // Select category

        setSelectedCategories(updatedSelectedCategories);

        // Filter courses based on selected categories
        if (updatedSelectedCategories.length === 0) {
            setFilteredCourses(allCourses); // Show all courses if no category is selected
        } else {
            const filtered = allCourses.filter((course) => {
                const courseCategories = course.category || []; // Fallback to an empty array if category is undefined
                return updatedSelectedCategories.some((catId) =>
                    courseCategories.includes(catId) // Check if course belongs to any selected category
                );
            });
            setFilteredCourses(filtered);
        }
    };

    if (loading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <Loading />
            </div>
        );
    }

    if (!loading && allCourses.length === 0) {
        return (
            <div className="text-white text-4xl flex justify-center items-center mt-[20%]">
                No Courses found.
            </div>
        );
    }

    return (
        <>
            {/* Hero Section */}
            <div className="box-content bg-richblack-800 px-4">
                <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
                    <p className="text-sm text-richblack-300">
                        {`Home / Catalog`}
                    </p>
                    <p className="text-3xl text-richblack-5">All Courses</p>
                    <p className="max-w-[870px] text-richblack-200">
                        Explore a wide range of courses tailored to your interests.
                    </p>
                </div>
            </div>

            {/* Category Filter Section */}
            <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Filter by Category</div>
                <div className="my-4 flex flex-wrap gap-4">
                    {categories.map((category) => (
                        <label key={category._id} className="flex items-center gap-2 text-richblack-50">
                            <input
                                type="checkbox"
                                value={category._id}
                                checked={selectedCategories.includes(category._id)}
                                onChange={() => handleCategoryChange(category._id)}
                            />
                            {category.name}
                        </label>
                    ))}
                </div>
            </div>

            {/* Section 1: Most Popular Courses */}
            <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Courses to get you started</div>
                <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p
                        className={`px-4 py-2 ${active === 1
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                            } cursor-pointer`}
                        onClick={() => setActive(1)}
                    >
                        Most Popular
                    </p>
                    <p
                        className={`px-4 py-2 ${active === 2
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                            } cursor-pointer`}
                        onClick={() => setActive(2)}
                    >
                        New
                    </p>
                </div>
                <div>
                    {filteredCourses.length > 0 ? (
                        <Course_Slider Courses={filteredCourses} />
                    ) : (
                        <div className="text-richblack-50">No courses found for the selected categories.</div>
                    )}
                </div>
            </div>

            {/* Section 2: Top Courses in Selected Category */}
            {selectedCategories.length > 0 && (
                <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">
                        Top courses in {categories.find((cat) => cat._id === selectedCategories[0])?.name}
                    </div>
                    <div>
                        {filteredCourses.length > 0 ? (
                            <Course_Slider Courses={filteredCourses} />
                        ) : (
                            <div className="text-richblack-50">No courses found for the selected categories.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Section 3: Frequently Bought Courses */}
            <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Frequently Bought</div>
                <div className="py-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.slice(0, 4).map((course, i) => (
                                <Course_Card course={course} key={i} Height={"h-[300px]"} />
                            ))
                        ) : (
                            <div className="text-richblack-50">No courses found for the selected categories.</div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Catalog;



// import React, { useEffect, useState, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import Footer from "../components/common/Footer";
// import Course_Card from '../components/core/Catalog/Course_Card';
// import Course_Slider from "../components/core/Catalog/Course_Slider";
// import Loading from './../components/common/Loading';
// import { getAllCourses, fetchCourseCategories } from './../services/operations/courseDetailsAPI';
// import { useSelector } from "react-redux";

// function Catalog() {
//     const { user } = useSelector((state) => state.profile);
//     const [allCourses, setAllCourses] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // Fetch All Courses and Categories
//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const [courses, categories] = await Promise.all([
//                     getAllCourses(),
//                     fetchCourseCategories()
//                 ]);
//                 setAllCourses(courses || []);
//                 setCategories(categories || []);
//             } catch (err) {
//                 setError(err.message);
//                 console.error("Fetch error:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     // Safe course filtering
//     const filteredCourses = useMemo(() => {
//         return allCourses.filter(course => {
//             // Safely handle potentially undefined properties
//             const courseName = course?.name || '';
//             const courseDescription = course?.description || '';
//             const courseCategories = course?.category || [];

//             const matchesCategory = selectedCategories.length === 0 || 
//                 courseCategories.some(cat => selectedCategories.includes(cat));
            
//             const matchesSearch = searchQuery === '' || 
//                 courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 courseDescription.toLowerCase().includes(searchQuery.toLowerCase());
            
//             return matchesCategory && matchesSearch;
//         });
//     }, [allCourses, selectedCategories, searchQuery]);
//     const recommendedCourses = useMemo(() => {
//         if (!user || !user.courses || user.courses.length === 0) return [];
        
//         // Get categories of enrolled courses
//         const enrolledCategories = new Set();
//         user.courses.forEach(courseId => {
//             const course = allCourses.find(c => c._id === courseId);
//             if (course && course.category) {
//                 course.category.forEach(catId => enrolledCategories.add(catId));
//             }
//         });
        
//         // Filter courses that match these categories
//         return allCourses.filter(course => 
//             course.category && course.category.some(catId => enrolledCategories.has(catId))
//         ).slice(0, 4); // Limit to 4 recommended courses
//     }, [user, allCourses]);

//     const handleCategoryChange = (categoryId) => {
//         setSelectedCategories(prev => 
//             prev.includes(categoryId) 
//                 ? prev.filter(id => id !== categoryId) 
//                 : [...prev, categoryId]
//         );
//     };

//     if (loading) {
//         return (
//             <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
//                 <Loading />
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="text-red-400 text-center py-12">
//                 Error: {error}
//                 <button 
//                     onClick={() => window.location.reload()} 
//                     className="mt-4 btn bg-yellow-50 text-richblack-900 py-2 px-4 rounded"
//                 >
//                     Retry
//                 </button>
//             </div>
//         );
//     }

//     if (!loading && allCourses.length === 0) {
//         return (
//             <div className="text-white text-4xl flex justify-center items-center mt-48">
//                 No Courses found.
//             </div>
//         );
//     }

//     return (
//         <div className="bg-richblack-900 min-h-screen">
//             {/* Hero Section */}
//             <div className="bg-richblack-800 px-4 py-12">
//                 <div className="mx-auto max-w-7xl">
//                     <p className="text-sm text-richblack-300">Home / Catalog</p>
//                     <h1 className="text-3xl text-richblack-5 mt-2 font-semibold">All Courses</h1>
//                     <p className="max-w-3xl text-richblack-200 mt-4">
//                         Explore a wide range of courses tailored to your interests.
//                     </p>
//                 </div>
//             </div>

//             {/* Main Content with Sidebar */}
//             <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row gap-8">
//                 {/* Sidebar - Categories Filter */}
//                 <div className="w-full md:w-1/4 lg:w-1/5 bg-richblack-800 p-6 rounded-lg h-fit sticky top-4">
//                     <h2 className="text-xl text-richblack-5 mb-4 font-semibold">Categories</h2>
//                     <div className="space-y-3">
//                         {categories.map((category) => (
//                             <label key={category._id} className="flex items-center gap-3 text-richblack-5 hover:bg-richblack-700 p-2 rounded cursor-pointer">
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedCategories.includes(category._id)}
//                                     onChange={() => handleCategoryChange(category._id)}
//                                     className="h-4 w-4 rounded text-yellow-50 focus:ring-yellow-50 border-richblack-300"
//                                 />
//                                 <span>{category.name}</span>
//                             </label>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Main Content Area */}
//                 <div className="w-full md:w-3/4 lg:w-4/5">
//                     {/* Search Bar */}
//                     <div className="mb-8">
//                         <input
//                             type="text"
//                             placeholder="Search courses by name or description..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="w-full bg-richblack-700 text-richblack-5 p-3 rounded-lg border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50"
//                         />
//                     </div>

//                     {/* Recommended Courses (if any) */}
//                     {recommendedCourses.length > 0 && (
//                         <section className="mb-12">
//                             <h2 className="text-2xl text-richblack-5 font-semibold mb-6">
//                                 Recommended For You
//                             </h2>
//                             <Course_Slider Courses={recommendedCourses} />
//                         </section>
//                     )}

//                     {/* All Courses */}
//                     <section className="mb-12">
//                         <div className="flex justify-between items-center mb-6">
//                             <h2 className="text-2xl text-richblack-5 font-semibold">
//                                 {selectedCategories.length > 0 
//                                     ? `Filtered Courses (${filteredCourses.length})` 
//                                     : "All Courses"}
//                             </h2>
//                         </div>
                        
//                         {filteredCourses.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {filteredCourses.map((course) => (
//                                     <Course_Card 
//                                         key={course._id} 
//                                         course={course} 
//                                         Height="h-[300px]" 
//                                     />
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-12">
//                                 <p className="text-richblack-200 text-xl">
//                                     {selectedCategories.length > 0
//                                         ? "No courses match the selected categories"
//                                         : "No courses available"}
//                                 </p>
//                                 {selectedCategories.length > 0 && (
//                                     <button
//                                         onClick={() => setSelectedCategories([])}
//                                         className="mt-4 text-yellow-50 hover:underline"
//                                     >
//                                         Clear all filters
//                                     </button>
//                                 )}
//                             </div>
//                         )}
//                     </section>
//                 </div>
//             </div>

//             <Footer />
//         </div>
//     );
//     // Rest of your component remains the same...
//     // [Previous JSX rendering code]
// }

// export default Catalog;