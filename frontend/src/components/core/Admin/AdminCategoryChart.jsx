// import { useState, useEffect } from "react"
// import { CategoryPieChart } from "./AdminCharts"

// export default function AdminCategoryChart({ courses = [], categories = [] }) {
//   const [currChart, setCurrChart] = useState("students")
//   const [processedData, setProcessedData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       if (!courses || !categories || courses.length === 0 || categories.length === 0) {
//         setError("No courses or categories data available")
//         setLoading(false)
//         return
//       }

//       const categoryMap = {}
//       categories.forEach(cat => {
//         if (!cat?._id || !cat?.name) {
//           console.warn("Invalid category item:", cat)
//           return
//         }
//         categoryMap[cat._id] = cat.name
//       })

//       const categoryData = {}
//       let processedCourses = 0
      
//       courses.forEach(course => {
//         if (!course?.category) {
//           console.warn("Course missing category:", course)
//           return
//         }
        
//         const categoryName = categoryMap[course.category]
//         if (!categoryName) {
//           console.warn(`Category not found for ID: ${course.category}`)
//           return
//         }
        
//         if (!categoryData[categoryName]) {
//           categoryData[categoryName] = {
//             students: 0,
//             income: 0
//           }
//         }
        
//         const studentsEnrolled = course.studentsEnrolled?.length || 0
//         categoryData[categoryName].students += studentsEnrolled
        
//         const courseIncome = (course.price || 0) * studentsEnrolled
//         categoryData[categoryName].income += courseIncome
        
//         processedCourses++
//       })

//       const categoryNames = Object.keys(categoryData)
//       if (categoryNames.length === 0) {
//         setError("No valid categories found in courses data")
//       } else {
//         setProcessedData({
//           categoryData,
//           categoryNames
//         })
//       }
//     } catch (err) {
//       console.error("Error processing data:", err)
//       setError("Failed to process chart data")
//     } finally {
//       setLoading(false)
//     }
//   }, [courses, categories])

//   const generateCategoryColors = (categoryNames) => {
//     const colorPalette = [
//       '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
//       '#FF9F40', '#8AC24A', '#F06292', '#7986CB', '#A1887F'
//     ]
    
//     return categoryNames.reduce((acc, category, index) => {
//       acc[category] = colorPalette[index % colorPalette.length]
//       return acc
//     }, {})
//   }

//   if (loading) {
//     return (
//       <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//         <p className="text-lg font-bold text-richblack-5">Loading category analytics...</p>
//         <div className="animate-pulse h-[30vh] bg-richblack-700 rounded-md"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//         <p className="text-lg font-bold text-richblack-5">Category Analytics</p>
//         <div className="text-richblack-100 p-4 bg-richblack-700 rounded-md">
//           <p className="text-yellow-50 font-medium">Error:</p>
//           <p>{error}</p>
//         </div>
//       </div>
//     )
//   }

//   if (!processedData || processedData.categoryNames.length === 0) {
//     return (
//       <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//         <p className="text-lg font-bold text-richblack-5">Category Analytics</p>
//         <div className="text-richblack-100 p-4 bg-richblack-700 rounded-md">
//           No data available to display.
//         </div>
//       </div>
//     )
//   }

//   const { categoryData, categoryNames } = processedData
//   const categoryColors = generateCategoryColors(categoryNames)

//   const chartDataStudents = {
//     labels: categoryNames,
//     datasets: [
//       {
//         data: categoryNames.map(name => categoryData[name].students),
//         backgroundColor: categoryNames.map(name => categoryColors[name]),
//         borderWidth: 1,
//         borderColor: '#1e293b',
//       },
//     ],
//   }

//   const chartIncomeData = {
//     labels: categoryNames,
//     datasets: [
//       {
//         data: categoryNames.map(name => categoryData[name].income),
//         backgroundColor: categoryNames.map(name => categoryColors[name]),
//         borderWidth: 1,
//         borderColor: '#1e293b',
//       },
//     ],
//   }

//   return (
//     <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6 overflow-hidden h-full">
//       <div className="space-x-4 font-semibold">
//         <button
//           onClick={() => setCurrChart("students")}
//           className={`rounded-sm p-1 px-3 transition-all duration-200 ${
//             currChart === "students"
//               ? "bg-richblack-700 text-yellow-50"
//               : "text-yellow-400"
//           }`}
//         >
//           Students by Category
//         </button>

//         <button
//           onClick={() => setCurrChart("income")}
//           className={`rounded-sm p-1 px-3 transition-all duration-200 ${
//             currChart === "income"
//               ? "bg-richblack-700 text-yellow-50"
//               : "text-yellow-400"
//           }`}
//         >
//           Income by Category
//         </button>
//       </div>

//       <CategoryPieChart 
//         data={currChart === "students" ? chartDataStudents : chartIncomeData}
//         title={currChart === "students" ? "Students by Category" : "Income by Category"}
//         isCurrency={currChart === "income"}
//       />

//       <div className="mt-4 text-richblack-100 text-sm">
//         <p>Total Categories: {categoryNames.length}</p>
//         <p>
//           Total {currChart === "students" ? "Students" : "Income"}: 
//           {currChart === "students" 
//             ? categoryNames.reduce((sum, name) => sum + categoryData[name].students, 0).toLocaleString('en-IN')
//             : '₹' + categoryNames.reduce((sum, name) => sum + categoryData[name].income, 0).toLocaleString('en-IN')
//           }
//         </p>
//       </div>
//     </div>
//   )
// }
import { useState, useEffect } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function AdminCategoryChart({ courses = [], categories = [] }) {
  const [currChart, setCurrChart] = useState("students")
  const [processedData, setProcessedData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Process data when courses or categories change
  useEffect(() => {
    try {
      setLoading(true)
      setError(null)
      
      // Debugging logs
      console.log("Courses data:", courses)
      console.log("Categories data:", categories)

      if (!courses || !categories || courses.length === 0 || categories.length === 0) {
        setError("No courses or categories data available")
        setLoading(false)
        return
      }

      // Create a map of category IDs to names
      const categoryMap = {}
      categories.forEach(cat => {
        if (!cat?._id || !cat?.name) {
          console.warn("Invalid category item:", cat)
          return
        }
        categoryMap[cat._id] = cat.name
      })

      // Debugging log
      console.log("Category map:", categoryMap)

      // Group courses by category and calculate totals
      const categoryData = {}
      let processedCourses = 0
      
      courses.forEach(course => {
        if (!course?.category) {
          console.warn("Course missing category:", course)
          return
        }
        
        const categoryName = categoryMap[course.category]
        if (!categoryName) {
          console.warn(`Category not found for ID: ${course.category}`)
          return
        }
        
        if (!categoryData[categoryName]) {
          categoryData[categoryName] = {
            students: 0,
            income: 0
          }
        }
        
        // Calculate students enrolled
        const studentsEnrolled = course.studentsEnrolled?.length || 0
        categoryData[categoryName].students += studentsEnrolled
        
        // Calculate income (price * students enrolled)
        const courseIncome = (course.price || 0) * studentsEnrolled
        categoryData[categoryName].income += courseIncome
        
        processedCourses++
      })

      // Debugging log
      console.log(`Processed ${processedCourses}/${courses.length} courses`)
      console.log("Category data:", categoryData)

      const categoryNames = Object.keys(categoryData)
      if (categoryNames.length === 0) {
        setError("No valid categories found in courses data")
      } else {
        setProcessedData({
          categoryData,
          categoryNames
        })
      }
    } catch (err) {
      console.error("Error processing data:", err)
      setError("Failed to process chart data")
    } finally {
      setLoading(false)
    }
  }, [courses, categories])

  // Generate consistent colors for categories
  const generateCategoryColors = (categoryNames) => {
    const colorPalette = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC24A', '#F06292', '#7986CB', '#A1887F'
    ]
    
    return categoryNames.reduce((acc, category, index) => {
      acc[category] = colorPalette[index % colorPalette.length]
      return acc
    }, {})
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
        <p className="text-lg font-bold text-richblack-5">Loading category analytics...</p>
        <div className="animate-pulse h-[30vh] bg-richblack-700 rounded-md"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
        <p className="text-lg font-bold text-richblack-5">Category Analytics</p>
        <div className="text-richblack-100 p-4 bg-richblack-700 rounded-md">
          <p className="text-yellow-50 font-medium">Error:</p>
          <p>{error}</p>
          <p className="mt-2 text-sm">Please check the console for more details.</p>
        </div>
      </div>
    )
  }

  if (!processedData || processedData.categoryNames.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
        <p className="text-lg font-bold text-richblack-5">Category Analytics</p>
        <div className="text-richblack-100 p-4 bg-richblack-700 rounded-md">
          No data available to display. There might be no courses with valid categories.
        </div>
      </div>
    )
  }

  const { categoryData, categoryNames } = processedData
  const categoryColors = generateCategoryColors(categoryNames)

  const chartDataStudents = {
    labels: categoryNames,
    datasets: [
      {
        data: categoryNames.map(name => categoryData[name].students),
        backgroundColor: categoryNames.map(name => categoryColors[name]),
        borderWidth: 1,
        borderColor: '#1e293b',
      },
    ],
  }

  const chartIncomeData = {
    labels: categoryNames,
    datasets: [
      {
        data: categoryNames.map(name => categoryData[name].income),
        backgroundColor: categoryNames.map(name => categoryColors[name]),
        borderWidth: 1,
        borderColor: '#1e293b',
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            let label = context.label || ''
            if (label) {
              label += ': '
            }
            if (currChart === 'income') {
              label += '₹' + context.raw.toLocaleString('en-IN')
            } else {
              label += context.raw.toLocaleString('en-IN') + ' students'
            }
            return label
          }
        }
      },
    },
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6 overflow-hidden">
      <p className="text-lg font-bold text-richblack-5">Category Analytics</p>

      <div className="space-x-4 font-semibold">
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students by Category
        </button>

        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income by Category
        </button>
      </div>

      <div className="relative mx-auto aspect-square h-[30vh] min-h-[250px] w-full">
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>

      <div className="mt-4 text-richblack-100 text-sm">
        <p>Total Categories: {categoryNames.length}</p>
        <p>
          Total {currChart === "students" ? "Students" : "Income"}: 
          {currChart === "students" 
            ? categoryNames.reduce((sum, name) => sum + categoryData[name].students, 0).toLocaleString('en-IN')
            : '₹' + categoryNames.reduce((sum, name) => sum + categoryData[name].income, 0).toLocaleString('en-IN')
          }
        </p>
      </div>
    </div>
  )
}