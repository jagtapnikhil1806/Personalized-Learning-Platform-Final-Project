// components/core/Admin/StatsCard.jsx
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"

export default function StatsCard({ title, value, change = 0, icon }) {
  const isPositive = change >= 0
  const changeColor = isPositive ? "text-green-400" : "text-pink-400"
  const ChangeIcon = isPositive ? ArrowUpIcon : ArrowDownIcon

  return (
    <div className="rounded-xl bg-richblack-800 p-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-richblack-200">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      
      <div className="mt-4">
        <p className="text-3xl font-bold text-richblack-5">{value}</p>
        
        {change !== 0 && (
          <div className={`mt-2 flex items-center text-sm ${changeColor}`}>
            <ChangeIcon className="h-4 w-4 mr-1" />
            <span>
              {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'} from last month
            </span>
          </div>
        )}
      </div>
    </div>
  )
}