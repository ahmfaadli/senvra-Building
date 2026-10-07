import React from 'react'

export const Skeleton = ({ className = '' }) => (
  <div
    className={`bg-gray-200 animate-pulse rounded-lg ${className}`}
    aria-hidden="true"
  />
)

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-border overflow-hidden">
    <Skeleton className="w-full aspect-[4/3] rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  </div>
)

export const ProjectGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
)

export default Skeleton
