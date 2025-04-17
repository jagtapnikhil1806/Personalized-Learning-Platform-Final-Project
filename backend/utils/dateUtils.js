// utils/dateUtils.js
function getPreviousMonth(date) {
    const d = new Date(date)
    d.setMonth(d.getMonth() - 1)
    return d.toISOString().slice(0, 7) // Returns YYYY-MM format
  }
  
  module.exports = getPreviousMonth
  