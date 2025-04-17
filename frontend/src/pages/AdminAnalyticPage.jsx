// import { useEffect, useState } from 'react'
// import AdminCategoryChart from '../components/core/Admin/AdminCategoryChart'
// import { fetchCourseCategories,getAllCourses } from '../services/operations/courseDetailsAPI'

// import Loading from '../components/common/Loading'

// export default function AdminAnalyticsPage() {
//   const [courses, setCourses] = useState([])
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         setError(null)
        
//         // Fetch both data in parallel
//         const [coursesData, categoriesData] = await Promise.all([
//           getAllCourses(),
//           fetchCourseCategories()
//         ])

//         // Log the received data for debugging
//         console.log('Fetched courses:', coursesData)
//         console.log('Fetched categories:', categoriesData)

//         if (!coursesData || !categoriesData) {
//           throw new Error('Failed to fetch required data')
//         }

//         setCourses(coursesData)
//         setCategories(categoriesData)
//       } catch (err) {
//         console.error('Error fetching data:', err)
//         setError(err.message || 'Failed to load analytics data')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   if (loading) {
//     return <Loading />
//   }

//   if (error) {
//     return (
//       <div className="grid h-[80vh] place-items-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-richblack-100">Error Loading Analytics</h2>
//           <p className="text-richblack-200 mt-2">{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="mt-4 rounded-lg bg-yellow-50 px-4 py-2 font-medium text-richblack-900 hover:bg-yellow-100"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       <h1 className="text-3xl font-bold text-richblack-5">Admin Analytics Dashboard</h1>
      
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         {/* Category Analytics Chart */}
//         <div className="rounded-xl bg-richblack-800 p-6">
//           <h2 className="mb-4 text-xl font-semibold text-richblack-5">Course Category Analytics</h2>
//           <AdminCategoryChart 
//             courses={courses} 
//             categories={categories} 
//           />
//         </div>

//         {/* You can add more analytics components here */}
//         <div className="rounded-xl bg-richblack-800 p-6">
//           <h2 className="mb-4 text-xl font-semibold text-richblack-5">Other Metrics</h2>
//           {/* Placeholder for additional charts/metrics */}
//           <div className="grid h-64 place-items-center text-richblack-200">
//             Additional analytics will appear here
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
//===============================================================================
// import { useEffect, useState } from 'react'
// import AdminCategoryChart from '../components/core/Admin/AdminCategoryChart'
// import EnrollmentAnalytics from '../components/core/Admin/EnrollmentAnalytics'
// import FinancialAnalytics from '../components/core/Admin/FinancialAnalytics'
// import UserEngagementAnalytics from '../components/core/Admin/UserEngagementAnalytics'
// import OperationalMetrics from '../components/core/Admin/OperationalMetrics'
// import { 
//   fetchCourseCategories,
//   getAllCourses,
//   getAllEnrollments,
//   getAllPayments,
//   getUserSessions,
//   getAllInstructors,
//   getSupportTickets,
//   getTeamMembers
// } from '../services/operations/courseDetailsAPI'
// import Loading from '../components/common/Loading'

// export default function AdminAnalyticsPage() {
//   const [courses, setCourses] = useState([])
//   const [categories, setCategories] = useState([])
//   const [enrollments, setEnrollments] = useState([])
//   const [payments, setPayments] = useState([])
//   const [userSessions, setUserSessions] = useState([])
//   const [instructors, setInstructors] = useState([])
//   const [supportTickets, setSupportTickets] = useState([])
//   const [teamMembers, setTeamMembers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         setError(null)
        
//         // Fetch all data in parallel
//         const [
//           coursesData, 
//           categoriesData, 
//           enrollmentsData, 
//           paymentsData,
//           userSessionsData,
//           instructorsData,
//           supportTicketsData,
//           teamMembersData
//         ] = await Promise.all([
//           getAllCourses(),
//           fetchCourseCategories(),
//           getAllEnrollments(),
//           getAllPayments(),
//           getUserSessions(),
//           getAllInstructors(),
//           getSupportTickets(),
//           getTeamMembers()
//         ])

//         setCourses(coursesData)
//         setCategories(categoriesData)
//         setEnrollments(enrollmentsData)
//         setPayments(paymentsData)
//         setUserSessions(userSessionsData)
//         setInstructors(instructorsData)
//         setSupportTickets(supportTicketsData)
//         setTeamMembers(teamMembersData)
//       } catch (err) {
//         console.error('Error fetching data:', err)
//         setError(err.message || 'Failed to load analytics data')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   if (loading) {
//     return <Loading />
//   }

//   if (error) {
//     return (
//       <div className="grid h-[80vh] place-items-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-richblack-100">Error Loading Analytics</h2>
//           <p className="text-richblack-200 mt-2">{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="mt-4 rounded-lg bg-yellow-50 px-4 py-2 font-medium text-richblack-900 hover:bg-yellow-100"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // Calculate key metrics
//   const totalStudents = enrollments.length
//   const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
//   const activeCourses = courses.filter(course => course.status === 'Published').length
//   const activeUsers = [...new Set(userSessions.map(session => session.userId))].length

//   return (
//     <div className="space-y-8 p-4">
//       <h1 className="text-3xl font-bold text-richblack-5">Admin Analytics Dashboard</h1>
      
//       {/* Top Row: Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="rounded-xl bg-richblack-800 p-6">
//           <p className="text-richblack-200">Total Students</p>
//           <p className="text-3xl font-bold text-yellow-50">{totalStudents.toLocaleString('en-IN')}</p>
//         </div>
//         <div className="rounded-xl bg-richblack-800 p-6">
//           <p className="text-richblack-200">Total Revenue</p>
//           <p className="text-3xl font-bold text-yellow-50">₹{totalRevenue.toLocaleString('en-IN')}</p>
//         </div>
//         <div className="rounded-xl bg-richblack-800 p-6">
//           <p className="text-richblack-200">Active Courses</p>
//           <p className="text-3xl font-bold text-yellow-50">{activeCourses.toLocaleString('en-IN')}</p>
//         </div>
//         <div className="rounded-xl bg-richblack-800 p-6">
//           <p className="text-richblack-200">Active Users</p>
//           <p className="text-3xl font-bold text-yellow-50">{activeUsers.toLocaleString('en-IN')}</p>
//         </div>
//       </div>

//       {/* Middle Row: Enrollment/Revenue and User Engagement */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="rounded-xl bg-richblack-800 p-6">
//           <EnrollmentAnalytics enrollments={enrollments} courses={courses} />
//         </div>
//         <div className="rounded-xl bg-richblack-800 p-6">
//           <FinancialAnalytics payments={payments} courses={courses} />
//         </div>
//       </div>

//       {/* Third Row: User Engagement and Category Analytics */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="rounded-xl bg-richblack-800 p-6">
//           <UserEngagementAnalytics userSessions={userSessions} />
//         </div>
//         <div className="rounded-xl bg-richblack-800 p-6">
//           <AdminCategoryChart courses={courses} categories={categories} />
//         </div>
//       </div>

//       {/* Bottom Row: Operational Metrics */}
//       <div className="rounded-xl bg-richblack-800 p-6">
//         <OperationalMetrics 
//           instructors={instructors} 
//           supportTickets={supportTickets} 
//           courses={courses}
//           teamMembers={teamMembers}
//         />
//       </div>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import AdminCategoryChart from '../components/core/Admin/AdminCategoryChart'
import AdminEnrollmentTrend from '../components/core/Admin/AdminEnrollmentTrend'
import AdminInstructorStats from '../components/core/Admin/AdminInstructorStats'
import AdminCourseStatusChart from '../components/core/Admin/AdminCourseStatusChart'
import { 
  fetchCourseCategories,
  getAllCourses,
 
  fetchEnrollmentStats 
} from '../services/operations/courseDetailsAPI'
import {fetchAllUsers} from '../services/operations/authAPI'
import StatsCard from '../components/common/StatsCard'
import Loading from '../components/common/Loading'

export default function AdminAnalyticsPage() {
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [enrollmentStats, setEnrollmentStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all data in parallel
        const [coursesData, categoriesData, usersData, statsData] = await Promise.all([
          getAllCourses(),
          fetchCourseCategories(),
          fetchAllUsers(),
          fetchEnrollmentStats()
        ])

        if (!coursesData || !categoriesData || !usersData || !statsData) {
          throw new Error('Failed to fetch required data')
        }

        setCourses(coursesData)
        setCategories(categoriesData)
        setUsers(usersData)
        setEnrollmentStats(statsData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message || 'Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="grid h-[80vh] place-items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-richblack-100">Error Loading Analytics</h2>
          <p className="text-richblack-200 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-yellow-50 px-4 py-2 font-medium text-richblack-900 hover:bg-yellow-100"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Calculate summary statistics
  const totalStudents = users.filter(user => user.accountType === 'Student').length
  const totalInstructors = users.filter(user => user.accountType === 'Instructor').length
  const totalCourses = courses.length
  const totalEnrollments = courses.reduce((sum, course) => sum + (course.studentsEnrolled?.length || 0), 0)
  const totalRevenue = courses.reduce((sum, course) => {
    const students = course.studentsEnrolled?.length || 0
    return sum + (course.price || 0) * students
  }, 0)

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-3xl font-bold text-richblack-5">Admin Analytics Dashboard</h1>
      
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Students" 
          value={totalStudents} 
          change={enrollmentStats.monthlyGrowth} 
          icon="👨‍🎓"
        />
        <StatsCard 
          title="Total Instructors" 
          value={totalInstructors} 
          change={0} // You can add instructor growth logic
          icon="👨‍🏫"
        />
        <StatsCard 
          title="Total Courses" 
          value={totalCourses} 
          change={0} // Add course growth logic
          icon="📚"
        />
        <StatsCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString('en-IN')}`} 
          change={enrollmentStats.revenueGrowth}
          icon="💰"
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Analytics Chart */}
        <div className="rounded-xl bg-richblack-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-richblack-5">Course Category Analytics</h2>
          <AdminCategoryChart 
            courses={courses} 
            categories={categories} 
          />
        </div>

        {/* Enrollment Trend Chart */}
        <div className="rounded-xl bg-richblack-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-richblack-5">Enrollment Trends</h2>
          <AdminEnrollmentTrend 
            enrollmentStats={enrollmentStats} 
          />
        </div>

        {/* Instructor Performance */}
        <div className="rounded-xl bg-richblack-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-richblack-5">Instructor Statistics</h2>
          <AdminInstructorStats 
            courses={courses} 
            instructors={users.filter(u => u.accountType === 'Instructor')} 
          />
        </div>

        {/* Course Status Distribution */}
        <div className="rounded-xl bg-richblack-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-richblack-5">Course Status Distribution</h2>
          <AdminCourseStatusChart 
            courses={courses} 
          />
        </div>
      </div>
    </div>
  )
}