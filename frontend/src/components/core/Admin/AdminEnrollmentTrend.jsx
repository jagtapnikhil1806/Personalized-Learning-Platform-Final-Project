import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default function AdminEnrollmentTrend({ enrollmentStats }) {
  const data = {
    labels: enrollmentStats.monthlyEnrollments.map(item => item.month),
    datasets: [
      {
        label: 'Enrollments',
        data: enrollmentStats.monthlyEnrollments.map(item => item.count),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
      <Line data={data} options={options} />
    </div>
  )
}