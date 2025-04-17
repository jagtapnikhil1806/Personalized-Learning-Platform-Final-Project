import { Doughnut } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default function AdminCourseStatusChart({ courses }) {
  const statusCounts = courses.reduce((acc, course) => {
    const status = course.status || 'Draft'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)'
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(16, 185, 129, 1)'
      ],
      borderWidth: 1
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
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
    }
  }

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  )
}