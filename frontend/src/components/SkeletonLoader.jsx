import React from 'react';

const shimmer = 'animate-pulse bg-slate-200 rounded-xl';

/** Single skeleton line */
export const SkeletonLine = ({ className = '' }) => (
  <div className={`${shimmer} h-4 ${className}`} />
);

/** Skeleton card block */
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-sm ${className}`}>
    <div className="flex items-center gap-3">
      <div className={`${shimmer} w-12 h-12 rounded-2xl`} />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="w-2/3" />
        <SkeletonLine className="w-1/3 h-3" />
      </div>
    </div>
    <SkeletonLine className="w-full" />
    <SkeletonLine className="w-4/5" />
  </div>
);

/** Skeleton trip card (horizontal) */
export const SkeletonTripCard = ({ className = '' }) => (
  <div className={`bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm flex ${className}`}>
    <div className={`${shimmer} w-48 h-36 flex-shrink-0 rounded-none`} />
    <div className="p-6 flex-1 space-y-3">
      <SkeletonLine className="w-2/3" />
      <SkeletonLine className="w-1/2 h-3" />
      <div className="flex gap-2 pt-1">
        <div className={`${shimmer} h-5 w-16 rounded-full`} />
        <div className={`${shimmer} h-5 w-20 rounded-full`} />
      </div>
    </div>
  </div>
);

/** Skeleton stat card */
export const SkeletonStat = () => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
    <div className={`${shimmer} w-12 h-12 rounded-2xl`} />
    <div className="space-y-2 flex-1">
      <SkeletonLine className="w-1/2 h-3" />
      <SkeletonLine className="w-1/3" />
    </div>
  </div>
);

/** Full-page auth loading */
export const SkeletonPage = () => (
  <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[#FDE6D5] border-t-[#C2410C] animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">🏔️</span>
      </div>
      <p className="text-sm text-[#92400E] font-semibold animate-pulse">Loading GlobeTrotter...</p>
    </div>
  </div>
);

/** Avatar skeleton */
export const SkeletonAvatar = ({ size = 10 }) => (
  <div className={`${shimmer} w-${size} h-${size} rounded-full`} />
);

export default SkeletonCard;
