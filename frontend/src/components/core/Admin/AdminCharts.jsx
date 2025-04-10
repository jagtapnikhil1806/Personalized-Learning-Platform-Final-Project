// import { Chart, registerables } from "chart.js"
// import { Pie, Bar, Line } from "react-chartjs-2"
// import ChartDataLabels from 'chartjs-plugin-datalabels'

// Chart.register(...registerables, ChartDataLabels)

// export function CategoryPieChart({ data, title, isCurrency = false }) {
//   const options = {
//     maintainAspectRatio: false,
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           color: '#e2e8f0',
//           font: {
//             size: 12,
//           },
//           padding: 20,
//           usePointStyle: true,
//         }
//       },
//       datalabels: {
//         display: false
//       },
//       tooltip: {
//         backgroundColor: '#1e293b',
//         titleColor: '#f8fafc',
//         bodyColor: '#e2e8f0',
//         borderColor: '#334155',
//         borderWidth: 1,
//         padding: 12,
//         callbacks: {
//           label: function(context) {
//             let label = context.label || ''
//             if (label) {
//               label += ': '
//             }
//             if (isCurrency) {
//               label += '₹' + context.raw.toLocaleString('en-IN')
//             } else {
//               label += context.raw.toLocaleString('en-IN') + (title.includes('Students') ? ' students' : '')
//             }
//             return label
//           }
//         }
//       },
//     },
//   }

//   return (
//     <div className="flex flex-1 flex-col gap-y-4 h-full">
//       <p className="text-lg font-bold text-richblack-5">{title}</p>
//       <div className="relative mx-auto aspect-square h-[30vh] min-h-[250px] w-full">
//         <Pie data={data} options={options} />
//       </div>
//     </div>
//   )
// }

// export function VerticalBarChart({ data, title, isCurrency = false }) {
//   const options = {
//     maintainAspectRatio: false,
//     responsive: true,
//     scales: {
//       x: {
//         grid: {
//           display: false,
//           drawBorder: false,
//         },
//         ticks: {
//           color: '#94a3b8',
//         }
//       },
//       y: {
//         grid: {
//           color: '#334155',
//           drawBorder: false,
//         },
//         ticks: {
//           color: '#94a3b8',
//           callback: function(value) {
//             return isCurrency ? '₹' + value.toLocaleString('en-IN') : value.toLocaleString('en-IN')
//           }
//         }
//       }
//     },
//     plugins: {
//       legend: {
//         display: false,
//       },
//       datalabels: {
//         anchor: 'end',
//         align: 'top',
//         color: '#e2e8f0',
//         font: {
//           weight: 'bold'
//         },
//         formatter: function(value) {
//           return isCurrency ? '₹' + value.toLocaleString('en-IN') : value.toLocaleString('en-IN')
//         }
//       },
//       tooltip: {
//         backgroundColor: '#1e293b',
//         titleColor: '#f8fafc',
//         bodyColor: '#e2e8f0',
//         borderColor: '#334155',
//         borderWidth: 1,
//         padding: 12,
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || ''
//             if (label) {
//               label += ': '
//             }
//             if (isCurrency) {
//               label += '₹' + context.raw.toLocaleString('en-IN')
//             } else {
//               label += context.raw.toLocaleString('en-IN')
//             }
//             return label
//           }
//         }
//       },
//     },
//   }

//   return (
//     <div className="flex flex-1 flex-col gap-y-4 h-full">
//       <p className="text-lg font-bold text-richblack-5">{title}</p>
//       <div className="relative h-[30vh] min-h-[300px] w-full">
//         <Bar data={data} options={options} />
//       </div>
//     </div>
//   )
// }

// export function LineChartWithFill({ data, title, isCurrency = false }) {
//   const options = {
//     maintainAspectRatio: false,
//     responsive: true,
//     tension: 0.3,
//     scales: {
//       x: {
//         grid: {
//           display: false,
//           drawBorder: false,
//         },
//         ticks: {
//           color: '#94a3b8',
//         }
//       },
//       y: {
//         grid: {
//           color: '#334155',
//           drawBorder: false,
//         },
//         ticks: {
//           color: '#94a3b8',
//           callback: function(value) {
//             return isCurrency ? '₹' + value.toLocaleString('en-IN') : value.toLocaleString('en-IN')
//           }
//         }
//       }
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           color: '#e2e8f0',
//           usePointStyle: true,
//           padding: 20,
//         }
//       },
//       tooltip: {
//         backgroundColor: '#1e293b',
//         titleColor: '#f8fafc',
//         bodyColor: '#e2e8f0',
//         borderColor: '#334155',
//         borderWidth: 1,
//         padding: 12,
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || ''
//             if (label) {
//               label += ': '
//             }
//             if (isCurrency) {
//               label += '₹' + context.raw.toLocaleString('en-IN')
//             } else {
//               label += context.raw.toLocaleString('en-IN')
//             }
//             return label
//           }
//         }
//       },
//     },
//   }

//   return (
//     <div className="flex flex-1 flex-col gap-y-4 h-full">
//       <p className="text-lg font-bold text-richblack-5">{title}</p>
//       <div className="relative h-[30vh] min-h-[300px] w-full">
//         <Line data={data} options={options} />
//       </div>
//     </div>
//   )
// }

// export function StackedBarChart({ data, title, isCurrency = false }) {
//   const options = {
//     maintainAspectRatio: false,
//     responsive: true,
//     scales: {
//       x: {
//         stacked: true,
//         grid: {
//           display: false,
//           drawBorder: false,
//         },
//         ticks: {
//           color: '#94a3b8',
//         }
//       },
//       y: {
//         stacked: true,
//         grid: {
//           color: '#334155',
//           drawBorder: false,
//         },
//         ticks: {
//           color: '#94a3b8',
//           callback: function(value) {
//             return isCurrency ? '₹' + value.toLocaleString('en-IN') : value.toLocaleString('en-IN')
//           }
//         }
//       }
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           color: '#e2e8f0',
//           usePointStyle: true,
//           padding: 20,
//         }
//       },
//       tooltip: {
//         backgroundColor: '#1e293b',
//         titleColor: '#f8fafc',
//         bodyColor: '#e2e8f0',
//         borderColor: '#334155',
//         borderWidth: 1,
//         padding: 12,
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || ''
//             if (label) {
//               label += ': '
//             }
//             if (isCurrency) {
//               label += '₹' + context.raw.toLocaleString('en-IN')
//             } else {
//               label += context.raw.toLocaleString('en-IN')
//             }
//             return label
//           },
//           footer: function(tooltipItems) {
//             let sum = 0
//             tooltipItems.forEach(function(tooltipItem) {
//               sum += tooltipItem.parsed.y
//             })
//             return 'Total: ' + (isCurrency ? '₹' + sum.toLocaleString('en-IN') : sum.toLocaleString('en-IN'))
//           }
//         }
//       },
//     },
//   }

//   return (
//     <div className="flex flex-1 flex-col gap-y-4 h-full">
//       <p className="text-lg font-bold text-richblack-5">{title}</p>
//       <div className="relative h-[30vh] min-h-[300px] w-full">
//         <Bar data={data} options={options} />
//       </div>
//     </div>
//   )
// }