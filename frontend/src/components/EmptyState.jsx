import React from 'react'
import { FolderOpen } from 'lucide-react'

const EmptyState = ({ icon: Icon = FolderOpen, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
      <Icon size={28} className="text-gray" aria-hidden="true" />
    </div>
    <h3 className="text-lg font-semibold text-dark mb-2">{title}</h3>
    <p className="text-gray text-sm max-w-xs leading-relaxed">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
)

export default EmptyState
