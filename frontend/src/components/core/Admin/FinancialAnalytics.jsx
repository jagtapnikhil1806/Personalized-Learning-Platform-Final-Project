// import { useState, useEffect } from "react"
// import { LineChartWithFill, StackedBarChart } from "./AdminCharts"

// export default function FinancialAnalytics({ payments = [], courses = [] }) {
//   const [timeRange, setTimeRange] = useState("12")
//   const [processedData, setProcessedData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       if (!payments || payments.length === 0) {
//         setError("No payment data available")
//         setLoading(false)
//         return
//       }

//       // Process monthly revenue data
//       const months = Array(parseInt(timeRange)).fill(0).map((_, i) => {
//         const date = new Date()
//         date.setMonth(date.getMonth() - i)
//         return date.toLocaleString('default', { month: 'short', year: '2-digit' })
//       }).reverse()

//       const monthlyRevenue = {}
//       const monthlyRevenueByCategory = {}
//       months.forEach(month => {
//         monthlyRevenue[month] = 0
//         monthlyRevenueByCategory[month] = {}
//       })

//       payments.forEach(payment => {
//         const date = new Date(payment.paymentDate || Date.now())
//         const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' })
        
//         if (monthlyRevenue.hasOwnProperty(monthKey)) {
//           monthlyRevenue[monthKey] += payment.amount || 0
          
//           const course = courses.find(c => c._id === payment.courseId)
//           if (course?.category?.name) {
//             if (!monthlyRevenueByCategory[monthKey][course.category.name]) {
//               monthlyRevenueByCategory[monthKey][course.category.name] = 0
//             }
//             monthlyRevenueByCategory[monthKey][course.category.name] += payment.amount || 0
//           }
//         }
//       })

//       // Get unique categories
//       const categories = [...new Set(courses.map(course => course.category?.name).filter(Boolean))]

//       setProcessedData({
//         monthlyRevenue,
//         monthlyRevenueByCategory,
//         months,
//         categories
//       })
//     } catch (err) {
//       console.error("Error processing data:", err)
//       setError("Failed to process financial data")
//     } finally {
//       setLoading(false)
//     }
//   }, [payments, courses, timeRange])

//   if (loading) {
//     return (
//       <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//         <p className="text-lg font-bold text-richblack-5">Loading financial analytics...</p>
//         <div className="animate-pulse h-[30vh] bg-richblack-700 rounded-md"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//         <p className="text-lg font-bold text-richblack-5">Financial Analytics</p>
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
//         <p className="text-lg font-bold text-richblack-5">Financial Analytics</p>
//         <div className="text-richblack-100 p-4 bg-richblack-700 rounded-md">
//           No data available to display.
//         </div>
//       </div>
//     )
//   }

//   const { monthlyRevenue, monthlyRevenueByCategory, months, categories } = processedData

//   const revenueTrendData = {
//     labels: months,
//     datasets: [
//       {
//         label: 'Monthly Revenue',
//         data: months.map(month => monthlyRevenue[month]),
//         borderColor: '#9966FF',
//         backgroundColor: 'rgba(153, 102, 255, 0.2)',
//         fill: true,
//       }
//     ]
//   }

//   const revenueByCategoryData = {
//     labels: months,
//     datasets: categories.map((category, index) => {
//       const colors = [
//         '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
//         '#FF9F40', '#8AC24A', '#F06292', '#7986CB', '#A1887F'
//       ]
//       return {
//         label: category,
//         data: months.map(month => monthlyRevenueByCategory[month][category] || 0),
//         backgroundColor: colors[index % colors.length],
//         borderColor: '#1e293b',
//         borderWidth: 1,
//       }
//     })
//   }

//   return (
//     <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6 h-full">
//       <div className="flex justify-between items-center">
//         <p className="text-lg font-bold text-richblack-5">Financial Analytics</p>
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
//             data={revenueTrendData}
//             title="Monthly Revenue Growth"
//             isCurrency={true}
//           />
//         </div>
//         <div className="rounded-xl bg-richblack-700 p-4">
//           <StackedBarChart 
//             data={revenueByCategoryData}
//             title="Revenue by Category"
//             isCurrency={true}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }