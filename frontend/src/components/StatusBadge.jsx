import React from 'react'

const statusConfig = {
  Baru: 'bg-blue-50 text-blue-700 border-blue-200',
  Dihubungi: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Selesai: 'bg-green-50 text-green-700 border-green-200',
  published: 'bg-green-50 text-green-700 border-green-200',
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  active: 'bg-blue-50 text-blue-700 border-blue-200',
  inactive: 'bg-gray-100 text-gray-600 border-gray-200',
}

const StatusBadge = ({ status }) => {
  const cls = statusConfig[status] || 'bg-gray-100 text-gray-600 border-gray-200'
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}`}>
      {status}
    </span>
  )
}

export default StatusBadge
