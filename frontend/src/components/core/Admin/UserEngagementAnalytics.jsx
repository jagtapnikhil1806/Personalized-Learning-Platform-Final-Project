// import { useState, useEffect } from "react"
// import { LineChartWithFill, VerticalBarChart, CategoryPieChart } from "./AdminCharts"

// export default function UserEngagementAnalytics({ userSessions = [] }) {
//   const [timeRange, setTimeRange] = useState("30")
//   const [processedData, setProcessedData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       if (!userSessions || userSessions.length === 0) {
//         setError("No user session data available")
//         setLoading(false)
//         return
//       }

//       // Process daily active users
//       const days = Array(parseInt(timeRange)).fill(0).map((_, i) => {
//         const date = new Date()
//         date.setDate(date.getDate() - i)
//         return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
//       }).reverse()

//       const dailyActiveUsers = {}
//       days.forEach(day => {
//         dailyActiveUsers[day] = 0
//       })

//       userSessions.forEach(session => {
//         const date = new Date(session.startTime || Date.now())
//         const dayKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        
//         if (dailyActiveUsers.hasOwnProperty(dayKey)) {
//           dailyActiveUsers[dayKey] += 1
//         }
//       })

//       // Process average session duration
//       const totalDuration = userSessions.reduce((sum, session) => {
//         return sum + (session.duration || 0)
//       }, 0)
//       const avgDuration = totalDuration / userSessions.length

//       // Process device breakdown
//       const deviceCounts = {
//         'Desktop': 0,
//         'Mobile': 0,
//         'Tablet': 0,
//         'Other': 0
//       }

//       userSessions.forEach(session => {
//         const device = session.deviceType || 'Other'
//         if (device.includes('Desktop')) {
//           deviceCounts['Desktop'] += 1
//         } else if (device.includes('Mobile')) {
//           deviceCounts['Mobile'] += 1
//         } else if (device.includes('Tablet')) {
//           deviceCounts['Tablet'] += 1
//         } else {
//           deviceCounts['Other'] += 1
//         }
//       })

//       setProcessedData({
//         dailyActiveUsers,
//         days,
//         avgDuration,
//         deviceCounts
//       })
//     } catch (err) {
//       console.error("Error processing data:", err)
//       setError("Failed to process user engagement data")
//     } finally {
//       setLoading(false)
//     }
//   }, [userSessions, timeRange])

//   if (loading) {
//     return (
//       <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//         <p className="text-lg font-bold text-richblack-5">Loading user engagement analytics...</p>
//         <div className="animate-pulse h-[30vh] bg-richblack-700 rounded-md"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//         <p className="text-lg font-bold text-richblack-5">User Engagement Analytics</p>
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
//         <p className="text-lg font-bold text-richblack-5">User Engagement Analytics</p>
//         <div className="text-richblack-100 p-4 bg-richblack-700 rounded-md">
//           No data available to display.
//         </div>
//       </div>
//     )
//   }

//   const { dailyActiveUsers, days, avgDuration, deviceCounts } = processedData

//   const activeUsersData = {
//     labels: days,
//     datasets: [
//       {
//         label: 'Daily Active Users',
//         data: days.map(day => dailyActiveUsers[day]),
//         borderColor: '#FF6384',
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         fill: true,
//       }
//     ]
//   }

//   const deviceData = {
//     labels: Object.keys(deviceCounts),
//     datasets: [
//       {
//         data: Object.values(deviceCounts),
//         backgroundColor: [
//           '#36A2EB',
//           '#FFCE56',
//           '#4BC0C0',
//           '#9966FF'
//         ],
//         borderWidth: 1,
//         borderColor: '#1e293b',
//       }
//     ]
//   }

//   return (
//     <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6 h-full">
//       <div className="flex justify-between items-center">
//         <p className="text-lg font-bold text-richblack-5">User Engagement Analytics</p>
//         <select 
//           value={timeRange}
//           onChange={(e) => setTimeRange(e.target.value)}
//           className="bg-richblack-700 text-richblack-100 rounded px-3 py-1 text-sm"
//         >
//           <option value="7">Last 7 Days</option>
//           <option value="30">Last 30 Days</option>
//           <option value="90">Last 90 Days</option>
//         </select>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
//         <div className="rounded-xl bg-richblack-700 p-4">
//           <LineChartWithFill 
//             data={activeUsersData}
//             title="Daily Active Users"
//           />
//         </div>
//         <div className="rounded-xl bg-richblack-700 p-4">
//           <CategoryPieChart 
//             data={deviceData}
//             title="Device Distribution"
//           />
//         </div>
//       </div>

//       <div className="mt-4 rounded-xl bg-richblack-700 p-4">
//         <div className="text-center">
//           <p className="text-richblack-100">Average Session Duration</p>
//           <p className="text-3xl font-bold text-yellow-50">
//             {Math.floor(avgDuration / 60)}m {Math.floor(avgDuration % 60)}s
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }