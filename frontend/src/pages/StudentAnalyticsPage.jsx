
import { useEffect, useState } from 'react'
import { Pie, Bar } from 'react-chartjs-2'
import { fetchCourseCategories } from '../services/operations/courseDetailsAPI'
import { getUserEnrolledCourses } from "../services/operations/profileAPI"
import Loading from '../components/common/Loading'
import StatsCard from '../components/common/StatsCard'
import { useSelector } from "react-redux"

export default function StudentAnalyticsPage() {
    const { token } = useSelector((state) => state.auth)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [coursesData, categoriesData] = await Promise.all([
          getUserEnrolledCourses(token),
          fetchCourseCategories(token)
        ])

        setEnrolledCourses(coursesData)
        setCategories(categoriesData)
      } catch (err) {
        console.error('Error fetching student data:', err)
        setError(err.message || 'Failed to load student analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

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

  // Calculate summary statistics from enrolled courses
  const totalCourses = enrolledCourses.length
  const completedCourses = enrolledCourses.filter(
    course => course.progressPercentage === 100
  ).length
  const inProgressCourses = totalCourses - completedCourses

  // Calculate total time spent (assuming each course has totalDuration)
  const totalTimeSpent = enrolledCourses.reduce((total, course) => {
    return total + (parseInt(course.totalDuration) || 0)
  }, 0)

  // Prepare category distribution data
  const categoryDistribution = categories.map(category => ({
    name: category.name,
    count: enrolledCourses.filter(course => 
      course.category && course.category.toString() === category._id.toString()
    ).length
  }))

  // Prepare data for charts
  const progressData = {
    labels: ['Completed', 'In Progress'],
    datasets: [{
      data: [completedCourses, inProgressCourses],
      backgroundColor: ['#10B981', '#3B82F6'],
      hoverBackgroundColor: ['#059669', '#2563EB']
    }]
  }

  const categoryData = {
    labels: categoryDistribution.map(c => c.name),
    datasets: [{
      label: 'Courses Enrolled',
      data: categoryDistribution.map(c => c.count),
      backgroundColor: [
        '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6',
        '#6366F1', '#EF4444', '#14B8A6', '#F97316', '#8B5CF6'
      ],
      borderWidth: 1
    }]
  }

  const timeSpentData = {
    labels: enrolledCourses.map(course => course.courseName || 'Unknown Course'),
    datasets: [{
      label: 'Course Duration (hrs)',
      data: enrolledCourses.map(course => 
        Math.round((parseInt(course.totalDuration) || 0) / 60) // Convert minutes to hours
      ),
      backgroundColor: '#F59E0B',
      borderColor: '#D97706',
      borderWidth: 1
    }]
  }

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-3xl font-bold text-richblack-5">My Learning Analytics</h1>
      
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatsCard 
          title="Enrolled Courses" 
          value={totalCourses} 
          icon="📚"
        />
        <StatsCard 
          title="Completed Courses" 
          value={completedCourses} 
          icon="✅"
        />
        <StatsCard 
          title="In Progress" 
          value={inProgressCourses} 
          icon="⏳"
        />
        <StatsCard 
          title="Total Time Spent" 
          value={`${Math.round(totalTimeSpent / 60)} hrs`} 
          icon="⏱️"
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Course Progress Pie Chart */}
        <div className="rounded-xl bg-richblack-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-richblack-5">Course Completion Status</h2>
          <div className="h-64">
            <Pie 
              data={progressData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: '#E5E7EB'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Category Distribution Bar Chart */}
        <div className="rounded-xl bg-richblack-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-richblack-5">Courses by Category</h2>
          <div className="h-64">
            <Bar 
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: '#E5E7EB',
                      stepSize: 1
                    },
                    grid: {
                      color: '#4B5563'
                    }
                  },
                  x: {
                    ticks: {
                      color: '#E5E7EB'
                    },
                    grid: {
                      color: '#4B5563'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Time Spent Bar Chart */}
        <div className="rounded-xl bg-richblack-800 p-6 lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-richblack-5">Course Durations</h2>
          <div className="h-64">
            <Bar 
              data={timeSpentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Hours',
                      color: '#E5E7EB'
                    },
                    ticks: {
                      color: '#E5E7EB'
                    },
                    grid: {
                      color: '#4B5563'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Courses',
                      color: '#E5E7EB'
                    },
                    ticks: {
                      color: '#E5E7EB'
                    },
                    grid: {
                      color: '#4B5563'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl bg-richblack-800 p-6 lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-richblack-5">Course Progress</h2>
          <div className="space-y-4">
            {enrolledCourses.slice(0, 5).map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-richblack-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-richblack-5">{course.courseName || 'Unknown Course'}</h3>
                  <p className="text-sm text-richblack-200">
                    {categories.find(c => c._id.toString() === course.category?.toString())?.name || 'Uncategorized'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-richblack-5">
                    Duration: {course.totalDuration || 'N/A'}
                  </p>
                  <p className="text-sm text-yellow-50">
                    Progress: {course.progressPercentage || 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}