// import { useState, useEffect } from "react"
// import { LineChartWithFill, VerticalBarChart } from "./AdminCharts"

// export default function EnrollmentAnalytics({ enrollments = [], courses = [] }) {
//   const [timeRange, setTimeRange] = useState("12")
//   const [processedData, setProcessedData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       if (!enrollments || enrollments.length === 0) {
//         setError("No enrollment data available")
//         setLoading(false)
//         return
//       }

//       // Process monthly enrollment data
//       const months = Array(parseInt(timeRange)).fill(0).map((_, i) => {
//         const date = new Date()
//         date.setMonth(date.getMonth() - i)
//         return date.toLocaleString('default', { month: 'short', year: '2-digit' })
//       }).reverse()

//       const monthlyEnrollments = {}
//       months.forEach(month => {
//         monthlyEnrollments[month] = 0
//       })

//       enrollments.forEach(enrollment => {
//         const date = new Date(enrollment.enrollmentDate || Date.now())
//         const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' })
        
//         if (monthlyEnrollments.hasOwnProperty(monthKey)) {
//           monthlyEnrollments[monthKey] += 1
//         }
//       })

//       // Process top courses data
//       const courseEnrollments = {}
//       courses.forEach(course => {
//         courseEnrollments[course.courseName] = course.studentsEnrolled?.length || 0
//       })

//       const topCourses = Object.entries(courseEnrollments)
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 10)

//       setProcessedData({
//         monthlyEnrollments,
//         months,
//         topCourses
//       })
//     } catch (err) {
//       console.error("Error processing data:", err)
//       setError("Failed to process enrollment data")
//     } finally {
//       setLoading(false)
//     }
//   }, [enrollments, courses, timeRange])

//   if (loading) {
//     return (
//       <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//         <p className="text-lg font-bold text-richblack-5">Loading enrollment analytics...</p>
//         <div className="animate-pulse h-[30vh] bg-richblack-700 rounded-md"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//         <p className="text-lg font-bold text-richblack-5">Enrollment Analytics</p>
//         <div className="text-richblack-100 p-4 bg-richblack-700 rounded-md">
//           <p className="text-yellow-50 font-medium">Error:</p>
//           <p>{error}</p>
//         </div>
//       </div>
//     )
//   }

//   if (!processedData) {
//     return (
//       <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//         <p className="text-lg font-bold text-richblack-5">Enrollment Analytics</p>
//         <div className="text-richblack-100 p-4 bg-richblack-700 rounded-md">
//           No data available to display.
//         </div>
//       </div>
//     )
//   }

//   const { monthlyEnrollments, months, topCourses } = processedData

//   const enrollmentTrendData = {
//     labels: months,
//     datasets: [
//       {
//         label: 'Monthly Enrollments',
//         data: months.map(month => monthlyEnrollments[month]),
//         borderColor: '#4BC0C0',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         fill: true,
//       }
//     ]
//   }

//   const topCoursesData = {
//     labels: topCourses.map(course => course[0]),
//     datasets: [
//       {
//         label: 'Enrollments',
//         data: topCourses.map(course => course[1]),
//         backgroundColor: '#36A2EB',
//         borderColor: '#1e293b',
//         borderWidth: 1,
//       }
//     ]
//   }

//   return (
//     <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6 h-full">
//       <div className="flex justify-between items-center">
//         <p className="text-lg font-bold text-richblack-5">Enrollment Analytics</p>
//         <select 
//           value={timeRange}
//           onChange={(e) => setTimeRange(e.target.value)}
//           className="bg-richblack-700 text-richblack-100 rounded px-3 py-1 text-sm"
//         >
//           <option value="6">Last 6 Months</option>
//           <option value="12">Last 12 Months</option>
//           <option value="24">Last 2 Years</option>
//         </select>
//       </div>

//       <div className="grid grid-cols-1 gap-6 mt-4">
//         <div className="rounded-xl bg-richblack-700 p-4">
//           <LineChartWithFill 
//             data={enrollmentTrendData}
//             title="Monthly Enrollment Trend"
//           />
//         </div>
//         <div className="rounded-xl bg-richblack-700 p-4">
//           <VerticalBarChart 
//             data={topCoursesData}
//             title="Top 10 Most Enrolled Courses"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }