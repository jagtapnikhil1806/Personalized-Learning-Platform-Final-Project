import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default function AdminInstructorStats({ courses, instructors }) {
  // Process instructor data
  const instructorStats = instructors.map(instructor => {
    const instructorCourses = courses.filter(course => 
      course.instructor && course.instructor.toString() === instructor._id.toString()
    )
    const students = instructorCourses.reduce((sum, course) => 
      sum + (course.studentsEnrolled?.length || 0), 0)
    const revenue = instructorCourses.reduce((sum, course) => 
      sum + (course.price || 0) * (course.studentsEnrolled?.length || 0), 0)
    
    return {
      name: instructor.firstName + ' ' + instructor.lastName,
      courses: instructorCourses.length,
      students,
      revenue
    }
  }).sort((a, b) => b.students - a.students).slice(0, 5) // Top 5 instructors

  const data = {
    labels: instructorStats.map(i => i.name),
    datasets: [
      {
        label: 'Students',
        data: instructorStats.map(i => i.students),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      },
      {
        label: 'Courses',
        data: instructorStats.map(i => i.courses),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0'
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#e2e8f0'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#e2e8f0'
        }
      }
    }
  }

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  )
}