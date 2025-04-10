// import { useState, useEffect } from "react"
// import { VerticalBarChart, StackedBarChart, LineChartWithFill } from "./AdminCharts"

// export default function OperationalMetrics({ 
//   instructors = [], 
//   supportTickets = [], 
//   courses = [],
//   teamMembers = []
// }) {
//   const [timeRange, setTimeRange] = useState("12")
//   const [activeTab, setActiveTab] = useState("instructors")
//   const [processedData, setProcessedData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       if (!instructors || instructors.length === 0) {
//         setError("No instructor data available")
//         setLoading(false)
//         return
//       }

//       // Process instructor performance
//       const instructorPerformance = instructors.map(instructor => {
//         const instructorCourses = courses.filter(course => course.instructorId === instructor._id)
//         const totalStudents = instructorCourses.reduce((sum, course) => {
//           return sum + (course.studentsEnrolled?.length || 0)
//         }, 0)
        
//         const totalRevenue = instructorCourses.reduce((sum, course) => {
//           return sum + ((course.price || 0) * (course.studentsEnrolled?.length || 0))
//         }, 0)
        
//         const completionRate = instructorCourses.length > 0 
//           ? instructorCourses.reduce((sum, course) => sum + (course.completionRate || 0), 0) / instructorCourses.length
//           : 0
        
//         return {
//           id: instructor._id,
//           name: `${instructor.firstName} ${instructor.lastName}`,
//           rating: instructor.avgRating || 0,
//           students: totalStudents,
//           revenue: totalRevenue,
//           completionRate: completionRate,
//           courseCount: instructorCourses.length
//         }
//       })

//       // Process ticket data by month
//       const months = Array(parseInt(timeRange)).fill(0).map((_, i) => {
//         const date = new Date()
//         date.setMonth(date.getMonth() - i)
//         return date.toLocaleString('default', { month: 'short', year: '2-digit' })
//       }).reverse()

//       const ticketTypes = ['Technical', 'Billing', 'Content', 'Other']
//       const ticketsByMonth = {}
//       months.forEach(month => {
//         ticketsByMonth[month] = {}
//         ticketTypes.forEach(type => {
//           ticketsByMonth[month][type] = 0
//         })
//       })

//       supportTickets.forEach(ticket => {
//         const date = new Date(ticket.createdAt || Date.now())
//         const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' })
//         const type = ticketTypes.includes(ticket.type) ? ticket.type : 'Other'
        
//         if (ticketsByMonth[monthKey]) {
//           ticketsByMonth[monthKey][type] += 1
//         }
//       })

//       // Process course production
//       const coursesByMonth = {}
//       months.forEach(month => {
//         coursesByMonth[month] = 0
//       })

//       courses.forEach(course => {
//         const date = new Date(course.createdAt || Date.now())
//         const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' })
        
//         if (coursesByMonth[monthKey] !== undefined) {
//           coursesByMonth[monthKey] += 1
//         }
//       })

//       // Process team capacity
//       const teamCapacityByMonth = {}
//       months.forEach(month => {
//         teamCapacityByMonth[month] = teamMembers.length * 3 // Assuming 3 courses per team member per month
//       })

//       setProcessedData({
//         instructorPerformance,
//         ticketsByMonth,
//         ticketTypes,
//         months,
//         coursesByMonth,
//         teamCapacityByMonth
//       })
//     } catch (err) {
//       console.error("Error processing data:", err)
//       setError("Failed to process operational data")
//     } finally {
//       setLoading(false)
//     }
//   }, [instructors, supportTickets, courses, teamMembers, timeRange])

//   if (loading) {
//     return (
//       <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//         <p className="text-lg font-bold text-richblack-5">Loading operational metrics...</p>
//         <div className="animate-pulse h-[30vh] bg-richblack-700 rounded-md"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//         <p className="text-lg font-bold text-richblack-5">Operational Metrics</p>
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
//         <p className="text-lg font-bold text-richblack-5">Operational Metrics</p>
//         <div className="text-richblack-100 p-4 bg-richblack-700 rounded-md">
//           No data available to display.
//         </div>
//       </div>
//     )
//   }

//   const { 
//     instructorPerformance,
//     ticketsByMonth,
//     ticketTypes,
//     months,
//     coursesByMonth,
//     teamCapacityByMonth
//   } = processedData

//   // Sort instructors based on active tab
//   const sortedInstructors = [...instructorPerformance].sort((a, b) => {
//     if (activeTab === "ratings") return b.rating - a.rating
//     if (activeTab === "completion") return b.completionRate - a.completionRate
//     return b.revenue - a.revenue
//   }).slice(0, 5)

//   const ticketsData = {
//     labels: months,
//     datasets: ticketTypes.map((type, index) => {
//       const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
//       return {
//         label: type,
//         data: months.map(month => ticketsByMonth[month][type]),
//         backgroundColor: colors[index % colors.length],
//         borderColor: '#1e293b',
//         borderWidth: 1,
//       }
//     })
//   }

//   const courseProductionData = {
//     labels: months,
//     datasets: [
//       {
//         label: 'Courses Created',
//         data: months.map(month => coursesByMonth[month]),
//         borderColor: '#FF9F40',
//         backgroundColor: 'rgba(255, 159, 64, 0.2)',
//         fill: true,
//       },
//       {
//         label: 'Team Capacity',
//         data: months.map(month => teamCapacityByMonth[month]),
//         borderColor: '#8AC24A',
//         backgroundColor: 'rgba(138, 194, 74, 0.2)',
//         fill: false,
//         borderDash: [5, 5],
//       }
//     ]
//   }

//   return (
//     <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6 h-full">
//       <div className="flex justify-between items-center">
//         <p className="text-lg font-bold text-richblack-5">Operational Metrics</p>
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

//       <div className="flex space-x-4 mt-4">
//         <button
//           onClick={() => setActiveTab("ratings")}
//           className={`px-4 py-2 rounded-md ${
//             activeTab === "ratings" ? "bg-yellow-100 text-richblack-900" : "bg-richblack-700 text-richblack-100"
//           }`}
//         >
//           Top by Ratings
//         </button>
//         <button
//           onClick={() => setActiveTab("completion")}
//           className={`px-4 py-2 rounded-md ${
//             activeTab === "completion" ? "bg-yellow-100 text-richblack-900" : "bg-richblack-700 text-richblack-100"
//           }`}
//         >
//           Top by Completion
//         </button>
//         <button
//           onClick={() => setActiveTab("revenue")}
//           className={`px-4 py-2 rounded-md ${
//             activeTab === "revenue" ? "bg-yellow-100 text-richblack-900" : "bg-richblack-700 text-richblack-100"
//           }`}
//         >
//           Top by Revenue
//         </button>
//       </div>

//       <div className="mt-4 rounded-xl bg-richblack-700 p-4">
//         <h3 className="text-richblack-5 font-semibold mb-4">Top Instructors by {activeTab === "ratings" ? "Ratings" : activeTab === "completion" ? "Completion Rates" : "Revenue"}</h3>
//         <div className="space-y-3">
//           {sortedInstructors.map((instructor, index) => (
//             <div key={instructor.id} className="flex items-center justify-between p-2 bg-richblack-600 rounded-md">
//               <div className="flex items-center">
//                 <span className="text-yellow-50 font-medium mr-2">{index + 1}.</span>
//                 <span className="text-richblack-5">{instructor.name}</span>
//               </div>
//               <div className="text-right">
//                 <p className="text-yellow-50">
//                   {activeTab === "ratings" && `${instructor.rating.toFixed(1)} ★`}
//                   {activeTab === "completion" && `${(instructor.completionRate * 100).toFixed(0)}%`}
//                   {activeTab === "revenue" && `₹${instructor.revenue.toLocaleString('en-IN')}`}
//                 </p>
//                 <p className="text-xs text-richblack-200">
//                   {instructor.courseCount} courses • {instructor.students.toLocaleString('en-IN')} students
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
//         <div className="rounded-xl bg-richblack-700 p-4">
//           <StackedBarChart 
//             data={ticketsData}
//             title="Support Tickets by Type"
//           />
//         </div>
//         <div className="rounded-xl bg-richblack-700 p-4">
//           <LineChartWithFill 
//             data={courseProductionData}
//             title="Course Production vs Team Capacity"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }