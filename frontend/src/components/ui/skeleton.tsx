import * as React from 'react'
import { cn } from '../../lib/utils'

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-secondary-200',
        className
      )}
      {...props}
    />
  )
}

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  lastLineWidth?: string
}

function SkeletonText({ lines = 3, lastLineWidth = '70%', className, ...props }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? '' : 'w-full'
          )}
          style={i === lines - 1 ? { width: lastLineWidth } : undefined}
        />
      ))}
    </div>
  )
}

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hasImage?: boolean
}

function SkeletonCard({ hasImage = false, className, ...props }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-secondary-200 bg-white p-6',
        className
      )}
      {...props}
    >
      {hasImage && <Skeleton className="mb-4 h-48 w-full" />}
      <div className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <SkeletonText lines={2} />
      </div>
    </div>
  )
}

export interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
  columns?: number
}

function SkeletonTable({ rows = 5, columns = 4, className, ...props }: SkeletonTableProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-secondary-200 bg-white overflow-hidden',
        className
      )}
      {...props}
    >
      
      <div className="flex gap-4 bg-secondary-50 p-4 border-b border-secondary-200">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 p-4 border-b border-secondary-100 last:border-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable }
